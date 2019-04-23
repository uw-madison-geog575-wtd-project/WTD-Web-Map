var L;
var $;

//initialize map
var map = L.map('map', {
    center: [0, 0],
    zoom: 3,
    minZoom: 1,
    maxZoom: 18
});


//add leaflet tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.dark',
    accessToken: 'pk.eyJ1Ijoiam15YXR0IiwiYSI6ImNqbG9vMnc4MjA5ZTczcHBiYmlzYTNhcDAifQ.BaYtqvvn4Lzsl6mdotKeLQ'
}).addTo(map);



// for the getData function
getData(map);


$(document).ready(Map);
