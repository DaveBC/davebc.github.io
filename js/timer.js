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
var countupCounter;
var lowChime = new Audio("sounds/chime_low.mp3");
var highChime = new Audio("sounds/chime_high.mp3");
var exerciseNumber;
var flipFlop = true; //true = exercise, false = recovery.
var state = 0; //0 = countdown, 1 = circuitLoop.
var interval = 100; //ms
var expected;
var running = true;

var startTimerButton = document.querySelector('.startTimer');
var pauseTimerButton = document.querySelector('.pauseTimer');
var stopTimerButton = document.querySelector('.stopTimer');

var youtubeLink = document.getElementById('youtubeLink');

var debugStartTime;
var debugFinishTime;
var debugExpectedFinishTime;

window.addEventListener('load', function () {
    let exerciseQuery = getQueryVariable("exercises");
    if (exerciseQuery) {
        exercises.value = decodeURIComponent(getQueryVariable("exercises")).replace(/,/g, "\n");
    }

    duration.value = getQueryVariable("duration");
    recovery.value = getQueryVariable("recovery");
    latestYoutubeVideo();
})


function getQueryVariable(variable) {
    var query = decodeURIComponent(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function generateShareURL() {
    var exercisesURI = encodeURIComponent(document.getElementById('exercises').value);
    exercisesURI = exercisesURI.replace(/%0A/g, "%2C");
    let encodedAmpersand = encodeURIComponent("&");
    shareURL.value = "https://davebc.github.io/?" + "duration=" + duration.value + encodedAmpersand + "recovery=" + recovery.value + encodedAmpersand + "exercises=" + exercisesURI;
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
    if (running) {
        var dt = Date.now() - expected;
        
        var second = Math.ceil(countdownCounter/10);
        clock.innerHTML = second;
        if (countdownCounter == 10 || countdownCounter == 20 || countdownCounter == 30) {
            lowChime.play();
        }

        if (flipFlop) { // exercise  
            if (countdownCounter == duration.value*10) {
                highChime.play();
                clock.style.color = "#D91E36";

                //update exercise title
                if (exerciseNumber < exerciseArray.length) {
                    exerciseName.innerHTML = exerciseArray[exerciseNumber];
                    if (exerciseNumber + 1 < exerciseArray.length) {
                        nextExerciseName.innerHTML = "Next: " + exerciseArray[exerciseNumber + 1];
                    } else {
                        nextExerciseName.innerHTML = "Next: Last one!";
                    }
                    exerciseNumber += 1;
                }
            }
        } else { // recovery
            if (countdownCounter == recovery.value*10) {
                clock.style.color = "#92DCE5"
                highChime.play();
            }
        }


        if (countdownCounter == 1) {
            countdownCounter = flipFlop ? recovery.value*10 : duration.value*10;
            flipFlop = !flipFlop;
            if (!flipFlop && exerciseNumber >= exerciseArray.length) {
                return setTimeout(finishCircuit, Math.max(0, interval - dt));
            }
        }
        else {
            countdownCounter -= 1;
        }

        // Compensate for time drift.
//        console.log("Drifted:" + dt);
        expected += interval;
        setTimeout(circuitLoop, Math.max(0, interval - dt));
    }
}

function countDown() {
    if(running) {
        clock.innerHTML = "Get ready.." + countdownCounter;
        lowChime.play();

        if (countdownCounter == 1) {
            state = 1;
            expected = Date.now() + 1000;
            countdownCounter = duration.value*10;
            setTimeout( function() { circuitLoop(); clock.classList.remove("getReady"); debugStartTime = Date.now();}, 1000);
        } else {
            countdownCounter = countdownCounter - 1;
            setTimeout(countDown, 1000);
        }
    }
}

function startCircuit() {
    console.log("start");
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
    state = 0;
    running = true;
    setTimeout(countDown, 1000);
}

function finishCircuit() {
    highChime.play();
    clock.innerHTML = "DONE!"
    running = false;
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
    clock.style.color = "#D91E36";
    
//    debugFinishTime = Date.now();
//    debugExpectedFinishTime = debugStartTime + (((exerciseArray.length * duration.value) + ((exerciseArray.length - 1) * recovery.value)) * 1000);
//    var timeLapsed = debugFinishTime - debugStartTime;
//    console.log("ms elapsed: " + timeLapsed);
//    console.log("error: " + (debugFinishTime - debugExpectedFinishTime);
    
    return;
}

function resumeCircuit() {
    running = true;
    if (state == 1) {
        expected = Date.now() + interval/2;
        setTimeout(circuitLoop, interval/2);
    }
    if (state == 0) {
        countDown();
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
    startTimerButton.firstElementChild.classList.remove("disabled");
    startTimerButton.onclick = function () {
        resumeCircuit();
    };
    pauseTimerButton.firstElementChild.classList.add("disabled");
    pauseTimerButton.onclick = "";
    running = false;
    
}

function stopCircuit() {
    running = false;
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
    clock.style.color = "#D91E36";
    clock.innerHTML = "Stopped";
}

function latestYoutubeVideo() {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails%2Cstatus&playlistId=UUOwIIY3jKWNfNhZ7DEnuqlg&key=AIzaSyB88C612RASr-xRWI2WTfCWAROV4_6VWj8',
        dataType: 'json',
        success: function (data) {
            //              console.log(data);
            //              console.log(data['items'][0]['contentDetails']['videoId']);
            let youtubeurl = "https://www.youtube.com/watch?v=" + data['items'][0]['contentDetails']['videoId'];
            let title = data['items'][0]['snippet']['title'];
            //                    console.log(youtubeurl);
            youtubeLink.innerHTML = "Latest Video: " + title;
            youtubeLink.href = youtubeurl;
        },
        error: function () {
            console.log("Error: Unable to fetch latest video.");
        }
    });
}
