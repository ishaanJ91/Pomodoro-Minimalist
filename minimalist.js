 
const toggleButton = document.getElementById("toggleButton");
let timerInterval;
let isRunning = false;
let totalSeconds;
let isStart = false;

const pomodoroButton = document.getElementById("pomodoro");
const shortBreakButton = document.getElementById("shortBreak");
const longBreakButton = document.getElementById("longBreak");

let originalMinutes = 25; // Default Pomodoro duration
let userDefinedPomodoroMinutes = originalMinutes; // Store user-defined Pomodoro time

let userDefinedShortBreakMinutes = 5; // Default Short Break duration
let userDefinedLongBreakMinutes = 15; // Default Long Break duration

let currentDot = 0;
const dots = document.querySelectorAll('.dot');

let pomodoroCycleCount = 0;

var checkbox = document.getElementById("ChangeTheme"); //get the checkbox to a variable

if (sessionStorage.getItem("mode") == "dark") {
    darkmode(); //if dark mode was on, run this funtion
} else {
    nodark(); //else run this funtion
}

checkbox.addEventListener("change", function() {
    //check if the checkbox is checked or not
    if (checkbox.checked) {
        darkmode(); //if the checkbox is checked, run this funtion
    } else {
        nodark(); //else run this funtion
    }
});

function darkmode() {
    document.body.classList.add("dark-mode"); //add a class to the body tag
    checkbox.checked = true; //set checkbox to be checked state
    sessionStorage.setItem("mode", "dark"); //store a name & value to know that dark mode is on
}

function nodark() {
    document.body.classList.remove("dark-mode"); //remove added class from body tag
    checkbox.checked = false; //set checkbox to be unchecked state
    sessionStorage.setItem("mode", "light"); //store a name & value to know that dark mode is off or light mode is on
}

function padZero(num) {
    return num < 10 ? '0' + num : num;
}

function activateButton(button) {
    const buttons = document.querySelectorAll(".box_timer");
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}

function activateThemeButton(button) {
    const themeButtons = document.querySelectorAll(".theme-button");
    themeButtons.forEach(btn => btn.classList.remove("active-theme"));
    button.classList.add("active-theme");
}

function resetTimer() {
    clearInterval(timerInterval);
    const minsInput = document.querySelector(".mins");
    const toggleButton = document.getElementById("toggleButton");

    toggleButton.textContent = "Start";
    toggleButton.classList.remove("pause");
    toggleButton.classList.add("start");

    minsInput.value = padZero(originalMinutes);
    document.querySelector(".secs").textContent = "00";

    isRunning = false;
}

function activateDot(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function resetDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    currentDot = 0;
}

pomodoroButton.addEventListener("click", function() {
    originalMinutes = userDefinedPomodoroMinutes; // Restore user-defined Pomodoro duration
    const minsInput = document.querySelector(".mins");
    minsInput.max = 180; // Set max value for pomodoro
    minsInput.value = padZero(originalMinutes);
    document.querySelector(".secs").textContent = "00";
    activateButton(this);
    resetTimer();
});

shortBreakButton.addEventListener("click", function() {
    originalMinutes = userDefinedShortBreakMinutes; // Restore user-defined Short Break duration
    const minsInput = document.querySelector(".mins");
    minsInput.max = 25; // Set max value for short break
    minsInput.value = padZero(originalMinutes);
    document.querySelector(".secs").textContent = "00";
    activateButton(this);
    resetTimer();
});

longBreakButton.addEventListener("click", function() {
    originalMinutes = userDefinedLongBreakMinutes; // Restore user-defined Long Break duration
    const minsInput = document.querySelector(".mins");
    minsInput.max = 60; // Set max value for long break
    minsInput.value = padZero(originalMinutes);
    document.querySelector(".secs").textContent = "00";
    activateButton(this);
    resetTimer();
});

document.querySelector(".mins").addEventListener("change", function() {
    if (!isRunning) {
        const newValue = parseInt(this.value);
        if (pomodoroButton.classList.contains("selected")) {
            userDefinedPomodoroMinutes = Math.min(newValue, 180); // Update user-defined Pomodoro duration
        } else if (shortBreakButton.classList.contains("selected")) {
            userDefinedShortBreakMinutes = Math.min(newValue, 25); // Update user-defined Short Break duration
        } else if (longBreakButton.classList.contains("selected")) {
            userDefinedLongBreakMinutes = Math.min(newValue, 60); // Update user-defined Long Break duration
        }
        originalMinutes = Math.min(newValue, this.max);
        this.value = padZero(originalMinutes);
        document.querySelector(".secs").textContent = "00";
    }
});

