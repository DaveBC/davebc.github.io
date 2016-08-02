//
//  houseKeeping.js
//  Power Of 10 Progression Chart Generator
//
//  Created by David Banwell-Clode on 31/05/2016.
//  Copyright (c) 2016 David Banwell-Clode. All rights reserved.
//

window.onresize = function() { 
    resize(); 
};

window.onload = function() {
    initialSize();
};

function resize() {
    'use strict';
    initialSize();
    console.log("Resize");
}

function initialSize() {
    'use strict';
    var headContainer = document.getElementById("masterHead");
    var visualizeContainer = document.getElementById("visualization");
    var bodyContainer = document.body;
    
    var height = bodyContainer.clientHeight - 80 - headContainer.clientHeight;
    visualizeContainer.style.height = height + 'px';
    console.log(height);
}