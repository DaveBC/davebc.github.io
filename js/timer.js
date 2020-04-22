var menu = document.querySelector('.menu');
var share = document.getElementById('sharePopup')
var exerciseArray;
var exercises = document.getElementById('exercises');
var exerciseName = document.getElementById('exerciseName');
var nextExerciseName = document.getElementById('nextExerciseName');
var duration = document.getElementById('duration');
var recovery = document.getElementById('recovery');
var clock = document.getElementById('clock');
var form = document.getElementById('settingsForm');
var settingsButton = document.getElementById('settingsButton');
var shareURL = document.getElementById('shareURL');
var shareToolTip = document.getElementById("shareToolTip");

var countdown;
var countdownCounter;
var lowChime = new Audio("sounds/chime_low.mp3");
var highChime = new Audio("sounds/chime_high.mp3");
var exerciseNumber;
var flipFlop = true; //true = exercise, false = recovery.
var state = 0; //0 = countdown, 1 = exercise, 2 = recovery, 3 = circuitLoop.

var startTimerButton = document.querySelector('.startTimer');
var pauseTimerButton = document.querySelector('.pauseTimer');
var stopTimerButton = document.querySelector('.stopTimer');

window.addEventListener('load', function() {
    let exerciseQuery = getQueryVariable("exercises");
    if (exerciseQuery) {
        exercises.value = decodeURIComponent(getQueryVariable("exercises"));
    }
    
    duration.value = getQueryVariable("duration");
    recovery.value = getQueryVariable("recovery");
})


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function generateShareURL() {
    let exercisesURI = encodeURIComponent(document.getElementById('exercises').value);
    
    shareURL.value = "https://davebc.github.io/?" + "duration=" + duration.value + "&" + "recovery=" + recovery.value + "&" + "exercises=" + exercisesURI;
//    console.log(shareURL);
}

function hideMenu() {
    menu.style.display = "none";
}

function showMenu() {
    menu.style.display = "";
}

function showShareBox() {
    share.style.display = "flex";
}

function hideShareBox() {
    share.style.display = "none";
}

function outFunc() {
  shareToolTip.innerHTML = "Copy to clipboard";
}

function copyToClipboard() {
  shareURL.select();
  shareURL.setSelectionRange(0, 99999);
  document.execCommand("copy");
  shareToolTip.innerHTML = "Copied!";
}

function saveSettings() {
    if (settingsForm[0].checkValidity()) {
        if (duration.value != "" && exercises.value != "" && recovery.value != "") {
            exerciseArray = document.getElementById('exercises').value.split('\n');

            if (exerciseArray.length > 0) {
                exerciseName.innerHTML = exerciseArray[0];
            }
            if (exerciseArray.length > 1) {
                nextExerciseName.innerHTML = "Next: " + exerciseArray[1];
            } else {
                nextExerciseName.innerHTML = "Next: Last one!";
            }
            startTimerButton.firstElementChild.classList.remove("disabled");
            hideMenu();
            generateShareURL();
        }
    }
}

function circuitLoop() {
    if (flipFlop) {
        clock.style.color = "#D91E36"
        if (exerciseNumber < exerciseArray.length) {
            exerciseName.innerHTML = exerciseArray[exerciseNumber];
            if (exerciseNumber + 1 < exerciseArray.length) {
                nextExerciseName.innerHTML = "Next: " + exerciseArray[exerciseNumber + 1];
            } else {
                nextExerciseName.innerHTML = "Next: Last one!";
            }
            highChime.play();
            countdownCounter = duration.value - 1;
            clock.innerHTML = countdownCounter + 1;
            countdown = setInterval(exerciseCountdown, 1000);
        } else {
            return;
        }
    } else {
        clock.style.color = "#92DCE5"
        highChime.play();
        countdownCounter = recovery.value - 1;
        clock.innerHTML = countdownCounter + 1;
        countdown = setInterval(recoveryCountdown, 1000);
    }
}

function recoveryCountdown() {
    if (countdownCounter == 0) {
        exerciseNumber = exerciseNumber + 1;
        clearInterval(countdown);
        flipFlop = true;
        state = 1;
        circuitLoop();
    } else {
        clock.innerHTML = countdownCounter;

        if (countdownCounter == 1 || countdownCounter == 2 || countdownCounter == 3) {
            lowChime.play();
        }

        countdownCounter = countdownCounter - 1;
    }
}

