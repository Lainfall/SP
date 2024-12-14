// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector(".weatherIcon");
const tempElement = document.querySelector(".weatherValue p");
const descElement = document.querySelector(".weatherDescription p");

const weather = {};
weather.temperature = {
  unit: "celsius",
};

const tempUnit = CONFIG.weatherUnit;
const KELVIN = 273.15;
let key;

getWeatherAPIKey();
setPosition();

function getWeatherAPIKey() {
  key = CONFIG.weatherKey || localStorage.getItem("apiKey");
  if (key) return;

  key = prompt("Insert Weather API key:");
  localStorage.setItem("apiKey", key);
}

function setPosition(position) {
  if (!CONFIG.trackLocation || !navigator.geolocation) {
    if (CONFIG.trackLocation) {
      console.error("Geolocation not available");
    }
    getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      getWeather(
        pos.coords.latitude.toFixed(3),
        pos.coords.longitude.toFixed(3),
      );
    },
    (err) => {
      console.error(err);
      getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
    },
  );
}

function getWeather(latitude, longitude) {
  let api =
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&lang=${CONFIG.language}`;
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      let celsius = Math.floor(data.main.temp - KELVIN);
      weather.temperature.value = tempUnit == "C"
        ? celsius
        : (celsius * 9) / 5 + 32;
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
    })
    .then(function () {
      displayWeather();
    });
}

function displayWeather() {
  iconElement.innerHTML =
    `<img src="assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${
    weather.temperature.value.toFixed(0)
  }°<span class="darkfg">${tempUnit}</span>`;
  descElement.innerHTML = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);
}
