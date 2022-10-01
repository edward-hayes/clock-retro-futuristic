import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { battery } from 'power';
import { HeartRateSensor } from "heart-rate";
import * as util from "../common/utils";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";


// Time Elements
let days = document.getElementsByClassName("day");

let hours1 = document.getElementById("hours1");
let hours2 = document.getElementById("hours2");
let mins1 = document.getElementById("mins1");
let mins2 = document.getElementById("mins2");

// Battery Elements
let batteryLabel = document.getElementById("battery_percentage");
let batteryIcon = document.getElementById("battery_icon");
let bat1 = document.getElementById("bat1");
let bat2 = document.getElementById("bat2");
let bat3 = document.getElementById("bat3");
let bat4 = document.getElementById("bat4");

// HR Elements
let hr1 = document.getElementById("hr1");
let hr2 = document.getElementById("hr2");
let hr3 = document.getElementById("hr3");

// Update Heart Rate Monitor
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {

    setHeartRateLabel(hrm.heartRate);
  });
  hrm.start();



  // Stop Heart Rate Monitor if Not on Wrist
  if (BodyPresenceSensor) {
    const body = new BodyPresenceSensor();
    body.addEventListener("reading", () => {
      if (!body.present) {
        hrm.stop();
        let hr_digit = [hr1,hr2,hr3]; 
        hr_digit.forEach(makeBlank);
        
        function makeBlank(element) {
          util.drawDigit("blank",element);
        }
      } else {
        hrm.start();
      }
    });
    body.start();
  }
  
  // Stop Heart Rate Monitor When Display is Off
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
}

function setHeartRateLabel(val) {
    if (val > 199) {
    util.drawDigit(2,hr1);
    util.drawDigit(Math.floor((val -200)/ 10),hr2);
    util.drawDigit(Math.floor((val -200) % 10),hr3); 
    }
  
    if (200 > val > 99) {
    util.drawDigit(1,hr1);
    util.drawDigit(Math.floor((val -100)/ 10),hr2);
    util.drawDigit(Math.floor((val -100) % 10),hr3);

  } else {
    util.drawDigit(Math.floor(val / 10), hr1);
    util.drawDigit(Math.floor(val % 10), hr2);
    hr3.display = "none";

  }
}

// Update the clock every minute
clock.granularity = "minutes";



// Update Clock
clock.ontick = (evt) => {
  let today = evt.date;
  
  let day = today.getDay()
  setDay(day);
  
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  setHours(hours);
  
  let mins = util.zeroPad(today.getMinutes());
  setMins(mins);
  
  updateBatLevel();

}

function setHours(val) {
  if (val > 9) {
    util.drawDigit(Math.floor(val / 10), hours1);
  } else {
    util.drawDigit("", hours1);
  }
  util.drawDigit(Math.floor(val % 10), hours2);
}

function setMins(val) {
  util.drawDigit(Math.floor(val / 10), mins1);
  util.drawDigit(Math.floor(val % 10), mins2);
}




// Updatet Battery
function updateBatLevel() {
  let batLevel = battery.chargeLevel;
  if (batLevel == 100) {batteryIcon.image = 'battery_full.png';} else
  if (batLevel >= 80) {batteryIcon.image = 'battery_80.png';} else
  if (batLevel >= 60) {batteryIcon.image = 'battery_60.png';} else
  if (batLevel >= 40) {batteryIcon.image = 'battery_40.png';} else
  if (batLevel >= 20) {batteryIcon.image = 'battery_20.png';} else
  if (batLevel < 20) {batteryIcon.image = 'battery_low.png';}
  
  setBatLabel(batLevel);
}

function setBatLabel(val) {

  if (val == 100) {
    util.drawDigit(1,bat1);
    util.drawDigit(0,bat2);
    util.drawDigit(0,bat3);
    util.drawDigit("percent",bat4);
  } else {
    util.drawDigit(Math.floor(val / 10), bat1);
    util.drawDigit(Math.floor(val % 10), bat2);
    util.drawDigit("percent",bat3);
    util.drawDigit("blank",bat4);
    
  }
}


// Update Day
function setDay(val) {
  for (let idx =0; idx < days.length; idx++) {
    switch(idx) {
      case val:
        days[idx].style.opacity = 1;
        break;
      default:
        days[idx].style.opacity =.09;
    }
    
  }
}
