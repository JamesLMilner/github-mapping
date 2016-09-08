var map = L.map('map').setView([ 54.514, -2.122], 6);
// var legend = document.getElementsByClassName("legend")[0];
// var switch = document.getElementById("switch");

L.esri.basemapLayer("Gray").addTo(map);
L.esri.basemapLayer("GrayLabels").addTo(map);



var ghGeojsonUrl = "data/github-cities.geojson";
var popupTemplate = "<h3>{City}</h3><p><strong>Population</strong>: {Population}<br><strong>GitHub accounts: </strong>{Total}<br><strong>% with account \n</strong>: {Rate}</p><br>";
var heatmapPoints = [];

var ghLayer;
var maxRate = 0;

L.Util.ajax(ghGeojsonUrl).then(function(data){

  ghLayer = new L.geoJson(data, {
      pointToLayer: function (geojson, latlng) {

          var rate = geojson.properties.Rate;
          var size;
          if (rate > maxRate) maxRate = rate;

          if (rate > 1.2 ) {
              size = [65, 63];
          }
          else if (rate >= 0.361 && rate < 1.2 ) {
              size = [65, 63];
          }
          else if (rate >= 0.181 && rate < 0.361 ) {
              size = [55, 53];
          }
          else if  (rate >= 0.095 && rate < 0.181 ) {
              size = [45, 43];
          }
          else if  (rate >= 0.046 && rate < 0.095 ) {
              size = [35, 33];
          }
          else if  (rate >= 0 && rate < 0.046 )  {
              size = [25, 23];
          }

          return L.marker(latlng, {
              icon: L.icon({
                  iconUrl: 'imgs/github4.png',
                  iconSize: size,
                  iconAnchor: [size[0] / 2, size[1] / 2],
                  popupAnchor: [0, -11]
              })
          });
      },
      onEachFeature : function(feature, layer) {
        var point = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        point.push(feature.properties.Rate);
        heatmapPoints.push(point);

        feature.properties.Rate = parseFloat(feature.properties.Rate).toFixed(3);
        layer.bindPopup(L.Util.template(popupTemplate, feature.properties));
      }
  }).addTo(map);

});

function toggleMarkers(opacity) {
  var markers = document.getElementsByClassName("leaflet-marker-icon");
  for(var i = 0; i < markers.length; i++){
    markers.item(i).style.opacity = opacity;
  }
}

viewMode = "markers";
var heat = L.heatLayer(heatmapPoints, {
    minOpacity : 0.9,
    max : 1.0,
    radius : 15,
    blur : 35,
    gradient :{0.2: 'blue', 0.80: 'salmon', 1: 'dimgray'}
});

function toggleRenderer(event) {

  event.stopPropagation();

  if (viewMode === "markers") {
    toggleMarkers(0);
    heat.addTo(map);
    document.getElementsByClassName("legend")[0].style.opacity = 0;
    document.getElementById("switch").innerHTML = "Markers";
    viewMode = "heatmap";
  } else {
    toggleMarkers(1);
    map.removeLayer(heat);
    viewMode = "markers";
    setMarkerOpacity();
    document.getElementsByClassName("legend")[0].style.opacity = 1;
    document.getElementById("switch").innerHTML = "Heatmap";
  }
}

function setMarkerOpacity() {
  if (viewMode === "heatmap") return;

  for (var id in ghLayer._layers) {
    var marker = ghLayer._layers[id];
    var rate = parseFloat(marker.feature.properties.Rate) + 0.05; // Let's give every place some opacity at least
    var scaler = 2.5;
    var opacity = map.getZoom() < 6 ? (rate / maxRate) * scaler : 1;
    marker._icon.style.opacity = opacity;
  }
}

map.on('zoomend', setMarkerOpacity);
document.getElementById("switch").addEventListener("click", toggleRenderer);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [
            "0.361 - 1.200",
            "0.181 - 0.361",
            "0.095 - 0.181",
            "0.046 - 0.095",
            "0.000 - 0.046"
        ];
        icons = [
            [65, 63],
            [55, 53],
            [45, 43],
            [35, 33],
            [25, 23]
        ];

    iconurl = '"imgs/github4.png"';
    //;oop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        if (i === 0) {
          div.innerHTML += '<strong class="legendtitle"> % of Pop. with GitHub</strong><br><br>';
         }
        div.innerHTML += '<i class="iconstext">'+grades[i]+'</i> <img style="padding-left:'+ i * 5 +'px; padding-right:'+ i * 5 +'px" class="icons" src="imgs/github4.png" width='+icons[i][0]+' height='+icons[i][1]+'><br><br>';
    }

    return div;
};

legend.addTo(map);
