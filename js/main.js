(function(){

//pseudo-global variables and the initial expressed attribute
var attrArray = ["YR2000","YR2001","YR2002","YR2003","YR2004","YR2005","YR2006","YR2007","YR2008","YR2009","YR2010","YR2011","YR2012","YR2013","YR2014","YR2015","YR2016","YR2017"],
    expressed = attrArray[0];
    console.log(expressed);
  
//chart frame dimensions
var chartWidth = (d3.select(".chartContainer").node().getBoundingClientRect().width)*.5,
    chartHeight = 500,
    leftPadding = 50,
    rightPadding = 2,
    topBottomPadding = 6,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

function createMap(){
    
    var map = L.map('map', {
        center: [52,12],
        zoom: 4,
        minZoom: 1,
        maxZoom: 18
        });


    var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1Ijoiam15YXR0IiwiYSI6ImNqbG9vMnc4MjA5ZTczcHBiYmlzYTNhcDAifQ.BaYtqvvn4Lzsl6mdotKeLQ'
        }).addTo(map);

    getData(map);
};

function getData(map){
    $.ajax("data/EuropeTerrorSince2015.geojson", {
        dataType: "json",
        success: function(response){
            var geoJsonLayer = L.geoJson(response, {
                onEachFeature: onEachFeature
            });
            var markers = L.markerClusterGroup();
            markers.addLayer(geoJsonLayer);
            map.addLayer(markers);
        }
    });
    
    //get the csv data
    d3.queue()
        .defer(d3.csv, "data/ByYear_AttackType.csv")
        .defer(d3.csv, "data/ByYear_TargetType.csv")
        .defer(d3.csv, "data/ByYear_WeaponType.csv")
        .defer(d3.csv, "data/ByYear_Country.csv")
        .await(callback);
    
    function callback(error, ByYear_AttackTypeCsv, ByYear_TargetTypeCsv, ByYear_WeaponTypeCsv, ByYear_CountryCsv){
        console.log(ByYear_AttackTypeCsv);
        console.log(ByYear_TargetTypeCsv);
        console.log(ByYear_WeaponTypeCsv);
        console.log(ByYear_CountryCsv);
        
        //call the top ten function
        createTopTen(ByYear_CountryCsv);
        
        //call the chart function
        setChart(ByYear_WeaponTypeCsv);
    }
};

function onEachFeature (feature, layer) {
    var popupContent = "";
    if (feature.properties) {
        for (var property in feature.properties) {
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
    }
   layer.bindPopup(popupContent);
    }
}    
    
//function to create the top 10 countries div
function createTopTen(ByYear_CountryCsv){
    //add the div
    var topTenDiv = d3.select(".topTenContainer")
        .append("div")
        .attr("class","topTenDiv");
    
    var topTenTitle = topTenDiv.append("h1")
        .attr("class","topTenTitle")
        .text('Top 10 Most Terrorized Countries in ' + expressed.slice(2));
    
    var topTenList = topTenDiv.append("ol")
        .attr("class","topTenList");
    
    updateTopTen(ByYear_CountryCsv);
}
    
function updateTopTen(ByYear_CountryCsv){
    //create an array of terror attacks by country
    var topTenArray = [];
    for (var i=0; i < ByYear_CountryCsv.length; i++){
        var inputData = ByYear_CountryCsv[i][expressed];
        topTenArray.push(parseInt(inputData));
    };
    
    console.log(topTenArray);
    
    //sort the array
    topTenArray.sort(function(a,b){return b-a});
    
    console.log(topTenArray[5]);
    
    var topTenCountries = [],
        duplicateCheck = [];
    
    for (var i=0; i < 10; i++){
        var findMatch = topTenArray[i];
        for (var a=0; a<ByYear_CountryCsv.length; a++){
            if (ByYear_CountryCsv[a][expressed]==findMatch && !duplicateCheck.includes(ByYear_CountryCsv[a].COUNTRY)){
                //console.log(ByYear_CountryCsv[a].COUNTRY);
                topTenCountries.push([ByYear_CountryCsv[a].COUNTRY,findMatch]);
                duplicateCheck.push(ByYear_CountryCsv[a].COUNTRY);
            }
        }
    }
    while (topTenCountries.length != 10){
        topTenCountries.pop();
    }
        
    console.log(topTenCountries);
    
    for (var i=0; i<topTenCountries.length; i++){
        var topTenList = d3.select(".topTenList")
            .append("li")
            .attr("class","topTenListItem "+ i.toString())
            .text(topTenCountries[i][0] + ' - ' + topTenCountries[i][1] + ' acts of terrorism');
    }
        
};
 
function setChart(csvData){
    //initial y scale for the chart
    var yScale = d3.scale.linear()
        .range([500,0])
        .domain([0,Math.ceil(csvData/100)*100]);
    
    //create a svg element to hold the bar chart
    var chart = d3.select(".chartContainer")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart");
    
    //create a rectangle for chart background fill
    var chartBackground = chart.append("rect")
        .attr("class","chartBackground")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);
    
    //set bars for each country
    var bars = chart.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        .sort(function(a,b){
            return b[expressed] - a[expressed]
        })
        .attr("class", function(d){
            return "bar "+d.TYPE;
        })
        .attr("width", chartInnerWidth / csvData.length - 1);
    
    //add style description to each rect
    var desc = bars.append("desc")
        .text('{"stroke": "none", "stroke-width":"0px"}');
    
    //create vertical axis generator
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    
    //place axis
    var axis = chart.append("g")
        .attr("class","axis")
        .attr("transform", translate)
        .call(yAxis);
    
    //create frame for chart border
    var chartFrame = chart.append("rect")
        .attr("class", "chartFrame")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);
    
    //set bar positions, heights and colors
    updateChart(bars, csvData.length, csvData);
};
  
function updateChart(bars, n, csvData){
    //find the max of the individual data ranges
    var minMaxArray = [];
    for (var i=0; i<n; i++){
        var inputData = csvData[i][expressed];
        minMaxArray.push(parseInt(inputData));
    };
    
    //set min and max for y scale
    var min = 0,
        max = Math.ceil(Math.max.apply(null, minMaxArray)/100)*100;
    
    var yScale = d3.scale.linear()
        .range([463,0])
        .domain([min,max]);
    
    //create vertical axis generator
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    
    //place axis
    var axis = d3.select(".axis")
        .call(yAxis);
    
    //position bars
    bars.attr("x",function(d,i){
        return i * (chartInnerWidth / n) + leftPadding;
    })
    .attr("height", function(d,i){
        return 463 - yScale(parseInt(d[expressed]));
    })
    .attr("y",function(d,i){
        return yScale(parseInt(d[expressed])) + topBottomPadding;
    })
    .style("fill","#de2d26");
};
        
    
$(document).ready(createMap);
})();