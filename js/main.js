(function(){

//pseudo-global variables and the initial expressed attribute
var attrArray = ["YR2000","YR2001","YR2002","YR2003","YR2004","YR2005","YR2006","YR2007","YR2008","YR2009","YR2010","YR2011","YR2012","YR2013","YR2014","YR2015","YR2016","YR2017"],
    expressed = attrArray[0];
  
function createMap(){
    
    var map = L.map('map', {
        center: [0, 0],
        zoom: 3,
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
            var geoJsonLayer = L.geoJson(response);
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
    }
};

$(document).ready(createMap);
})();