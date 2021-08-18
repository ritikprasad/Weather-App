const weatherApi = {
  key: "563c133f6bdaf3b4bca5100925520106",
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

const searchForm = document.querySelector(".search-form");
const searchbox = document.querySelector(".search-box");
const searchbtn = document.querySelector(".search-btn");
const mylocation = document.querySelector(".my-location");
const info = document.querySelector(".info");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  console.log("Your Browser supports speech Recognition");
  const recognition = new SpeechRecognition();
  recognition.continuous = true;

  const mic = document.querySelector(".mic");
  const micIcon = mic.firstElementChild;
  mic.addEventListener("click", micBtnClick);
  function micBtnClick() {
    if (micIcon.classList.contains("bi-mic")) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }
  recognition.addEventListener("start", () => {
    micIcon.classList.remove("bi-mic");
    micIcon.classList.add("bi-mic-mute");
    searchbox.focus();
    console.log("Voice activated, SPEAK");
  });
  recognition.addEventListener("end", () => {
    micIcon.classList.remove("bi-mic-mute");
    micIcon.classList.add("bi-mic");
    searchbox.focus();
    console.log("Speech recognition service disconnected");
  });

  recognition.addEventListener("result", (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    console.log(event, transcript);
    if (transcript.toLowerCase().trim() === "stop recording") {
      recognition.stop();
    } else if (!searchbox.value) {
      searchbox.value = transcript;
    } else {
      if (transcript.toLowerCase().trim() === "go") {
        getWeather(searchbox.value);
        document.querySelector(".widget").style.display = "block";

        document.querySelector(".weather-forecast").style.display = "flex";
      } else if (transcript.toLowerCase().trim() === "reset") {
        searchbox.value = "";
      } else {
        searchbox.value = transcript;
      }
    }
  });
  info.textContent = 'Voice Commands: "stop recording", "reset", "go"';
} else {
  console.log("Your Browser does not support speech Recognition");
  info.textContent = "Your Browser does not support Speech Recognition";
}
function dateManage(dateArg) {
  let year = dateArg.getFullYear();
  let month = dateArg.getMonth() + 1;

  let date = dateArg.getDate();
  let now = new Date();
  let hrs = now.getHours();
  let min = now.getMinutes();
  const hoursIn12HrFormat = hrs >= 13 ? hrs % 12 : hrs;
  const ampm = hrs >= 12 ? "PM" : "AM";

  return `${date}/ ${month}/ ${year} `;
}
function timeManage() {
  let now = new Date();
  let hrs = now.getHours();
  let min = now.getMinutes();
  const hoursIn12HrFormat = hrs >= 13 ? hrs % 12 : hrs;
  const ampm = hrs >= 12 ? "PM" : "AM";

  return ` ${
    hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat
  } : ${min < 10 ? "0" + min : min} ${ampm} `;
}
function report(response) {
  console.log(response);
  for (i = 1; i <= 5; i++) {
    let now = new Date(response.list[i * 8 - 1].dt * 1000).toLocaleDateString();
    console.log(now);
    let dates = document.querySelector(`.date${i}`);
    dates.innerHTML = now;

    let imgs = document.querySelector(`.img${i}`);
    let icon = response.list[i * 8 - 1].weather[0].icon;
    imgs.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

    let temps = document.querySelector(`.temp${i}`);
    let tempK = response.list[i * 8 - 1].main.temp;
    temps.innerHTML = `Temp: ${(tempK - 273.5).toFixed(2)}&deg; C`;

    let humiditys = document.querySelector(`.humidity${i}`);
    var humidity = response.list[i * 8 - 1].main.humidity;
    humiditys.innerHTML = `Humidity: ${humidity}%`;
  }
}

function fivedayforecast(id) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${weatherApi.key}`
  )
    .then((response) => response.json())
    .then(report);
}
function showWeather(weather) {
  console.log(weather);

  let weathericon = document.querySelector(".imgcond");
  let icon = weather.weather[0].icon;
  weathericon.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

  let temp = document.querySelector(".weatherinfo");
  temp.innerHTML = `${Math.round(weather.main.temp)}&deg;C`;

  let weathercond = document.querySelector(".weather-cond");
  weathercond.innerText = `${weather.weather[0].main}`;

  let place = document.querySelector(".place");
  place.innerText = `${weather.name},${weather.sys.country}`;

  let humiditytext = document.querySelector(".humidity");
  humiditytext.innerText = `${weather.main.humidity}% Humidity`;

  let pressure = document.querySelector(".pressure");
  pressure.innerText = `${weather.main.pressure} mb Pressure`;

  let windspeed = document.querySelector(".windspeed");
  windspeed.innerText = `${weather.wind.speed}mph Speed`;

  let date = document.querySelector(".date");
  let todayDate = new Date();
  date.innerText = dateManage(todayDate);

  let time = document.querySelector(".time");
  time.innerText = timeManage();

  let sunset = document.querySelector(".cond");
  sunset.innerHTML = `${Math.ceil(
    weather.main.temp_max
  )}&deg;C(Max)  ${Math.floor(weather.main.temp_min)}&deg;C(Min)`;

  fivedayforecast(weather.id);

  if (weathercond.textContent == "Clear") {
    document.body.style.backgroundImage =
      "url('https://images.pexels.com/photos/7084167/pexels-photo-7084167.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
  } else if (weathercond.textContent == "Clouds") {
    document.body.style.backgroundImage =
      "url('https://images.pexels.com/photos/1101108/pexels-photo-1101108.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
  } else if (
    weathercond.textContent == "Haze" ||
    weathercond.textContent == "Smoke"
  ) {
    document.body.style.backgroundImage =
      "url('https://images.pexels.com/photos/1809644/pexels-photo-1809644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
    info.style.color = "white";
  } else if (weathercond.textContent == "Rain") {
    document.body.style.backgroundImage =
      "url('https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
    info.style.color = "white";
  } else if (weathercond.textContent == "Snow") {
    document.body.style.backgroundImage =
      "url('https://images.pexels.com/photos/773594/pexels-photo-773594.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
    info.style.color = "white";
  } else if (weathercond.textContent == "Thunderstorm") {
    document.body.style.backgroundImage =
      "url('https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
    info.style.color = "white";
  }
}

function getWeather(city) {
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then((weather) => {
      return weather.json();
    })
    .then(showWeather)
    .catch(() => {
      document.querySelector(".widget").style.display = "none";
      document.querySelector(".weather-forecast").style.display = "none";
      alert("Oops yours Location could not be found!! 😢 😢");
    });
}

function showmy(lat, lon) {
  console.log(lat, lon);
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApi.key}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const place = data.name;
      console.log(place);
      getWeather(place);
    });
}

searchbtn.addEventListener("click", (event) => {
  event.preventDefault();
  getWeather(searchbox.value);
  if (searchbox.value != "") {
    document.querySelector(".widget").style.display = "block";

    document.querySelector(".weather-forecast").style.display = "flex";
  }

  console.log(searchbox.value);
});

mylocation.addEventListener("click", (event) => {
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      showmy(position.coords.latitude, position.coords.longitude);
    });
  }
  document.querySelector(".widget").style.display = "block";

  document.querySelector(".weather-forecast").style.display = "flex";
});
