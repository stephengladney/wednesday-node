// ==========================================
//            LET'S GET FUNCTIONAL
// ==========================================

function doTo(func, ...objs) {
  objs.forEach(func);
}

// ==========================================
//                    DOM
// ==========================================

function $(selector) {
  return document.querySelector(selector);
}
function $all(selector) {
  return document.querySelectorAll(selector);
}

// ==========================================
//                 TIME/DATE
// ==========================================

// error.code can be:
//   0: unknown error
//   1: permission denied
//   2: position unavailable (error response from location provider)
//   3: timed out
function myLocation(callback) {
  const errors = {
    0: "Unknown error.",
    1: "Permission denied.",
    2: "Position unavailable",
    3: "Timed out"
  };
  navigator.geolocation.getCurrentPosition(
    callback,
    error => "Error occurred. Error code: " + errors[error.code]
  );
}

function dateNow(format) {
  const today = new Date();
  const day = today.getDate();
  const m = today.getMonth() + 1;
  const year = today.getFullYear();
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let output = String(format).toLowerCase();

  // format year
  if (output.indexOf("yyyy") != -1) {
    output = output.replace("yyyy", year);
  } else {
    output = output.replace("yy", String(year).substring(2));
  }
  //format day
  if (output.indexOf("dd") != -1) {
    output = output.replace("dd", doubleDigit(day));
  } else {
    output = output.replace("d", day);
  }
  //format month
  if (output.indexOf("mmmm") != -1) {
    output = output.replace("mmmm", months[m]);
  } else if (output.indexOf("mmm") != -1) {
    output = output.replace("mmm", String(months[m]).substring(0, 3));
  } else if (output.indexOf("mm") != -1) {
    output = output.replace("mm", doubleDigit(m));
  } else if (output.indexOf("m") != -1) {
    output = output.replace("m", String(m));
  }

  return output;
}

function doubleDigit(i) {
  return i < 10 ? "0" + String(i) : String(i);
}

function weekdayNow() {
  const today = new Date(),
    day = today.getDay(),
    days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

  return days[day];
}

function toDoubleDigit(i) {
  return i < 10 ? "0" + String(i) : String(i);
}

function timeNow(format = 12 /* || 24 */) {
  const today = new Date(),
    h = today.getHours(),
    m = today.getMinutes();

  const toTwelveHour = i => {
      if (i == 0) {
        return 12;
      } else if (i > 12) {
        return i - 12;
      } else {
        return i;
      }
    },
    addAmPm = i => (i < 12 ? "AM" : "PM");

  return format === 24
    ? toDoubleDigit(h) + ":" + toDoubleDigit(m)
    : toTwelveHour(h) + ":" + toDoubleDigit(m) + " " + addAmPm(h);
}

function yourAge(birthday /* MM-DD-YYYY */) {
  const bDayYear = Number(birthday.substr(6)),
    bDayMonth = Number(birthday.substr(0, 2)) - 1,
    bDayDay = Number(birthday.substr(3, 2)),
    timeDiff = new Date(bDayYear, bDayMonth, bDayDay).getTime();

  return new Age(Date.now() - timeDiff);
}

function Age(age) {
  this.inYears = decimalPlaces => {
    return Number(age / (1000 * 60 * 60 * 24 * 365.25)).toFixed(decimalPlaces);
  };
  this.inMonths = decimalPlaces => {
    return Number(age / (1000 * 60 * 60 * 2 * 365.25)).toFixed(decimalPlaces);
  };
  this.inDays = decimalPlaces => {
    return Number(age / (1000 * 60 * 60 * 24)).toFixed(decimalPlaces);
  };
  this.inHours = decimalPlaces => {
    return Number(age / (1000 * 60 * 60)).toFixed(decimalPlaces);
  };
  this.inMinutes = decimalPlaces => {
    return Number(age / (1000 * 60)).toFixed(decimalPlaces);
  };
  this.inSeconds = decimalPlaces => {
    return Number(age / 1000).toFixed(decimalPlaces);
  };
}

