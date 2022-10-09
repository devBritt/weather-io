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
    const currentWeatherEl = document.querySelector('#current-weather');
    currentWeatherEl.innerHTML = '';
    updateCurrentWeather(currentWeather, currentWeatherEl);

    // create forecast cards for each day
    // API return 8 timestamps per day, increment by 8 to use only one
    const futureForecastEl = document.querySelector('#future-forecast');
    futureForecastEl.innerHTML = '';
    for (let i = 0; i < forecast.list.length; i+=8) {
        updateForecast(forecast.list[i], futureForecastEl);
    }
    
    // add current location to recent searches list in local storage
    saveToLocal({ lat: currentWeather.coord.lat, lon: currentWeather.coord.lon, name: currentWeather.name });
    
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

const updateCurrentWeather = (currentWeather, currentWeatherEl) => {
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
    tempEl.innerHTML = `${currentWeather.main.temp}°F`;
    windEl.innerHTML = `${currentWeather.wind.speed} mph winds`;
    humidEl.innerHTML = `${currentWeather.main.humidity}% humidity`;

    // append children to currentWeatherEl
    currentWeatherEl.append(locationEl, iconEl, tempEl, windEl, humidEl);
}

const updateForecast = (forecast, futureForecastEl) => {
    // create needed elements for forecast card
    const cardEl = document.createElement('div');
    const cardContentEl = document.createElement('div');
    const dateEl = document.createElement('p');
    const iconEl = document.createElement('img');
    const tempEl = document.createElement('p');
    const windEl = document.createElement('p');
    const humidEl = document.createElement('p');

    // assign IDs/class names to card elements
    cardEl.classList = 'ui card';
    cardContentEl.classList = 'content';
    dateEl.classList = 'header';
    iconEl.classList = 'weather-icon';
    tempEl.classList = 'summary temp';
    windEl.classList = 'summary wind';
    humidEl.classList = 'summary humidity';

    // add content to elements
    dateEl.innerHTML = formatDate(forecast.dt);
    iconEl.src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
    tempEl.innerHTML = `${forecast.main.temp}°F`;
    windEl.innerHTML = `${forecast.wind.speed} mph winds`;
    humidEl.innerHTML = `${forecast.main.humidity}% humidity`;

    // append children to cardContentEl
    cardContentEl.append(dateEl, iconEl, tempEl, windEl, humidEl);

    // append child to cardEl
    cardEl.append(cardContentEl);

    // append child to futureForecastEl
    futureForecastEl.append(cardEl);
}

const formatDate = (dt) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dtObj = new Date(dt*1000);
    let dtString;

    dtString = days[dtObj.getDay()];
    dtString += ' ' + (dtObj.getMonth() + 1);
    dtString += '/' + dtObj.getDate();

    return dtString;
}

// TODO: create function to save data to local storage
const saveToLocal = (item) => {
    // get list of recent searches from storage
    const recentSearches = loadFromLocal();

    // remove oldest search if 10 or more searches have been saved
    if (recentSearches && recentSearches.length >= 10) {
        recentSearches.shift();
    }

    // add newest search to list
    recentSearches.push(item);

    localStorage.setItem('weatherIO', JSON.stringify(recentSearches));
}

// TODO: create function to load data from local storage
const loadFromLocal = () => {
    let recentSearches = JSON.parse(localStorage.getItem('weatherIO'));
    console.log(recentSearches);

    if (!recentSearches) recentSearches = [];

    return recentSearches;
}

// TODO: add on page load function calls

// form submit listener
document.querySelector('#location-form').addEventListener('submit', handleLocationSubmit);