function exerciseCountdown() {
    if (countdownCounter == 0) {
        if (exerciseNumber == exerciseArray.length - 1) {
            highChime.play();
            clearInterval(countdown);
            clock.innerHTML = "DONE!";
            startTimerButton.firstElementChild.classList.remove("disabled");
            startTimerButton.onclick = function () {
                startCircuit();
            };
            pauseTimerButton.firstElementChild.classList.add("disabled");
            pauseTimerButton.onclick = "";
            stopTimerButton.firstElementChild.classList.add("disabled");
            stopTimerButton.onclick = "";
            settingsButton.firstElementChild.classList.remove("disabled");
            settingsButton.onclick = function () {
                showMenu();
            };
            state = 0;
            return;
        }
        countdownCounter = recovery.value;
        clearInterval(countdown);
        flipFlop = false;
        state = 2;
        circuitLoop();
    } else {
        clock.innerHTML = countdownCounter;

        if (countdownCounter == 1 || countdownCounter == 2 || countdownCounter == 3) {
            lowChime.play();
        }

        countdownCounter = countdownCounter - 1;
    }
}

function countDown() {
    if (countdownCounter == 0) {
        clearInterval(countdown);
        //        var tLoop = setTimeout(circuitLoop(), 1000);
        clock.classList.remove("getReady");
        state = 1;
        circuitLoop();
    } else {
        clock.classList.add("getReady");
        clock.innerHTML = "Get ready.." + countdownCounter;

        if (countdownCounter == 1 || countdownCounter == 2 || countdownCounter == 3) {
            lowChime.play();
        }

        countdownCounter = countdownCounter - 1;
    }
}

function startCircuit() {
    startTimerButton.firstElementChild.classList.add("disabled");
    startTimerButton.onclick = "";
    pauseTimerButton.firstElementChild.classList.remove("disabled");
    pauseTimerButton.onclick = function () {
        pauseCircuit();
    };
    stopTimerButton.firstElementChild.classList.remove("disabled");
    stopTimerButton.onclick = function () {
        stopCircuit();
    };
    settingsButton.firstElementChild.classList.add("disabled");
    settingsButton.onclick = "";

    exerciseName.innerHTML = exerciseArray[0];
    if (exerciseArray.length > 1) {
        nextExerciseName.innerHTML = "Next: " + exerciseArray[1];
    } else {
        nextExerciseName.innerHTML = "Next: Last one!";
    }

    countdownCounter = 3;
    lowChime.play();
    clock.classList.add("getReady");
    clock.innerHTML = "Get ready.." + countdownCounter;
    countdownCounter = 2
    exerciseNumber = 0;
    flipFlop = true;
    countdown = setInterval(countDown, 1000);
}

function resumeCircuit() {
    if (state == 1) {
        countdown = setInterval(exerciseCountdown, 1000);
    }
    if (state == 2) {
        countdown = setInterval(recoveryCountdown, 1000);
    }
    if (state == 0) {
        countdown = setInterval(countDown, 1000);
    }

    startTimerButton.firstElementChild.classList.add("disabled");
    startTimerButton.onclick = "";
    pauseTimerButton.firstElementChild.classList.remove("disabled");
    pauseTimerButton.onclick = function () {
        pauseCircuit();
    };
    stopTimerButton.firstElementChild.classList.remove("disabled");
    stopTimerButton.onclick = function () {
        stopCircuit();
    };
}

function pauseCircuit() {
    clearInterval(countdown);
    startTimerButton.firstElementChild.classList.remove("disabled");
    startTimerButton.onclick = function () {
        resumeCircuit();
    };
    pauseTimerButton.firstElementChild.classList.add("disabled");
    pauseTimerButton.onclick = "";
}

function stopCircuit() {
    clearInterval(countdown);
    startTimerButton.firstElementChild.classList.remove("disabled");
    startTimerButton.onclick = function () {
        startCircuit();
    };
    pauseTimerButton.firstElementChild.classList.add("disabled");
    pauseTimerButton.onclick = "";
    stopTimerButton.firstElementChild.classList.add("disabled");
    stopTimerButton.onclick = "";
    settingsButton.firstElementChild.classList.remove("disabled");
    settingsButton.onclick = function () {
        showMenu();
    };
    clock.classList.remove("getReady");
    clock.innerHTML = "Stopped";
}
