var myData2 = L.layerGroup();
var attacks2;




function AttackSelect() {
        var choice = document.getElementById("attacktype").value;
            
        //remove all points from map
        myData.clearLayers();
        //Clustering
           
        //go through each layer
        attacks.eachLayer(function(layer) {
            var attack = layer.feature.properties.attacktype;
                      
            //if dropdown is all then add all points to map
            if (attack == 'All') {
                layer.addTo(myData);
                    //if (targ == choice2){
                    //    myData.clearLayers()
                    //    layer.addTo(myData)
                    //}
                // else show appropriate type
             } else if (attack == choice){
                layer.addTo(myData);
                    
                
            } 
            })
        }
            
        function TargSelect() {
        var choice2 = document.getElementById("targtype1_").value;    
        //remove all points from map
        myData2.clearLayers();
        //Clustering
           
        //go through each layer
        attacks2.eachLayer(function(layer) {
            var targ = layer.feature.properties.targtype1_;
           
             
            //if dropdown is all then add all points to map
            if (choice2 == 'All') {
                layer.addTo(myData2);
                   
                // else show appropriate type
             } else if (targ == choice2){
                layer.addTo(myData2);
                    
             }
            })
        }   

//pseudo-global variables and the initial expressed attribute
var attrArray = ["YR2000","YR2001","YR2002","YR2003","YR2004","YR2005","YR2006","YR2007","YR2008","YR2009","YR2010","YR2011","YR2012","YR2013","YR2014","YR2015","YR2016","YR2017"],
    tableArray = ["ByYear_AttackTypeCsv","ByYear_TargetTypeCsv","ByYear_WeaponTypeCsv"],
    expressed = attrArray[17],
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

function createMap2(){
    
    var map2 = L.map('map2', {
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
        }).addTo(map2);

    getData(map2);
   
};
    
    
function getData(map2){
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
    
    
    
 function makePoints(response2) {
            //make data once, giving it the json file
            attacks2 = L.geoJson(response2, {
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
            attacks2.eachLayer(function(layer) {
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
                    theColor = '#FFD700'
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

     
     
     
     
            var markers2 = L.markerClusterGroup();
            markers2.addLayer(attacks2);
            map2.addLayer(markers2);
            myData2.addLayer(markers2);
            myData2.addTo(map2);
        }
    
}

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
    

    
    
    
$(document).ready(createMap2);
