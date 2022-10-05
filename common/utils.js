// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// set the correct digit image to corresponding var
export function drawDigit(val, place) {
  place.image = `${val}.png`;
}

// draw numbers on the corresponding elements
export function setNumber(number, elements) {
  let number = number;
  const strArray = String(number).split("");
  for (let idx=0; idx < elements.length; idx++) {
    if(strArray[idx] !== undefined ) {
      drawDigit(strArray[idx],elements[idx]);
    }
    else {
      makeBlank(elements[idx]);
    }
  }
}

export function makeBlank(element) {
  drawDigit("blank",element);
}