function rgbToHex(r, g, b) {
  let r1 = Math.floor(r / 16);
  let g1 = Math.floor(g / 16);
  let b1 = Math.floor(b / 16);
  let r2 = r % 16;
  let g2 = g % 16;
  let b2 = b % 16;
  const toLetter = new Map([
    [0, "0"],
    [1, "1"],
    [2, "2"],
    [3, "3"],
    [4, "4"],
    [5, "5"],
    [6, "6"],
    [7, "7"],
    [8, "8"],
    [9, "9"],
    [10, "a"],
    [11, "b"],
    [12, "c"],
    [13, "d"],
    [14, "e"],
    [15, "f"]
  ]);
  r1 = toLetter.get(r1);
  g1 = toLetter.get(g1);
  b1 = toLetter.get(b1);
  r2 = toLetter.get(r2);
  g2 = toLetter.get(g2);
  b2 = toLetter.get(b2);
  return `#${r1}${r2}${g1}${g2}${b1}${b2}`;
}

function hexToRGB(hexColor) {
  if (hexColor.substr(0, 1) == "#")
    hexColor = hexColor.substr(1, hexColor.length - 1);
  const r1 = hexColor.substr(0, 1).toLowerCase();
  const r2 = hexColor.substr(1, 1).toLowerCase();
  const g1 = hexColor.substr(2, 1).toLowerCase();
  const g2 = hexColor.substr(3, 1).toLowerCase();
  const b1 = hexColor.substr(4, 1).toLowerCase();
  const b2 = hexColor.substr(5, 1).toLowerCase();
  const toNumber = new Map([
    ["0", 0],
    ["1", 1],
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["a", 10],
    ["b", 11],
    ["c", 12],
    ["d", 13],
    ["e", 14],
    ["f", 15]
  ]);
  let r = toNumber.get(r1) * 16 + toNumber.get(r2);
  let g = toNumber.get(g1) * 16 + toNumber.get(g2);
  let b = toNumber.get(b1) * 16 + toNumber.get(b2);
  return `${r}, ${g}, ${b}`;
}

function fade(red1, green1, blue1, red2, green2, blue2, steps) {
  const length = steps - 1;
  let result = [];
  let redIncrement = Math.floor(Math.abs((red2 - red1) / length));
  let greenIncrement = Math.floor(Math.abs((green2 - green1) / length));
  let blueIncrement = Math.floor(Math.abs((blue2 - blue1) / length));
  let redRemainder = ((red2 - red1) / length) % 1;
  let greenRemainder = ((green2 - green1) / length) % 1;
  let blueRemainder = ((blue2 - blue1) / length) % 1;
  let redAdd = redRemainder * length;
  let greenAdd = greenRemainder * length;
  let blueAdd = blueRemainder * length;
  let currentRed = red1;
  let currentGreen = green1;
  let currentBlue = blue1;
  let redDecrease = red2 - red1 < 0;
  let greenDecrease = green2 - green1 < 0;
  let blueDecrease = blue2 - blue1 < 0;
  redDecrease ? (redIncrement *= -1) : redIncrement;
  greenDecrease ? (greenIncrement *= -1) : greenIncrement;
  blueDecrease ? (blueIncrement *= -1) : blueIncrement;

  if (redAdd != 0) {
    redAdd = Math.floor(Math.abs(length / redAdd));
  }
  if (greenAdd != 0) {
    greenAdd = Math.floor(Math.abs(length / greenAdd));
  }
  if (blueAdd != 0) {
    blueAdd = Math.floor(Math.abs(length / blueAdd));
  }

  result.push(rgbToHex(red1, green1, blue1));
  currentRed = red1;
  for (let i = 1; i < length; i++) {
    currentRed += redIncrement;
    currentGreen += greenIncrement;
    currentBlue += blueIncrement;
    if (redAdd != 0 && i % redAdd == 0) {
      !redDecrease ? currentRed++ : currentRed--;
    }
    if (greenAdd != 0 && i % greenAdd == 0) {
      !greenDecrease ? currentGreen++ : currentGreen--;
    }
    if (blueAdd != 0 && i % blueAdd == 0) {
      !blueDecrease ? currentBlue++ : currentBlue--;
    }
    result.push(rgbToHex(currentRed, currentGreen, currentBlue));
  }

  result.push(rgbToHex(red2, green2, blue2));
  return result;
}
