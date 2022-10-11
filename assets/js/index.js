const OW_KEY = '0b5db2db41c74e8f32c3c74657289d6e';
const STATES = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
]

// location form submit handler
const handleLocationSubmit = async (e) => {
    e.preventDefault();

    // hide welcome section
    toggleElementDisplay(document.querySelector('#welcome'), false);
    
    // show forecast section
    toggleElementDisplay(document.querySelector('#forecast'), true);
    
    const location = document.querySelector('#loc-input').value.trim();

    switch (validateLocation(location)) {
        // an invalid city, state or zip code entry
        case false: {
            alert(`${location} isn't a valid zip code or city and state combination. Check for typos or mispellings.`)
            break;
        }
        // a valid city, state or zip code entry
        case true: {
            // get location latitude/longitude
            const coords = await getLocationCoords(location);
            
            // get current weather
            const currentWeather = await getCurrentWeather(coords);
            
            // use latitude/longitude to retrieve 5 day weather forecast
            const forecast = await getForecast(coords);
            
            // update current forecast
            updateCurrentWeather(currentWeather);

            // create forecast cards for each day
            updateForecast(forecast);
            
            // add current location to recent searches list in local storage
            const savedSearches = saveToLocal({ lat: currentWeather.coord.lat, lon: currentWeather.coord.lon, name: currentWeather.name });
            
            // add current location to recent searches list
            updateRecentSearches(savedSearches);
            
            break;
        }
        default: {
            alert('Oops, sorry about that! Something went wrong on our end.');
            break;
        }
    }
}

const handleSearchesClick = async (e) => {
    e.preventDefault();

    // toggle city buttons' state
    const buttons = document.querySelectorAll('.city-button');
    toggleBtnState(e.target, buttons);
    
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

const toggleBtnState = (target, buttons) => {
    // make sure all buttons are active except target
    buttons.forEach((button) => {
        const buttonClasses = button.className.split(' ');
        if(buttonClasses.indexOf("active") > -1) {
            buttonClasses.pop();
            button.classList = buttonClasses.join(' ');
        } else if (button === target) {
            button.classList = buttonClasses.join(' ') + ' active';
        }
    })
}

const validateLocation = (input) => {
    // check if input is zip code or city/state
    if (parseInt(input)) {
        if (input.match(/^\d{5}$/)) return true
        else return false;
    } else {
        // split on comma
        let formattedInput = formatLocationString(input);
        console.log(formattedInput);

        // check length of state (second in array)
        if (formattedInput[1].length === 2) return validateStateCode(formattedInput[1])
        // search STATES.name for a match
        else return validateState(formattedInput[1]);
    }
}

const validateStateCode = (stateCode) => {
    // search STATES.abbreviations for a match
    if (STATES.find(state => state.abbreviation.toUpperCase().trim() === stateCode.toUpperCase().trim())) return true
    else return false;
}

const validateState = (stateName) => {
    // search STATES.name for a match
    if (STATES.find(state => state.name.toLowerCase().trim() === stateName.toLowerCase().trim())) return true
    else return false;
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
        url += `zip?zip=${location.trim()},US&appid=${OW_KEY}`;

        const response = await makeAPICall(url);

        return { lat: response.lat, lon: response.lon };
    } else {
        const formattedLocation = formatLocationString(location);
        url += `direct?q=${formattedLocation[0].trim()},${formattedLocation[1].trim()},US&appid=${OW_KEY}`;

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
        const columnEl = document.createElement('div');
        const cardEl = document.createElement('div');
        const cardContentEl = document.createElement('div');
        const dateEl = document.createElement('p');
        const iconEl = document.createElement('img');
        const tempEl = document.createElement('p');
        const windEl = document.createElement('p');
        const humidEl = document.createElement('p');
    
        // assign IDs/class names to card elements
        columnEl.classList = 'column';
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

        // append child to columnEl
        columnEl.append(cardEl);
    
        // append child to futureForecastEl
        futureForecastEl.append(columnEl);
    })
}

const updateRecentSearches = (savedSearches) => {
    const recentSearchesEl = document.querySelector('#recent-searches');
    recentSearchesEl.innerHTML = '';
    
    savedSearches.forEach((search, index) => {
        // create needed elements to add to recent search list
        const containerEl = document.createElement('article');
        const searchCityEl = document.createElement('button');
    
        // assign IDs/class names to elements
        containerEl.classList = 'item';
        searchCityEl.classList = 'fluid ui toggle button city-button';
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

const formatLocationString = (input) => {
    // split on comma
    let inputArr = input.trim().split(',');

    // check if split was successful
    if (inputArr.length !== 2) {
        console.log(inputArr);
        inputArr = input.split(' ');
        console.log(inputArr);
    }

    return inputArr;
}

const toggleElementDisplay = (element, bool) => {
    // if bool is true, element should be visible
    // if bool is false, element should be hidden
    bool ? element.classList = '' : element.classList = 'hidden';
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
