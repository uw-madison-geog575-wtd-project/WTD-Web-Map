var myData = L.layerGroup();
var attacks;


(function(){

//pseudo-global variables and the initial expressed attribute
var attrArray = ["YR2015","YR2016","YR2017"],
    tableArray = [],
    expressed = attrArray[0],
    expressedTable = tableArray[0];

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
        minZoom: 4,
        maxBounds: [[78.25, 70.25],[3.3, -32.8]]
        });


    var tileLayer = L.tileLayer.provider('Jawg.Dark', {
	    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	    accessToken: 'D7aBnz21HjQ71B42SeIuTT0ljcZvX3AiObMGmuIX5KS7HkOlToRbftNkoYK8igVv'
    }).addTo(map);

    getData(map);
   
};
    
    
function getData(map){
    $.ajax("data/Terror.geojson", {
        dataType: "json",
        success: function(response){
            //var geoJsonLayer = L.geoJson(response, {
            //    onEachFeature: onEachFeature
            //});
            //var markers = L.markerClusterGroup();
            //markers.addLayer(geoJsonLayer);
            //map.addLayer(markers);
            makePoints(response);
        }
    });
    
    
    
 function makePoints(response) {
            //make data once, giving it the json file
            attacks = L.geoJson(response, {
                onEachFeature: onEachFeature, 
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        opacity: 1,
                        color: 'white',
                        fillColor: 'green',
                        fillOpacity: 1
                    })
                }
            });
     
            
        
    
//go through each layer and color them appropriately
            attacks.eachLayer(function(layer) {
                var theColor;
                var attacktype = layer.feature.properties.attacktype;
                if (attacktype == 'Bombing/Explosion') {
                    theColor = 'blue'
                } else if (attacktype == 'Assassination') {
                    theColor = 'red'
                } else if (attacktype == 'Armed Assault') {
                    theColor = 'yellow'
                } else if (attacktype == 'Facility/Infrastructure Attack') {
                    theColor = 'white'   
                } else if (attacktype == 'Hijacking') {
                    theColor = '#FFCBA4'
                } else if (attacktype == 'Hostage Taking (Barricade Incident)') {
                    theColor = '#EE82EE'   
                } else if (attacktype == 'Hostage Taking (Kidnapping)') {
                    theColor = '#00FA9A'   
                } else if (attacktype == 'Unarmed Assault') {
                    theColor = '#CEC8EF'    
                } else {
                    theColor = 'green'
                }
                //update color of point
                layer.setStyle({
                    color: 'white',
                    fillColor: theColor
                })
            })

     
     
     
     
            var markers = L.markerClusterGroup();
            markers.addLayer(attacks);
            map.addLayer(markers);
            myData.addLayer(markers);
            myData.addTo(map);
        }
    
    
    

    
    
        
     
    //get the csv data
    d3.queue()
        .defer(d3.csv, "data/ByYear_AttackType.csv")
        .defer(d3.csv, "data/ByYear_TargetType.csv")
        .defer(d3.csv, "data/ByYear_WeaponType.csv")
        .defer(d3.csv, "data/ByYear_Country.csv")
        .await(callback);
    
    function callback(error, ByYear_AttackTypeCsv, ByYear_TargetTypeCsv, ByYear_WeaponTypeCsv, ByYear_CountryCsv){
        //populate the csv table array
        tableArray.push(ByYear_AttackTypeCsv);
        tableArray.push(ByYear_TargetTypeCsv);
        tableArray.push(ByYear_WeaponTypeCsv);
        tableArray.push(ByYear_CountryCsv);
        
        //call the top ten function
        setTopTen(ByYear_CountryCsv);
        
        //call the chart function
        setChart(ByYear_AttackTypeCsv);
        
        //call the year update function
        createYearUpdate();
        
    }
};

