var colorList = {Bombing: 'blue', Assassination: 'red', "Armed Assault": 'yellow', "Facility/Infrastructure Attack": 'white', Hijacking: '#FFCBA4', "Hostage Taking (Barricade Incident)": '#EE82EE',"Hostage Taking (Kidnapping)": '#00FA9A', "Unarmed Assault": '#CEC8EF', Unknown: 'green'};

colorize = function(colorList) {
    var container = document.getElementById('container');
  
    for (var key in colorList) {
        var boxContainer = document.createElement("DIV");
        var box = document.createElement("DIV");
        var lab = document.createElement("SPAN");

        lab.innerHTML = key;
        box.className = "box";
        box.style.backgroundColor = colorList[key];

        boxContainer.appendChild(box);
        boxContainer.appendChild(lab);

        container.appendChild(boxContainer);

   }
}

colorize(colorList);  