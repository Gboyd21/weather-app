let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let now = new Date();
let day = days[now.getDay()];
let hour = now.getHours();
let morningEvening = hour >= 12 ? "pm" : "am";
hour = hour % 12;
hour = hour ? hour : 12;
if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let date = document.querySelector("#date");
date.innerHTML = `${day} ${hour}:${minutes} ${morningEvening}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <div class="dates">${formatDay(forecastDay.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" class="weather-icons" />
            <div class="high-low">H:${Math.round(
              forecastDay.temp.max
            )}°|L:${Math.round(forecastDay.temp.min)}°</div>
          </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "89e401f112d23210a9978961b6aefa4e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemp(response) {
  let temperature = document.querySelector("#temperature");
  let wind = Math.round(response.data.wind.speed);
  let windSpeed = document.querySelector("#wind-speed");
  let humidityData = Math.round(response.data.main.humidity);
  let humidity = document.querySelector("#humidity");
  let newCity = document.querySelector(".city");
  let description = document.querySelector("#description");
  let icon = document.querySelector("#icon-code");

  fahrenheitTemp = Math.round(response.data.main.temp);

  temperature.innerHTML = `${fahrenheitTemp}`;
  windSpeed.innerHTML = `${wind} mph`;
  humidity.innerHTML = `${humidityData} %`;
  newCity.innerHTML = `${response.data.name}`;
  description.innerHTML = response.data.weather[0].description;

  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "cd891ee483e8a9a51b8fc31affc5f978";
  let unit = "imperial";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?q=";
  let apiUrl = `${apiEndpoint}${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#searching");
  search(city.value);
}

function showGeoTemp(response) {
  let temperature = Math.round(response.data.main.temp);
  let wind = Math.round(response.data.wind.speed);
  let humidityData = Math.round(response.data.main.humidity);
  let city = response.data.name;
  let newCity = document.querySelector(".city");
  let humidity = document.querySelector("#humidity");
  let cityTemp = document.querySelector("#temperature");
  let windSpeed = document.querySelector("#wind-speed");

  cityTemp.innerHTML = `${temperature}`;
  humidity.innerHTML = humidityData;
  newCity.innerHTML = city;
  windSpeed.innerHTML = `Wind: ${wind} mph`;
}

function showPosition(position) {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiKey = "cd891ee483e8a9a51b8fc31affc5f978";
  let unit = "imperial";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(showGeoTemp);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let celsius = ((fahrenheitTemp - 32) * 5) / 9;
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsius);
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = fahrenheitTemp;
}

let fahrenheitTemp = null;

let form = document.querySelector("#search-city-form");
form.addEventListener("submit", handleSubmit);

let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

search("chattanooga");
