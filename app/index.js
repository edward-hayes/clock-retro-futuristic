import clock from "clock";
import * as document from "document";
import { battery } from 'power';
import { HeartRateSensor } from "heart-rate";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { today } from "user-activity";

// time elements
let elementsMin = document.getElementsByClassName("min");
let elementsHour = document.getElementsByClassName("hour");
let elementsDays = document.getElementsByClassName("day");
let elementsDate = document.getElementsByClassName("date");
let mon = document.getElementById("mon");

// battery elements
let batteryLabel = document.getElementById("battery_percentage");
let batteryIcon = document.getElementById("battery_icon");
let elementsBat = document.getElementsByClassName("bat");

// sensor  elements
let elementsHR = document.getElementsByClassName("hr")
let elementsSteps = document.getElementsByClassName("step");
let elementsCal = document.getElementsByClassName("cal")

// Update Heart Rate Monitor
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
  util.setNumber(hrm.heartRate,elementsHR);
  });
  hrm.start();

  // Stop Heart Rate Monitor if Not on Wrist
  if (BodyPresenceSensor) {
    const body = new BodyPresenceSensor();
    body.addEventListener("reading", () => {
      if (!body.present) {
        hrm.stop();
        elementsHR.forEach(util.makeBlank);   
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

// Update the clock every minute
clock.granularity = "minutes";

// Update Clock, Battery, Day, Steps, Cals
clock.ontick = (evt) => {
  let date = evt.date;
  let mins = util.zeroPad(date.getMinutes());
  let hours = date.getHours();
  let day = date.getDay()
  
  setDate(date);
  util.setNumber(mins,elementsMin);
  setHours(hours, elementsHour);
  setDay(day);
  
  updateBatLevel();
  util.setNumber(today.adjusted.steps,elementsSteps);
  util.setNumber(today.adjusted.calories,elementsCal);
}

function setHours(hours, elementsHour) {
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  util.setNumber(hours, elementsHour);
}

function setDate(date) {
  let month = date.getMonth();
  let date = util.zeroPad(date.getDate());
  
  util.drawDigit("mon_" + month, mon);
  util.setNumber(date,elementsDate);
}

// Update Day
function setDay(val) {
  for (let idx =0; idx < elementsDays.length; idx++) {
    switch(idx) {
      case val:
        elementsDays[idx].style.opacity = 1;
        break;
      default:
        elementsDays[idx].style.opacity =.09;
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

function setBatLabel(batPercentage) {
  let batPercentage = String(batPercentage) +'%';
  util.setNumber(batPercentage,elementsBat);
}
