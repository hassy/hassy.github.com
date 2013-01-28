GAPP Documentation
====================

This document aims to help future development of the GAPP project.


Overview
--------------------

GAPP is a custom interface to AISS.org that makes it easy for users to find
resources. All of the functionality is developed in JavaScrpt and the
ALISS.org API provides all of the data that is used.

The code is all stored within the directory 'js' and a subdirectly within
that directory called 'libs' holds all of the external JavaScript libraries.


Libraries
--------------------
The GAPP project utilises a number JavaScript libraries to aid development
and maintainability in the long run. These are;

jQuery and Plugins
~~~~~~~~~~~~~~~~~~~~
Used primarily to aid DOM interaction and perform XHR. Being one of the most
common JavaScript libraries its very useful and was able to help with the
autocomplestion and other features.

The plugin JQuery Expander is used to safely truncate the descriptions in
search results. As the content from ALISS.org may contain HTML its not safe
to simply perform a substring operation within JavaScript. Thus, the full
content is rendered but partially hidden.

Backbone.js and Underscore.js
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Backbone.js is a MVC framework for JavaScript. It enabled the implementation
of models, views and controllers that are then used to interact with the
ALISS.org API.

These models and views are described below and hold the majority of the
logic for the GAPP interface.

Underscore.js is used for two reasons, it is a dependancies of Backbone and
it also provies templates which are used by the views to render different
parts of the pages.

Backbone.js is designed to work with REST interfaces and thus makes use of
GET, POST, DELETE and UPDATE HTTP requests. However, since the ALISS.org API
meeds to be accessed with JSONP, we are only able to acces it with GET
requests. For this reason, a custom Backbone.Sync implementation is used.


Modernizer
~~~~~~~~~~~~~~~~~~~~
Modernizer is a JavaScript library that when included aids older browsers in
dealing with modern HTML5 elements. While it wont allow them to be used in
full it will prevent browsers such as internet explorer 6 raising an error
when they are encountered.

It also provides a number of features to aid feature detection when
determining what the current users browser supports.

locache.js
~~~~~~~~~~~~~~~~~~~~
locache is JavaScript library that provies a simple API to localStorage that
supports storing values with an expiration time. This is used to cache results
when possible from the ALISS.org API. This provides great flexibility over
the API and can improve performance in many cases.


Models
--------------------
There are two key models in the GAPP interface; `Resource` and `SavedSearch`.
The Resource model represents an individual resource on ALISS.org and a
SavedSearch represents a saved search that will be shown on the left - these
are entered in ALISS.org by an admin user for that account.

The Models are backed up by collections, that perform operations or large
sums of these models. For example, the `ResourceCollection` is used to handle
the search results and handle batches of resources.


Views
--------------------
There are three key views, these are GoogleMapView, ResourceView and
SearchView. They are fairly self explanitory - the google map view controls
the google map and the markers being placed on that map. The search view
handled the searching and displaying results while the resource view shows
individual (or multiple) resources in detail.