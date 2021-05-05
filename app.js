// every one min
let count = 0;
let arrDates = [];
setDatesArr();
let district_id;
let blackListedCentres = []; // input centre ids from get request response which centres you want to blackList
let alterOn = false;
let age;
/**===================================================================================================================== */
let data = [
  { state_id: 1, state_name: "Andaman and Nicobar Islands" },
  { state_id: 2, state_name: "Andhra Pradesh" },
  { state_id: 3, state_name: "Arunachal Pradesh" },
  { state_id: 4, state_name: "Assam" },
  { state_id: 5, state_name: "Bihar" },
  { state_id: 6, state_name: "Chandigarh" },
  { state_id: 7, state_name: "Chhattisgarh" },
  { state_id: 8, state_name: "Dadra and Nagar Haveli" },
  { state_id: 37, state_name: "Daman and Diu" },
  { state_id: 9, state_name: "Delhi" },
  { state_id: 10, state_name: "Goa" },
  { state_id: 11, state_name: "Gujarat" },
  { state_id: 12, state_name: "Haryana" },
  { state_id: 13, state_name: "Himachal Pradesh" },
  { state_id: 14, state_name: "Jammu and Kashmir" },
  { state_id: 15, state_name: "Jharkhand" },
  { state_id: 16, state_name: "Karnataka" },
  { state_id: 17, state_name: "Kerala" },
  { state_id: 18, state_name: "Ladakh" },
  { state_id: 19, state_name: "Lakshadweep" },
  { state_id: 20, state_name: "Madhya Pradesh" },
  { state_id: 21, state_name: "Maharashtra" },
  { state_id: 22, state_name: "Manipur" },
  { state_id: 23, state_name: "Meghalaya" },
  { state_id: 24, state_name: "Mizoram" },
  { state_id: 25, state_name: "Nagaland" },
  { state_id: 26, state_name: "Odisha" },
  { state_id: 27, state_name: "Puducherry" },
  { state_id: 28, state_name: "Punjab" },
  { state_id: 29, state_name: "Rajasthan" },
  { state_id: 30, state_name: "Sikkim" },
  { state_id: 31, state_name: "Tamil Nadu" },
  { state_id: 32, state_name: "Telangana" },
  { state_id: 33, state_name: "Tripura" },
  { state_id: 34, state_name: "Uttar Pradesh" },
  { state_id: 35, state_name: "Uttarakhand" },
  { state_id: 36, state_name: "West Bengal" },
];

let mySelect = document.getElementById("selectParent");
let myDistrictSelect = document.getElementById("selectChild");
let myAgeSelect = document.getElementById("selectAge");
data.forEach((item) => {
  selectParent.innerHTML += `<option id="${item.state_id}" value="${item.state_id}">${item.state_name}</option`;
});

[
  { id: "age18", label: 18 },
  { id: "age45", label: 45 },
].forEach((item) => {
  selectAge.innerHTML += `<option id="${item.id}" value="${item.label}">${item.label}</option`;
});

mySelect.addEventListener("change", function () {
  handleChange();
});

myDistrictSelect.addEventListener("change", function () {
  handleDistrictChange();
});

myDistrictSelect.addEventListener("change", function () {
  handleAgeChange();
});

function handleAgeChange() {
  age = parseInt(myAgeSelect.value);
}

function handleChange() {
  let selectChild = document.getElementById("selectChild");
  let childOptions = document.querySelectorAll("#selectChild option");
  let currentVal = mySelect.value;
  selectChild.removeAttribute("disabled");
  childOptions.forEach((item) => {
    if (!item.disabled) {
      item.remove();
    }
  });

  fetch(
    `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${currentVal}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.districts.forEach((child) => {
        selectChild.innerHTML += `<option id="${child.district_id}" value="${child.district_id}">${child.district_name}</option>`;
      });
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

function handleDistrictChange() {
  let currentVal = myDistrictSelect.value;
  district_id = currentVal;
  tweet();
  start();
  mySelect.setAttribute("disabled", "disabled");
  myDistrictSelect.setAttribute("disabled", "disabled");
  myAgeSelect.setAttribute("disabled", "disabled");
}

/**===================================================================================================================== */

let myVar = setInterval(function () {
  tweet();
}, 30 * 1000);

//    12 hr timeout
function start() {
  setTimeout(myStopFunction, 12 * 60 * 60 * 1000);
  var tag = document.createElement("p");
  var text = document.createTextNode(
    "Script Started...Now leave it open and wait......... ¯_(ツ)_/¯"
  );
  tag.appendChild(text);
  var element = document.getElementById("new");
  element.appendChild(tag);
}

// clears the interval

function myStopFunction() {
  clearInterval(myVar);
}

function tweet() {
  for (let k = 0; arrDates.length > k; k++) {
    fetch(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${arrDates[k]}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        checkVaccineAvailability(myJson);
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  }
}

function checkVaccineAvailability(myJson) {
  count = count + 1;
  console.log(count);
  // console.log(myJson);
  for (let i = 0; myJson.centers.length > i; i++) {
    if (myJson.centers[i].sessions) {
      for (let j = 0; myJson.centers[i].sessions.length > j; j++) {
        if (
          myJson.centers[i].sessions[j].available_capacity > 0 &&
          age >= myJson.centers[i].sessions[j].min_age_limit &&
          !blackListedCentres.includes(myJson.centers[i].center_id)
        ) {
          console.log(
            "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          );
          console.table(myJson.centers[i]);
          console.log(
            "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          );

          var tag = document.createElement("p");
          var text = document.createTextNode(
            "Availibility Found.. And Go To COWIN website..check Console (press F12) (☞ﾟヮﾟ)☞"
          );
          tag.appendChild(text);
          var element = document.getElementById("new");
          element.appendChild(tag);
          if (!alterOn) {
            soundTheAlter();
          }
          break;
        }
      }
    }
  }
}

function soundTheAlter() {
  window.open("https://www.youtube.com/watch?v=xhWUUblpDZA", "_blank ");
  alterOn = true;
}

function setDatesArr() {
  let today = new Date();
  let todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  let strArr = todayDate.toLocaleDateString().replaceAll("/", "-").split("-");
  let temp = strArr[1];
  strArr[1] = strArr[0];
  strArr[0] = temp;
  arrDates[0] = strArr.join("-");

  for (let i = 1; 10 > i; i++) {
    parseInt(strArr[0]) + 7 > 30
      ? (strArr[1] = parseInt(strArr[1]) + 1).toString()
      : null;
    parseInt(strArr[0]) + 7 > 30
      ? (strArr[0] = "1")
      : (strArr[0] = parseInt(strArr[0]) + 7).toString();

    arrDates[i] = strArr.join("-");
  }
}

// Manik(⌐■_■)
