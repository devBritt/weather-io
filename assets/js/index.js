const OW_KEY = '0b5db2db41c74e8f32c3c74657289d6e';
// TODO: remove these after development
const TEST_COORDS = { lat: '20.35269', lon: '-77.30145', name: 'Test City' };

// location form submit handler
const handleLocationSubmit = async (e) => {
    e.preventDefault();

    // hide welcome section
    toggleElementDisplay(document.querySelector('#welcome'), false);
    
    // show forecast section
    toggleElementDisplay(document.querySelector('#forecast'), true);
    
    const location = document.querySelector('#loc-input').value.trim();
    
    // get location latitude/longitude
    // const coords = await getLocationCoords(location);
    
    // get current weather
    // TODO: replace lat and lon with location from line 10 after development
    const currentWeather = await getCurrentWeather(TEST_COORDS);
    
    // use latitude/longitude to retrieve 5 day weather forecast
    const forecast = await getForecast(TEST_COORDS);
    
    // update current forecast
    updateCurrentWeather(currentWeather);

    // create forecast cards for each day
    updateForecast(forecast);
    
    // add current location to recent searches list in local storage
    const savedSearches = saveToLocal({ lat: currentWeather.coord.lat, lon: currentWeather.coord.lon, name: currentWeather.name });
    
    // add current location to recent searches list
    updateRecentSearches(savedSearches);
}

const handleSearchesClick = async (e) => {
    e.preventDefault();

    // get target index (id)
    const targetIndex = e.target.id;

    // use target index to get coords from local storage
    const loadedSearch = loadFromLocal()[targetIndex];

    // use coords to get current weather and forecast
    const currentWeather = await getCurrentWeather(loadedSearch);
    const forecast = await getForecast(loadedSearch);

    // update DOM with current weather/forecast results
    updateCurrentWeather(currentWeather);
    updateForecast(forecast);
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
    currentWeatherEl.innerHTML = '';
    
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

const updateForecast = (forecast) => {
    const futureForecastEl = document.querySelector('#future-forecast');
    futureForecastEl.innerHTML = '';
    const forecastList = [];

    for (let i = 0; i < forecast.list.length; i+=8) {
        forecastList.push(forecast.list[i]);
    }

    forecastList.forEach(item => {
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
        dateEl.innerHTML = formatDate(item.dt);
        iconEl.src = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        tempEl.innerHTML = `${item.main.temp}°F`;
        windEl.innerHTML = `${item.wind.speed} mph winds`;
        humidEl.innerHTML = `${item.main.humidity}% humidity`;
    
        // append children to cardContentEl
        cardContentEl.append(dateEl, iconEl, tempEl, windEl, humidEl);
    
        // append child to cardEl
        cardEl.append(cardContentEl);
    
        // append child to futureForecastEl
        futureForecastEl.append(cardEl);
    })
}

const updateRecentSearches = (savedSearches) => {
    const recentSearchesEl = document.querySelector('#recent-searches');
    recentSearchesEl.innerHTML = '';
    
    savedSearches.forEach((search, index) => {
        // create needed elements to add to recent search list
        const containerEl = document.createElement('article');
        const searchCityEl = document.createElement('p');
    
        // assign IDs/class names to elements
        containerEl.classList = 'recent-search-container';
        searchCityEl.classList = 'recent-search';
        searchCityEl.id = index;
    
        // add city name to searchCityEl
        searchCityEl.innerHTML = search.name;
    
        containerEl.append(searchCityEl);
        
        // insert newest search as the first child of recentSearchesEl
        recentSearchesEl.hasChildNodes() ?
            recentSearchesEl.insertBefore(containerEl, recentSearchesEl.firstChild)
            : recentSearchesEl.append(containerEl);
    });
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

const toggleElementDisplay = (element, bool) => {
    // if bool is true, element should be visible
    // if bool is false, element should be hidden
    bool ? element.classList = 'visible' : element.classList = 'hidden';
}

const saveToLocal = (item) => {
    // get list of recent searches from storage
    let recentSearches = loadFromLocal();

    // remove oldest search if 10 or more searches have been saved
    if (recentSearches && recentSearches.length >= 10) {
        recentSearches.shift();
    }

    // add newest search to list
    recentSearches.push(item);

    localStorage.setItem('weatherIO', JSON.stringify(recentSearches));
    return recentSearches;
}

const loadFromLocal = () => {
    let recentSearches = JSON.parse(localStorage.getItem('weatherIO'));

    if (!recentSearches) recentSearches = [];

    return recentSearches;
}

const onPageLoad = async () => {
    const loadedSearches = loadFromLocal();

    // check if loadedSearches is empty
    if (loadedSearches.length < 1) {
        // display welcome section
        toggleElementDisplay(document.querySelector('#welcome'), true);
        // hide forecast section
        toggleElementDisplay(document.querySelector('#forecast'), false);
    } else {
        // display forecast section
        toggleElementDisplay(document.querySelector('#forecast'), true);
        // hide welcome section
        toggleElementDisplay(document.querySelector('#welcome'), false);

        // display recent searches list
        updateRecentSearches(loadedSearches);
    
        // use most recent search to get current weather and forecast
        const currentWeather = await getCurrentWeather(loadedSearches[9]);
        const forecast = await getForecast(loadedSearches[9]);

        // update current weather/forecast sections
        updateCurrentWeather(currentWeather);
        updateForecast(forecast);
    }
}

onPageLoad();

// form submit listener
document.querySelector('#location-form').addEventListener('submit', handleLocationSubmit);

// recent searches click listener
document.querySelector('#recent-searches').addEventListener('click', handleSearchesClick);
