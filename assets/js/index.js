const OW_KEY = '0b5db2db41c74e8f32c3c74657289d6e';
// TODO: remove these after development
const TEST_COORDS = { lat: '20.35269', lon: '-77.30145', name: 'Test City' };

// location form submit handler
const handleLocationSubmit = async (e) => {
    e.preventDefault();
    
    const location = document.querySelector('#loc-input').value.trim();
    
    // get location latitude/longitude
    // const coords = await getLocationCoords(location);
    
    // get current weather
    // TODO: replace lat and lon with location from line 10 after development
    const currentWeather = await getCurrentWeather(TEST_COORDS);
    
    // use latitude/longitude to retrieve 5 day weather forecast
    const forecast = await getForecast(TEST_COORDS);
    
    // toggle off welcome message
    document.querySelector('#welcome').classList = 'display-off';
    document.querySelector('#forecast').classList = 'display-on';
    
    // update current forecast
    updateCurrentWeather(currentWeather);

    // create forecast cards for each day
    // updateForecast(forecast);
    
    // save current location to local storage
    
    
    // add current location to recent searches list in local storage
    
}

const makeAPICall = async (url) => {
    return await fetch(url, {
        method: 'GET'
    }).then(response => response.json());
}

const getLocationCoords = async (location) => {
    const GEO_BASE_URL = `http://api.openweathermap.org/geo/1.0/`;

    let url = GEO_BASE_URL;
    
    // check for zip code or city/state
    if (parseInt(location)) {
        url += `zip?zip=${location},US&appid=${OW_KEY}`;

        const response = await makeAPICall(url);

        return { lat: response.lat, lon: response.lon };
    } else {
        url += `direct?q=${location.split(',')[0].trim()},${location.split(',')[1].trim().toUpperCase()},US&appid=${OW_KEY}`;

        const response = await makeAPICall(url);

        return { lat: response[0].lat, lon: response[0].lon };
    }
}

const getCurrentWeather = async (coords) => {
    return await makeAPICall(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${OW_KEY}`);
}

const getForecast = async (coords) => {
    return await makeAPICall(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${OW_KEY}`);
}

const updateCurrentWeather = (currentWeather) => {
    const currentWeatherEl = document.querySelector('#current-weather');

    // create elements to be added to currentWeatherEl
    const locationEl = document.createElement('p');
    const iconEl = document.createElement('img');
    const tempEl = document.createElement('p');
    const windEl = document.createElement('p');
    const humidEl = document.createElement('p');

    // assign IDs/class names to elements
    locationEl.classList = 'location-name';
    iconEl.classList = 'weather-icon';
    tempEl.classList = 'temp';
    windEl.classList = 'wind';
    humidEl.classList = 'humidity';

    // add text to element innerHTML
    locationEl.innerHTML = currentWeather.name;
    iconEl.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    tempEl.innerHTML = currentWeather.main.temp;
    windEl.innerHTML = currentWeather.wind.speed;
    humidEl.innerHTML = currentWeather.main.humidity;

    // append children to currentWeatherEl
    currentWeatherEl.append(locationEl, iconEl, tempEl, windEl, humidEl);
}

// TODO: create function to create forecast cards for each day
const updateForecast = (forecast) => {
    const futureForecastEl = document.querySelector('#5-day-forecast');
}

// TODO: create function to save data to local storage


// TODO: create function to load data from local storage


// TODO: add on page load function calls

// form submit listener
document.querySelector('#location-form').addEventListener('submit', handleLocationSubmit);