function onEachFeature (feature, layer) {
    var popupContent = "";
    if (feature.properties) {
        for (var property in feature.properties) {
            if (feature.properties.crit1 == 1){feature.properties.crit1 = "Yes"};
            if (feature.properties.crit1 == 0){feature.properties.crit1 = "No"};
            if (feature.properties.crit2 == 1){feature.properties.crit2 = "Yes"};
            if (feature.properties.crit2 == 0){feature.properties.crit2 = "No"};
            if (feature.properties.crit3 == 1){feature.properties.crit3 = "Yes"};
            if (feature.properties.crit3 == 0){feature.properties.crit3 = "No"};
            if (feature.properties.doubtterr == 1){feature.properties.doubtterr = "Yes"};
            if (feature.properties.doubtterr == 0){feature.properties.doubtterr = "No"};
            if (feature.properties.success == 1){feature.properties.success = "Yes"};
            if (feature.properties.success == 0){feature.properties.success = "No"};
            if (feature.properties.suicide == 1){feature.properties.suicide = "Yes"};
            if (feature.properties.suicide == 0){feature.properties.suicide = "No"};
            if (feature.properties.nperps == -99){feature.properties.nperps = "Unknown"};
            popupContent = "<p><b>FID: </b>" + feature.properties.FID + "</p>" + "<p><b>ObjectID: </b> " + feature.properties.OBJECTID + "</p>"+ "<p><b>Date: </b> " + feature.properties.imonth + "-" + feature.properties.iday + "-" + feature.properties.iyear + "</p>" + "<p><b>Country: </b> " + feature.properties.country_tx + "</p>" + "<p><b>Region: </b> " + feature.properties.region_txt + "</p>" + "<p><b>City: </b> " + feature.properties.city + "</p>" + "<p><b>Latitude: </b> " + feature.properties.latitude + "</p>" + "<p><b>Longitude: </b> " + feature.properties.longitude + "</p>" + "<p><b>Political, Economic, or Social Goal: </b> " + feature.properties.crit1 + "</p>" + "<p><b>Intention to Coerce, Intimidate, or Publicize to Larger Audience: </b> " + feature.properties.crit2 + "</p>" + "<p><b>Outside International Humanitarian Law: </b> " + feature.properties.crit3 + "</p>" + "<p><b>Possible Doubt That Event Was Terrorism: </b> " + feature.properties.doubtterr + "</p>" + "<p><b>Alternative Motive Besides Terrorism: </b> " + feature.properties.alternativ + "</p>" + "<p><b>Was Attack Successful: </b> " + feature.properties.success + "</p>" + "<p><b>Was Attack a Suicide Attack: </b> " + feature.properties.suicide + "</p>" + "<p><b>Attack Type: </b> " + feature.properties.attacktype + "</p>" + "<p><b>Target Type: </b> " + feature.properties.targtype1_ + "</p>" + "<p><b>Target SubType: </b> " + feature.properties.targsubtyp + "</p>" + "<p><b>Nationality of Attackted Target: </b> " + feature.properties.natlty1_tx + "</p>" + "<p><b>Attacking Group's Name: </b> " + feature.properties.gname + "</p>" + "<p><b>Number of Perpetrators: </b> " + feature.properties.nperps + "</p> " + "<p><b>Weapon Type: </b> " + feature.properties.weaptype1_ + "</p>" + "<p><b>Weapon SubType: </b> " + feature.properties.weapsubtyp + "</p>" + "<p><b>Number of People Killed: </b> " + feature.properties.nkill + "</p>" + "<p><b>Number of People Wounded: </b> " + feature.properties.nwound + "</p>";
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
        .text('Top 10 Most Terrorized Countries in:');
    
    var topTenSubtitle = topTenDiv.append("div")
        .attr("class","topTenSubtitle")
        .append("h2")
        .attr("class","topTenSubtitleText")
        .text(expressed.slice(2));
    
    var topTenList = topTenDiv.append("ol")
        .attr("class","topTenList");
    
    updateTopTen(ByYear_CountryCsv, expressed);
}
    
function updateTopTen(csvData, attribute){
    //update the title
    var topTenTitle = d3.select(".topTenTitle")
        .text('Top 10 Most Terrorized Countries in:');
    
    var topTenSubtitle = d3.select(".topTenSubtitleText")
        .text(attribute.slice(2));
    
    //create an array of terror attacks by country
    var topTenArray = [];
    for (var i=0; i < csvData.length; i++){
        var inputData = csvData[i][attribute];
        topTenArray.push(parseInt(inputData));
    };
    
    //sort the array
    topTenArray.sort(function(a,b){return b-a});
    
    var topTenCountries = [],
        duplicateCheck = [];
    
    for (var i=0; i < 10; i++){
        var findMatch = topTenArray[i];
        for (var a=0; a<csvData.length; a++){
            if (csvData[a][attribute]==findMatch && !duplicateCheck.includes(csvData[a].COUNTRY)){
                topTenCountries.push([csvData[a].COUNTRY,findMatch]);
                duplicateCheck.push(csvData[a].COUNTRY);
            }
        }
    }
    while (topTenCountries.length != 10){
        topTenCountries.pop();
    }
    
    d3.select(".topTenList").text('');
    
    for (var i=0; i<topTenCountries.length; i++){
        var topTenList = d3.select(".topTenList")
            .append("li")
            .attr("class","topTenListItem "+ i.toString())
            .text(topTenCountries[i][0] + ' - ' + topTenCountries[i][1] + ' acts of terrorism');
    }
        
};  
    
function createYearUpdate(){
    //create year update elements
    $('.topTenSubtitle').append('<input class="range-slider" type="range" value="0">');
    $('.topTenSubtitle').append('<button class="skip" id="reverse"></button>');
    $('.topTenSubtitle').append('<button class="skip" id="forward"></button>');
    $('#reverse').html('<i class="fa fa-arrow-circle-left" aria-hidden="true"></i>');
    $('#forward').html('<i class="fa fa-arrow-circle-right" aria-hidden="true"></i>');
    //$('.topTenTitle').append('<h1 class="expressedYear">' + expressed.slice(2) + '</h1>');
    
    $('.skip').click(function(){
        var index = $('.range-slider').val();
        
        if ($(this).attr('id') == 'forward'){
            index++;
            index = index > 2 ? 0: index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            index = index < 0 ? 2: index;
        };
        $('.range-slider').val(index);
        
        //$('.expressedYear').text(attrArray[index].slice(2));
        var expressed = attrArray[index];
        updateTopTen(tableArray[3], attrArray[index]);
    });        
}  
    
function setChart(csvData){
    var chartTitle = d3.select(".chartContainer")
        .append("h2")
        .attr("class","chartTitle")
        .text("Attack Type By Category");
    
    var minMaxArray = [];
    for (i=0; i < csvData.length; i++){
        var inputData = csvData[i][expressed];
        minMaxArray.push(parseInt(inputData));
    }
    minMaxArray.sort(function(a,b){return b-a});
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
        })
        .attr("fill","white");
    
    updateChart(csvData);
};
    
function updateChart(csvData){}
    
    
    
    
$(document).ready(createMap);
})();







