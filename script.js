const userLocation = document.getElementById("userlocation"),
      converter = document.getElementById("converter"),
      weatherIcon = document.querySelector(".weatherIcon"),
      temperature = document.querySelector(".temperature"),
      feelsLike = document.querySelector(".feelsLike"),
      description = document.querySelector(".description"),
      date = document.querySelector(".date"),
      city = document.querySelector(".city"),
      HValue = document.getElementById("HValue"),
      WValue = document.getElementById("WValue"),
      SRValue = document.getElementById("SRValue"),
      SSValue = document.getElementById("SSValue"),
      CVValue = document.getElementById("CValue"),
      UVValue = document.getElementById("UVValue"),
      PVValue = document.getElementById("PValue"),
      Forecast = document.querySelector(".Forecast");

// Visual Crossing Weather API Endpoint
const WEATHER_DATA_ENDPOINT = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const API_KEY = 'ERUXBWDK3KGVLGMW5CGCYZFEY'; // Your API Key

function findUserLocation() {
    const location = userLocation.value; // Get the location input by the user
    if (!location) {
        alert("Please enter a location!");
        return;
    }

    // Construct the dynamic API endpoint
    const apiUrl = `${WEATHER_DATA_ENDPOINT}${encodeURIComponent(location)}?key=${API_KEY}&days=7`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data); 
            city.innerHTML = data.resolvedAddress;
            const iconCode = data.currentConditions.icon;
            const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${iconCode}.png`;
            weatherIcon.innerHTML = `<img src="${iconUrl}" alt="Weather Icon" />`;

            let currentTemp = data.currentConditions.temp;
            temperature.innerHTML = `${currentTemp}°C`; // Set the initial temperature
            feelsLike.innerHTML = `Feels like: ${data.currentConditions.feelslike}°C`;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;${data.currentConditions.conditions}`;

            HValue.innerHTML = `${Math.round(data.currentConditions.humidity)}<span>%<span>`;
            WValue.innerHTML = `${Math.round(data.currentConditions.windspeed)}<span>ms<span>`;
            SRValue.innerHTML = data.currentConditions.sunrise;
            SSValue.innerHTML = data.currentConditions.sunset;
            CVValue.innerHTML = `${Math.round(data.currentConditions.cloudcover)}<span>%<span>`;
            UVValue.innerHTML = `${Math.round(data.currentConditions.uvindex)}<span>UV<span>`;
            PVValue.innerHTML = `${Math.round(data.currentConditions.pressure)}<span>hpa<span>`;

            updateForecast(data);
            convertTemperature(currentTemp);
        });
}

// Function to update the weather forecast
function updateForecast(data) {
    const forecastContainer = document.querySelector(".Forecast");
    forecastContainer.innerHTML = ""; // Clear existing content

    // Loop through the next 7 days for the weather forecast
    data.days.slice(0, 7).forEach((day) => {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.innerHTML = `
            <h3>${new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
            <i class="fa-solid ${getWeatherIcon(day.conditions)}"></i>
            <p>${tempConverter(day.temp, converter.value)}°${converter.value[1]}</p>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

// Function to get the appropriate weather icon based on condition
function getWeatherIcon(condition) {
    if (condition.includes("rain")) return "fa-cloud-showers-heavy";
    if (condition.includes("cloud")) return "fa-cloud";
    return "fa-sun";
}

// Convert temperature between Celsius and Fahrenheit
function tempConverter(temp, toUnit) {
    if (toUnit === "*F") {
        return Math.round((temp * 9 / 5) + 32); // Celsius to Fahrenheit
    } else if (toUnit === "*C") {
        return Math.round((temp - 32) * 5 / 9); // Fahrenheit to Celsius
    }
    return temp; // Default: Return input if no conversion needed
}

// Convert the temperature based on selected unit
function convertTemperature(currentTemp) {
    const selectedUnit = converter.value; // Get selected unit (*C or *F)
    const convertedTemp = tempConverter(currentTemp, selectedUnit);

    temperature.innerHTML = `${convertedTemp}°${selectedUnit[1]}`;
    const convertedFeelsLike = tempConverter(parseFloat(feelsLike.textContent.match(/[\d.]+/)[0]), selectedUnit);
    feelsLike.innerHTML = `Feels like: ${convertedFeelsLike}°${selectedUnit[1]}`;
}

// Event listener to update the forecast and temperature when the converter value changes
converter.addEventListener("change", () => {
    const currentTemp = parseFloat(temperature.textContent.match(/[\d.]+/)[0]); // Get the current temperature
    convertTemperature(currentTemp);
});
