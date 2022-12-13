// Store our API endpoint as queryUrl.
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (response) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(response.features);
});

function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, magnitude and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3>
                        <h2>Magnitude: ${feature.properties.mag}</h2>
                        <hr>
                        <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                        <p>${new Date(feature.properties.time)}</p>`);
    }

    function createCircles(feature, layer) {
      return L.circleMarker(layer);
    }

    function getSize (magnitude) {
      return (magnitude * 4)
    }

    function getColor (depth) {
      if (depth >= 50.0) return "#8B0000";
      else if (depth > 25.0 && depth <= 49.9) return "#ff8c00";
      else if (depth > 15.0 && depth <= 24.9) return "#FF7F50";
      else if (depth > 5.0 && depth <= 14.9) return "#FBCEB1";
      else return "#FFFF99"
    }

    function generateEarthquakeStyle (feature) {
      return {color: getColor (feature.geometry.coordinates[2]), radius: getSize (feature.properties.mag)} 
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircles,
        style: generateEarthquakeStyle
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

    function createMap(earthquakes) {

        // Create the base layers.
        var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      
        var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
      
        // Create a baseMaps object.
        var baseMaps = {
          "Street Map": street,
          "Topographic Map": topo
        };
      
        // Create an overlay object to hold our overlay.
        var overlayMaps = {
          "Earthquakes Marker": earthquakes
        };
      
        // Create map with Hawai'i as the default render.
        var myMap = L.map("map", {
          center: [
            21.29, -157.72
          ],
          zoom: 5,
          layers: [street, earthquakes]
        });
      
        // Create a layer control.
        // Pass it our baseMaps and overlayMaps.
        // Add the layer control to the map.
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);
      
    }








    ///////CODE GRAVEYARD///////////

    // var circles = L.circleMaker([feature.properties.place[1],feature.properties.place[0]],{
    //     radius: feature.properties.radius,
    //     color: "#f00",
    //     fillColor: "#f00"
    // });
