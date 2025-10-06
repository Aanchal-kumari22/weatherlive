const searchIcon = document.querySelector(".fa-search");
const locationInput = document.getElementById("location");
const tempUnitSelect = document.getElementById("temp");
const loadingIndicator = document.createElement("div");

loadingIndicator.textContent = "Loading...";
loadingIndicator.style.color = "white";
loadingIndicator.style.fontSize = "1.2rem";
loadingIndicator.style.marginTop = "1rem";

searchIcon.addEventListener("click", () => {
    const city = locationInput.value.trim();
    if (!city) return showError("Please enter a city name.");
    fetchWeather(city);
});

tempUnitSelect.addEventListener("change", () => {
    const city = document.getElementById("citydisplay").textContent;
    if (city) fetchWeather(city);
});

function fetchWeather(city) {
    showLoading();
    const unit = tempUnitSelect.value === "fahrenheit" ? "imperial" : "metric";
    const url = `http://localhost:5000/weather?city=${city}&unit=${unit}`;


    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("City not found");
            return res.json();
        })
        .then(data => updateWeather(data))
        .catch(err => showError(err.message));
}

function updateWeather(data) {
    hideError();
    hideLoading();

    document.getElementById("citydisplay").textContent = `${data.name}, ${data.sys.country}`;

    document.querySelector(".temperature").textContent = `${Math.round(data.main.temp)}° ${tempUnitSelect.value === "celsius" ? "C" : "F"}`;

    document.querySelector(".feelslike").textContent = `Feels like: ${Math.round(data.main.feels_like)}°`;
    document.querySelector(".description").textContent = data.weather[0].description;
    document.querySelector(".date").textContent = new Date().toLocaleString();
    document.getElementById("HValue").textContent = `${data.main.humidity}%`;
    document.getElementById("WValue").textContent = `${data.wind.speed} ${tempUnitSelect.value === "fahrenheit" ? 'mph' : 'm/s'}`;
    document.getElementById("CValue").textContent = `${data.clouds.all}%`;
    document.getElementById("PValue").textContent = `${data.main.pressure} hPa`;

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    document.getElementById("SRValue").textContent = sunrise.toLocaleTimeString();
    document.getElementById("SSValue").textContent = sunset.toLocaleTimeString();

    const lat = data.coord.lat;
    const lon = data.coord.lon;
    fetch(`http://localhost:5000/weather?city=${city}&unit=${unit}`)
        .then(res => res.json())
        .then(uvData => {
            document.getElementById("UValue").textContent = uvData.value;
        })
        .catch(() => {
            document.getElementById("UValue").textContent = "N/A";
         });


    // Dummy value for UV Index as OpenWeatherMap requires separate API call
    document.getElementById("UValue").textContent = "N/A";

    // Update weather icon
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById("weather").style.backgroundImage = `url(${iconUrl})`;

    // Change background based on temperature or description
    const description = data.weather[0].main.toLowerCase();
    const body = document.body;
    if (description.includes("rain")) {
        body.style.background = "linear-gradient(to right, #3a6073, #16222a)";
    } else if (description.includes("clear")) {
        body.style.background = "linear-gradient(to right, #2980b9, #6dd5fa)";
    } else if (description.includes("cloud")) {
        body.style.background = "linear-gradient(to right, #757f9a, #d7dde8)";
    } else if (data.main.temp < 10) {
        body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
    } else {
        body.style.background = "linear-gradient(to right, #4e54c8, #8f94fb)";
    }
}

function showError(message) {
    hideLoading();
    let errorBox = document.getElementById("errorBox");
    if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.id = "errorBox";
        errorBox.style.color = "white";
        errorBox.style.backgroundColor = "#e74c3c";
        errorBox.style.padding = "0.5rem";
        errorBox.style.borderRadius = "8px";
        errorBox.style.marginTop = "1rem";
        errorBox.style.textAlign = "center";
        document.querySelector(".weather-input").appendChild(errorBox);
    }
    errorBox.textContent = message;
}

function hideError() {
    const errorBox = document.getElementById("errorBox");
    if (errorBox) errorBox.remove();
}

function showLoading() {
    const container = document.querySelector(".weather-input");
    if (!container.contains(loadingIndicator)) {
        container.appendChild(loadingIndicator);
    }
}

function hideLoading() {
    loadingIndicator.remove();
}

