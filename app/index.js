import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { battery } from 'power';
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

let days = document.getElementsByClassName("day");

let hours1 = document.getElementById("hours1");
let hours2 = document.getElementById("hours2");
let mins1 = document.getElementById("mins1");
let mins2 = document.getElementById("mins2");

let batteryLabel = document.getElementById("battery_percentage");
let batteryIcon = document.getElementById("battery_icon");
let bat1 = document.getElementById("bat1");
let bat2 = document.getElementById("bat2");
let bat3 = document.getElementById("bat3");
let bat4 = document.getElementById("bat4");


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
    drawDigit(Math.floor(val / 10), hours1);
  } else {
    drawDigit("", hours1);
  }
  drawDigit(Math.floor(val % 10), hours2);
}

function setMins(val) {
  drawDigit(Math.floor(val / 10), mins1);
  drawDigit(Math.floor(val % 10), mins2);
}

function drawDigit(val, place) {
  place.image = `${val}.png`;
}

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
    drawDigit(1,bat1);
    drawDigit(0,bat2);
    drawDigit(0,bat3);
    bat4.image = 'percent.png'
  } else {
    drawDigit(Math.floor(val / 10), bat1);
    drawDigit(Math.floor(val % 10), bat2);
    bat3.image = 'percent.png'
    bat4.imgae = 'blank.png'
    
  }
}

function setDay(val) {
  days[val].style.opacity = 1;
}