import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { battery } from 'power';
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

let days = document.getElementsByClassName("day")

let hours1 = document.getElementById("hours1");
let hours2 = document.getElementById("hours2");
let mins1 = document.getElementById("mins1");
let mins2 = document.getElementById("mins2");

let batteryLabel = document.getElementById("battery_percentage")


clock.ontick = (evt) => {
  let today = evt.date;
  
  let day = today.getDay()
  setDay(day)
  
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
  
  updateBatLevel()

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
  batteryLabel.text = batLevel + "%";
}

function setDay(val) {
  days[val].style.opacity = 1;
}