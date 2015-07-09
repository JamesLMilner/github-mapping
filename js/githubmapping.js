var map = L.map('map').setView([ 54.514, -2.122], 6);

L.esri.basemapLayer("Gray").addTo(map);
L.esri.basemapLayer("GrayLabels").addTo(map);

var ukGitHub = "http://services1.arcgis.com/Q6SkXeZHDxVxhXA4/arcgis/rest/services/GitHub_Data/FeatureServer/0";
var gh = L.esri.featureLayer(ukGitHub, {
    pointToLayer: function (geojson, latlng) {
        console.log(geojson)
        var rate = geojson.properties.Rate
        var size

        if (rate >= 0.361 && rate < 1.2 ) {
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
    }
}).addTo(map);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [
            "0.361 - 1.200",
            "0.181 - 0.361",
            "0.095 - 0.181",
            "0.046 - 0.095",
            "0.000 - 0.046"
        ]
        icons = [
            [65, 63],
            [55, 53],
            [45, 43],
            [35, 33],
            [25, 23]
        ]

    iconurl = '"imgs/github4.png"';
    //;oop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        if (i == 0) { div.innerHTML += '<strong class="legendtitle"> % of Pop. with GitHub</strong><br><br>'; }
        div.innerHTML += '<i class="iconstext">'+grades[i]+'</i> <img style="padding-left:'+ i * 5 +'px; padding-right:'+ i * 5 +'px" class="icons" src="imgs/github4.png" width='+icons[i][0]+' height='+icons[i][1]+'><br><br>';
    }

    return div;
};

legend.addTo(map);

var popupTemplate = "<h3>{City}</h3><p><strong>Population</strong>: {City_Population}<br><strong>GH Accounts: </strong>{GH_Total}<br><strong>% with GH Accounts</strong>: {Rate}</p><br>";
gh.bindPopup(function(feature){
    return L.Util.template(popupTemplate, feature.properties)
});
