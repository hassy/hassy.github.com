window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

/*jshint asi:true */

$(function(){

    "use strict";

    /*
     * Replace Backbone.sync with a sync function that uses JSONP and always
     * uses a GET request. Also add optional caching for models.
     */

    Backbone.sync = function(method, model, options) {

        var getValue = function(object, prop) {
            if (!(object && object[prop])) return null
            return _.isFunction(object[prop]) ? object[prop]() : object[prop]
        }

        var type = 'GET'

        // Default options, unless specified.
        options || (options = {})

        // Default JSON-request options.
        var params = {type: type, dataType: 'jsonp'}

        // Ensure that we have a URL.
        if (!options.url) {
            params.url = getValue(model, 'url')
        }

        var cache_key = params.url + $.param(options.data)

        if (model.cache){
            var cached_response = locache.get(cache_key)
            if (cached_response && options.success){
                var success_f = options.success
                if (success_f) {
                    success_f(cached_response, "success", {})
                }
                return
            }
        }

        // Ensure that we have the appropriate request data.
        if (!options.data && model && (method == 'create' || method == 'update')) {
            params.contentType = 'application/json'
            params.data = JSON.stringify(model.toJSON())
        }

        var success = options.success
        options.success = function(resp, status, xhr) {
            if (model.cache) locache.set(cache_key, resp, model.cache_time)
            if (success) success(resp, status, xhr)
        }

        // Make the request, allowing the user to override any Ajax options.
        return $.ajax(_.extend(params, options))
    }

    $.fn.serializeHash = function(){
        var o = {}
        var a = this.serializeArray()
        $.each(a, function() {
            o[this.name] = this.value
        })
        return o
    }

});