function startTimer() {
    const minsInput = document.querySelector(".mins");
    const secsInput = document.querySelector(".secs");

    if (!isStart) {
        originalMinutes = parseInt(minsInput.value);
        isStart = true;
    }

    let minutes = parseInt(minsInput.value);
    const maxMinutes = parseInt(minsInput.max);
    if (minutes > maxMinutes) {
        minutes = maxMinutes;
        minsInput.value = padZero(maxMinutes);
    }

    totalSeconds = minutes * 60 + parseInt(secsInput.textContent);

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            toggleButton.textContent = "Start";
            isRunning = false;
            autoSwitchTimer(); // Automatically switch to the next timer
            return;
        }
        totalSeconds--;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        minsInput.value = padZero(minutes);
        secsInput.textContent = padZero(seconds);
    }, 1000);

    isRunning = true;
}

toggleButton.addEventListener("click", function() {
    if (isRunning) {
        clearInterval(timerInterval);
        toggleButton.textContent = "Start";
        toggleButton.classList.remove("pause");
        isRunning = false;
    } else {
        startTimer();
        toggleButton.textContent = "Pause";
        toggleButton.classList.add("pause");
        isRunning = true;
    }
});

function rotateImage() {
    resetTimer();
    const reloadImg = document.querySelector('.reload');
    reloadImg.classList.add('rotate');
    reloadImg.addEventListener('transitionend', function rotateEnd() {
        reloadImg.classList.remove('rotate');
    });
}

document.getElementById("sidebarToggle").addEventListener("click", function() {
    toggleVis();
    toggleSidebar();
    moveCheckContainer(); // Call moveCheckContainer() here
    toggleTimerContainer();
});

function toggleTimerContainer() {
    const container = document.querySelector('.container');
    container.classList.toggle('move-container');
}


function toggleVis() {
    const frm = document.getElementById("edit-timer");
    if (frm.style.visibility !== "visible") {
        frm.style.visibility = "visible";
    } else {
        frm.style.visibility = "hidden";
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("show-sidebar");
    moveCheckContainer(); // Call moveCheckContainer() here as well
}

// Automatically switch to the next timer
function autoSwitchTimer() {
    if (pomodoroButton.classList.contains("selected")) {
        if (pomodoroCycleCount < 3) {
            shortBreakButton.click();
            toggleButton.click();
            activateDot(currentDot);
            currentDot = (currentDot + 1) % dots.length;
            pomodoroCycleCount++;
        } else {
            longBreakButton.click();
            activateDot(currentDot);
            resetDots();
            pomodoroCycleCount = 0;
        }
    } else if (shortBreakButton.classList.contains("selected")) {
        pomodoroButton.click();
        toggleButton.click();
    } else if (longBreakButton.classList.contains("selected")) {
        // After long break, stop the cycle completely
        resetTimer();
        resetDots();
    }
}


// Initialize the Pomodoro as the default selected timer on page load
window.addEventListener("load", function() {
    pomodoroButton.click();
});


// Example: Timer button activation code for reference
function activateButton(button) {
    const buttons = document.querySelectorAll(".box_timer");
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}


// ...rest of your existing JavaScript code...


var icon = document.getElementById("darkmode");
icon.onclick = function() {
    document.body.classList.toggle("dark-theme");
    
    if (document.body.classList.contains("dark-theme")) {
        icon.src = "images/sun.png";
    } else {
        icon.src = "images/moon.png";
    }
}

document.addEventListener("click", function(e) {
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarButton = document.getElementById('toggleSidebarButton');
    const container = document.querySelector('.container');

    if (e.target !== sidebar && e.target !== toggleSidebarButton && !sidebar.contains(e.target)) {
        sidebar.classList.remove('show-sidebar');
        container.classList.remove('move-container');
        moveCheckContainer(); // Call moveCheckContainer() here as well
    }
});

function moveCheckContainer() {
    const checkContainer = document.querySelector('.check-container');
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.classList.contains('show-sidebar')) {
        checkContainer.classList.add('move-top-right');
    } else {
        checkContainer.classList.remove('move-top-right');
    }
}

let closeSidebar = document.getElementById("edit-timer");

document.querySelector('.container').onclick = e => {
    closeSidebar.style.display = "block";
    e.stopPropagation();
}

document.body.addEventListener("click", e => {
    if (!closeSidebar.contains(e.target)) {
        closeSidebar.style.display = "none";
    }
});




function handleClick(e) {
    if (e.target.matches('img')) {
        console.log('Image clicked:', e.target.src);  // Debugging line
        const { src } = e.target;
        document.querySelector('.container').style.backgroundImage = `url(${src})`;
    }
}



document.addEventListener('DOMContentLoaded', function() {
    // Select all images with the class 'pic'
    const images = document.querySelectorAll('.pic');
    
    // Add a click event listener to each image
    images.forEach(image => {
        image.addEventListener('click', handleClick, false);
    });

    // Function to handle the click event
    function handleClick(e) {
        if (e.target.matches('img')) {
            const { src } = e.target;
            document.querySelector('.container').style.backgroundImage = `url(${src})`;
        }
    }
});


