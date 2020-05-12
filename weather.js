var input = document.querySelector('#input-text');
var cityTitle = document.querySelector('#city-name');
var button = document.querySelector('#submit-button');
var forecastWrapper = document.querySelector('#forecast-wrapper');

function createForecastCard({ temp, clouds, weather, dt }, index) {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('card', 'is-visible');

    const date = new Date(Date.now() + index * 24 * 60 * 60 * 1000);
    const { day: dailyTemperature } = temp;
    const { icon, description } = weather[0];

    forecastCard.innerHTML = `
        <img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <div class="weather-info-wrapper">
            <span class="temp">${dailyTemperature} °C</span>
            <span class="desc">${description}</span>
        </div>
        <p class="date">${date.toLocaleDateString()}</p>
    `;

    return forecastCard;
}

function getOneWeekForecast(lon, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=7a964a0acd57adfa7a660a56910c59cf&units=metric`)
        .then(data => data.json())
        .then(forecastData => {
            const { daily } = forecastData;
            forecastWrapper.innerHTML = '';

            daily.forEach((dailyForecast, index) => {
                console.log(dailyForecast);
                forecastWrapper.appendChild(createForecastCard(dailyForecast, index));
            });
        })
        .catch(err => console.error(err));
}

function fetchWeatherInfo(cityName) {
    if (!cityName) {
        alert('Please enter the city to get weather forecast for');
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=7a964a0acd57adfa7a660a56910c59cf&units=metric`)
        .then(response => response.json())
        .then(data => {
            const { coord: { lon, lat }, name } = data;
            input.value = '';
            cityTitle.innerHTML = name;

            getOneWeekForecast(lon, lat);
        })
        .catch((err) => {
            console.log(err);
            alert('Something went wrong! Please, check your spelling and make sure that city name is correct')
        });
}

button.addEventListener('click', () => {
    fetchWeatherInfo(input.value);
});
