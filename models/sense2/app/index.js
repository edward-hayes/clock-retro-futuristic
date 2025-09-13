import clock from "clock";
import * as document from "document";
import { battery } from "power";
import { HeartRateSensor } from "heart-rate";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { today } from "user-activity";

// cacheStepsEndpoints();

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
let elementsHR = document.getElementsByClassName("hr");
let elementsSteps = document.getElementsByClassName("step");
let elementsCal = document.getElementsByClassName("cal");

// Update Heart Rate Monitor
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    //setStepsOctagon((hrm.heartRate / 200) * 100);
    util.setNumber(hrm.heartRate, elementsHR);
  });
  hrm.start();

  // Stop Heart Rate Monitor if Not on Wrist
  if (BodyPresenceSensor) {
    const body = new BodyPresenceSensor();
    body.addEventListener("reading", () => {
      if (!body.present) {
        hrm.stop();
        util.setNumber("", elementsHR);
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

// Update Clock, Battery, Day, Steps, Cals every minute
clock.granularity = "minutes";
clock.ontick = (evt) => {
  let date = evt.date;
  let mins = util.zeroPad(date.getMinutes());
  let hours = date.getHours();
  let day = date.getDay();

  setDate(date);
  util.setNumber(mins, elementsMin);
  setHours(hours, elementsHour);
  setDay(day);

  updateBatLevel();
  util.setNumber(today.adjusted.steps, elementsSteps);
  util.setNumber(today.adjusted.calories, elementsCal);
};

function setHours(hours, elementsHour) {
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = util.zeroPad(hours % 12 || 12);
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  util.setNumber(hours, elementsHour);
}

function setDate(date) {
  let month = date.getMonth();
  let date = util.zeroPad(date.getDate());

  util.setImage(`mon_${month}`, mon);
  util.setNumber(date, elementsDate);
}

function setDay(val) {
  for (let idx = 0; idx < elementsDays.length; idx++) {
    switch (idx) {
      case val:
        elementsDays[idx].style.opacity = 1;
        break;
      default:
        elementsDays[idx].style.opacity = 0.09;
    }
  }
}

function updateBatLevel() {
  let batLevel = battery.chargeLevel;
  if (batLevel == 100) {
    util.setImage("battery_full", batteryIcon);
  } else if (batLevel >= 80) {
    util.setImage("battery_80", batteryIcon);
  } else if (batLevel >= 60) {
    util.setImage("battery_60", batteryIcon);
  } else if (batLevel >= 40) {
    util.setImage("battery_40", batteryIcon);
  } else if (batLevel >= 20) {
    util.setImage("battery_20", batteryIcon);
  } else if (batLevel < 20) {
    util.setImage("battery_low", batteryIcon);
  }

  setBatLabel(batLevel);
}

function setBatLabel(batPercentage) {
  let batPercentage = String(batPercentage) + "%";
  util.setNumber(batPercentage, elementsBat);
}

// function setStepsOctagon(n) {
//   n = Math.max(0, Math.min(n, 100));

//   const segments = document.getElementsByClassName("steps-octagon");
//   const total = segments.length;

//   const progress = (n / 100) * total;
//   const fullVisible = Math.floor(progress);
//   const partialProgress = progress - fullVisible;

//   // Show full segments
//   for (let i = 0; i < total; i++) {
//     const seg = segments[i];
//     if (i < fullVisible) {
//       seg.style.visibility = "visible";
//       // Reset to full endpoint in case it was trimmed before
//       seg.setAttribute("x2", seg.dataset.x2);
//       seg.setAttribute("y2", seg.dataset.y2);
//     } else if (i === fullVisible && partialProgress > 0) {
//       seg.style.visibility = "visible";

//       // Get original start and end coordinates
//       const x1 = parseFloat(seg.getAttribute("x1"));
//       const y1 = parseFloat(seg.getAttribute("y1"));
//       const x2 = parseFloat(seg.dataset.x2);
//       const y2 = parseFloat(seg.dataset.y2);

//       // Calculate partial point
//       const newX = x1 + (x2 - x1) * partialProgress;
//       const newY = y1 + (y2 - y1) * partialProgress;

//       seg.setAttribute("x2", newX.toFixed(1));
//       seg.setAttribute("y2", newY.toFixed(1));
//     } else {
//       seg.style.visibility = "hidden";
//     }
//   }
// }

// function cacheStepsEndpoints() {
//   const segments = document.getElementsByClassName("steps-octagon");
//   for (let seg of segments) {
//     seg.dataset.x2 = seg.getAttribute("x2");
//     seg.dataset.y2 = seg.getAttribute("y2");
//   }
// }
