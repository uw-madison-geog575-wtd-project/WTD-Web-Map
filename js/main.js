(function(){

//pseudo-global variables and the initial expressed attribute
var attrArray = ["YR2000","YR2001","YR2002","YR2003","YR2004","YR2005","YR2006","YR2007","YR2008","YR2009","YR2010","YR2011","YR2012","YR2013","YR2014","YR2015","YR2016","YR2017"],
    tableArray = ["ByYear_AttackTypeCsv","ByYear_TargetTypeCsv","ByYear_WeaponTypeCsv"],
    expressed = attrArray[17],
    expressedTable = tableArray[0];
    console.log(expressed);
  
//chart frame dimensions
    var margin = {
        top: 15,
        right: 25,
        bottom: 15,
        left: 10
    };
    
    var width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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
        setTopTen(ByYear_CountryCsv);
        
        //call the chart function
        setChart(ByYear_WeaponTypeCsv);
        
        //test
        updateChart(ByYear_AttackTypeCsv);
        
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
function setTopTen(ByYear_CountryCsv){
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
    //update the title
    var topTenTitle = d3.select(".topTenTitle")
        .text('Top 10 Most Terrorized Countries in ' + expressed.slice(2));
    
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
    var chartTitle = d3.select(".chartContainer")
        .append("h2")
        .attr("class","chartTitle")
        .text("Attack Type By Category - " + expressed.slice(2));
    
    var minMaxArray = [];
    for (i=0; i < csvData.length; i++){
        var inputData = csvData[i][expressed];
        minMaxArray.push(parseInt(inputData));
    }
    minMaxArray.sort(function(a,b){return b-a});
    console.log(minMaxArray[0]);
    var max = minMaxArray[0];
    
    //sort bars based on value
    csvData.sort(function(a,b){return a[expressed]-b[expressed]});
    
    var svg = d3.select(".chartContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class","chartInnerRect")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, max]);
    
    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], 0.1)
        .domain(csvData.map(function (d) {
            return d.TYPE;
        }));
    
    //make y axis to show bar names
    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .orient("left");
    
    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    
    var bars = svg.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("g")
    
    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.TYPE);
        })
        .attr("height", y.rangeBand())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d[expressed]);
        })
        .attr("fill","#de2d26");
    
    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.TYPE) + y.rangeBand() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return 10;
        })
        .text(function (d) {
            return d.TYPE + ' (' +d[expressed] + ')';
        });
    
    updateChart(csvData);
};
    
function updateChart(csvData){}
    
    
    
    
$(document).ready(createMap);
})();