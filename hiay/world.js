var po = org.polymaps;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: 40, lon: 0})
    .zoomRange([1, 4])
    .zoom(3)
    .add(po.interact());

map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
    + "/998/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

// map.add(po.compass()
//     .pan("none"));

var sgclient = new simplegeo.ContextClient("7vjnXKDbSQUMAxZxXwYSYduyADt28j6d")

var locations = [];
var locationCounts = {};
FB.api({method: "fql.query", 
        query: "SELECT current_location,uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1="+FB.getSession().uid+")"},
        function(resp) {
            $.each(resp, function(i, o) {
                if(o.current_location != null) {
                    locations.push(o.current_location);
                    
                    // Using .name to count because there's more than one London for example (in USA).
                    if(o.current_location.name != undefined) {
                        if(!(o.current_location.name in locationCounts)) {
                            locationCounts[o.current_location.name] = 1;
                        } else {
                            locationCounts[o.current_location.name] += 1;
                        }
                    }
                }
            });
        });

// ascending
var sortByValue = function(keys, obj) {
    return keys.sort(function(a, b) { 
        return obj[a] - obj[b];
    });
}

var locationNames = [];
$.each(locationCounts, function(k,v) { locationNames.push(k) });
sortedLocations = (sortByValue(locationNames, locationCounts)).reverse();

var locationCoords = {};
//var geoFeatures = [];
$.each(locationCounts, function(key, val) {
    sgclient.getContextFromAddress(key, function(err, data) {
        if(err) {
            console.error(err);
        } else {
            //console.info(key);
            //console.info(data.query);
            locationCoords[key] = data.query;
            var gf = { geometry: {coordinates: [data.query.longitude, data.query.latitude], type: "Point"}, properties: {count: val} };
            map.add(po.geoJson().features([gf]).on("load", load));
        }
    });
});

// this should be after Polymaps is inited inside that div
var svg = n$("#map").add("svg:svg");

function load(e) {
  var r = 5;
  for (var i = 0; i < e.features.length; i++) {
    var c = n$(e.features[i].element),
        g = c.parent().add("svg:g", c);
    
    g.attr("transform", "translate(" + c.attr("cx") + "," + c.attr("cy") + ")");

    var h = Math.floor(150-(150*locationCounts[sortedLocations[0]]/e.features[0].data.properties.count));

    g.add(c
        .attr("fill", "hsl(" + h + ", 100%, 50%)")
        .attr("r", r)
        .attr("cx", null)
        .attr("cy", null));
  }
}
