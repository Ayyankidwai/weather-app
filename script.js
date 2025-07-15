let weather = {
  apiKey: "4c9f63c5f178bce0bd548273514eb39a",

  // Fetch weather by city name
  FetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) throw new Error("City not found");
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((err) => {
        alert("Error: " + err.message);
      });
  },

  // Fetch weather using latitude and longitude
  FetchWeatherByCoords: function (lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Location fetch failed");
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((err) => {
        alert("Error: " + err.message);
      });
  },

  // Display weather info
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    console.log(name, icon, description, temp, humidity, speed);

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://picsum.photos/1920/1080/?"+ name +"')";
  },

  search: function () {
    this.FetchWeather(document.querySelector(".search-bar").value);
  },

  getLocation: function () {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.FetchWeatherByCoords(lat, lon);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          alert("Location access is required to fetch local weather.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  },
};

// Trigger search on button click or enter key
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });
                        //here we integrate the network api 
function checkNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection) {
    const { effectiveType, saveData } = connection;
    const warning = document.createElement("div");
    warning.style.cssText = "padding: 10px; background: orange; color: black; font-size: 14px;";
    
    if (effectiveType === "2g" || effectiveType === "3g" || saveData) {
      warning.innerText = `⚠️ You are on a slow network (${effectiveType}) or using Data Saver. Some features may load slowly.`;
      document.body.prepend(warning);
    }

    // Optional: Log details
    console.log("Network type:", connection.type);
    console.log("Effective type:", effectiveType);
    console.log("Downlink:", connection.downlink + " Mbps");
    console.log("RTT:", connection.rtt + " ms");
    console.log("Data Saver:", saveData);
  } else {
    console.log("Network Information API not supported in this browser.");
  }
}
function refreshWeatherWhenIdle() {             //fuction for refreshing weather when idle 
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      console.log("Idle time: refreshing weather...");
      weather.getLocation(); // re-fetches based on geolocation
    }, { timeout: 5000 });
  } else {
    setTimeout(() => {
      console.log("Timeout fallback: refreshing weather...");
      weather.getLocation();
    }, 5000);
  }
}
window.addEventListener("load", function () {
  weather.getLocation();      //  get weather based on location
  checkNetworkInfo();         //  check internet quality
  refreshWeatherWhenIdle();   //  background weather refresh
});
