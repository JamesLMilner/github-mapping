# GitHub Mapping
A map showing the estimated percentage of people in each city with a GitHub account.

# Cities and Population Data
The populations were taken from the 2015 estimates of this data set:

http://data.london.gov.uk/dataset/global-city-population-estimates
https://files.datapress.com/london/dataset/global-city-population-estimates/global-city-population-estimates.xls

The results were massaged into a format for use with the Python GitHub scraper (github-api.py).


# Tech
The application uses:
  * [Leaflet](http://leafletjs.com/)
  * [Esri Leaflet](https://esri.github.io/esri-leaflet/)
  * [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)
  * [Leaflet.ajax](https://github.com/calvinmetcalf/leaflet-ajax)

# Contribution
Please feel free to contribute your city! Just it to the github-cities.geojson file, with a sourced city population and the total number of GitHub users (it's probably easiest to check this manually for one off cities).


# Acknowledgements
Thanks to [Esri](http://developers.arcgis.com) for the basemaps!
