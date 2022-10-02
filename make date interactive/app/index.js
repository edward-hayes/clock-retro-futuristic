import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { battery } from 'power';
import { HeartRateSensor } from "heart-rate";
import * as util from "../common/utils";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { today } from "user-activity";
import { me as appbit } from "appbit";

// Time Elements
let days = document.getElementsByClassName("day");

let hours1 = document.getElementById("hours1");
let hours2 = document.getElementById("hours2");
let mins1 = document.getElementById("mins1");
let mins2 = document.getElementById("mins2");

let mon = document.getElementById("mon");
let date1 = document.getElementById("date1");
let date2 = document.getElementById("date2");

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

// steps elements
let steps1 = document.getElementById("steps1");
let steps2 = document.getElementById("steps2");
let steps3 = document.getElementById("steps3");
let steps4 = document.getElementById("steps4");
let steps5 = document.getElementById("steps5");

// calorie elements
let cal1 = document.getElementById("cal1");
let cal2 = document.getElementById("cal2");
let cal3 = document.getElementById("cal3");
let cal4 = document.getElementById("cal4");
let cal5 = document.getElementById("cal5");

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

function setHeartRateLabel(heartRate) {
  const hrArray = String(heartRate).split("");
  let hr_digit = [hr1,hr2,hr3]; 
  for (let idx=0; idx < hr_digit.length; idx++) {
    if (hrArray[idx] !== undefined ) {
      util.drawDigit(hrArray[idx],hr_digit[idx]);
    }
    else {
      util.drawDigit("blank",hr_digit[idx]);
    }
  }
}

// Update the clock every minute
clock.granularity = "minutes";



// Update Clock
clock.ontick = (evt) => {
  let date = evt.date;
  let day = date.getDay()
  setDay(day);
  
  let hours = date.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  setHours(hours);
  
  let mins = util.zeroPad(date.getMinutes());
  setMins(mins);
  
  setDate(date)
  updateBatLevel();
  setSteps(today.adjusted.steps);
  setCals(today.adjusted.calories);

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

function setDate(date) {
  let month = date.getMonth();
  let date = util.zeroPad(date.getDate());
  
  util.drawDigit("mon_" + month, mon);
  const dateArray = String(date).split("");
  let dates = [date1,date2];
  for (let idx=0; idx < dates.length; idx++) {
    if (dateArray[idx] !== undefined ) {
      util.drawDigit(dateArray[idx],dates[idx]);
    }
    else {
      util.drawDigit("blank",dates[idx]);
    }
  }
}


// Update Battery
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

// Update Steps
function setSteps(todaySteps) {
  const stepsArray = String(todaySteps).split("");
  let steps = [steps1,steps2,steps3,steps4,steps5];
  for (let idx=0; idx < steps.length; idx++) {
    if (stepsArray[idx] !== undefined ) {
      util.drawDigit(stepsArray[idx],steps[idx]);
    }
    else {
      util.drawDigit("blank",steps[idx]);
    }
  }
}

// Update Calories
function setCals(todayCals) {
  const calsArray = String(todayCals).split("");
  let cals = [cal1,cal2,cal3,cal4,cal5];
  for (let idx=0; idx < cals.length; idx++) {
    if (calsArray[idx] !== undefined ) {
      util.drawDigit(calsArray[idx],cals[idx]);
    }
    else {
      util.drawDigit("blank",cals[idx]);
    }
  }
}
