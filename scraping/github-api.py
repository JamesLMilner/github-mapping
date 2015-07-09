__author__ = 'James'

import json
import urllib2
import csv
import base64
import time
import StringIO
from urllib2 import urlopen, Request

citiesDict = {
        "England" : {
                          "London" : 9787426,
                          "Manchester": 2553379,
                          "Liverpool" : 466415,
                          "Nottingham": 729977,
                          "Sheffield": 640720,
                          "Birmingham": 2440986,
                          "Leeds": 1777934,
                          "Leicester": 509000,
                          "Bristol": 617000,
                          "Bath": 88859,
                          "Brighton": 163000,
                          "Newcastle": 879996,
                          "Cambridge": 128515,
                          "Oxford": 171380,
                          "Bournemouth": 183491,
                          "Southampton" : 855569,
                          "Durham" : 48069,
                          "York" : 204439,
                          "Aylesbury" : 184560,
                          "Reading" : 160825,
                          "Warwick" : 139396,
                          "Gloucester" : 125649,
                          "Exeter" : 121800,
                          "Plymouth" : 256600,
                          "Norwich" : 140452
                        },

        "Wales" : {
                        "Bangor" : 16358,
                        "Cardiff" : 447287,
                        "Newport" : 145700,
                        "Swansea" : 239023
                      },

        "Scotland" : {
                        "Aberdeen" : 189120,
                        "Dundee" : 153990,
                        "Glasgow" : 589900,
                        "Inverness" : 57960,
                        "Edinburgh" : 782000
                        },
        "Northern-Ireland" : {
                        "Belfast" : 276705,
                        "Derry" : 83652,
                        "Lisburn" : 71403
        }
}

parent = "United Kingdom"
suffixes = ["Placeholder", "UK", "GB", "United-Kingdom", "Great-Britain"]
#https://github.com/settings/tokens
token =  ""
github_url = "https://api.github.com/search/users?q=+location:"
fields = ["City", "Country", "UK", "GB", "United Kingdom", "Great Britain", "GH Total", "City Population", "Rate"]


with open('github.csv', 'wb') as file:
    ghCsv = csv.writer(file, delimiter=',')
    ghCsv.writerow(fields)

    for country, cities in citiesDict.iteritems():

        suffixes[0] = country

        for city, population in cities.iteritems():
            cleanCity = city.replace("-", " ")
            cityAddress = cleanCity + ", " + country
            rowData = [cityAddress, "Country", "UK", "GB", "United Kingdom", "Great Britain", "GH Total", population, ""]
            c = 1
            total = 0
            for suffix in suffixes:
                url = github_url + city + "," + suffix
                print "GETting: " + url

                request = Request(url)
                request.add_header('Authorization', 'token %s' % token)
                response = urlopen(request)
                data = json.load(response)
                rowData[c] = data["total_count"]
                total += data["total_count"]
                c += 1
                time.sleep(3)
            rowData[6] = total
            rowData[7] = population
            rowData[8] = total / population * 100
            ghCsv.writerow(rowData)

