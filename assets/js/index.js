const OW_KEY = '0b5db2db41c74e8f32c3c74657289d6e';
const OC_BASE_URL = `https://api.openweathermap.org/data/3.0/onecall`;

// location form submit handler
const handleLocationSubmit = async (e) => {
    e.preventDefault();
    
    const location = document.querySelector('#loc-input').value.trim();
    
    // get location latitude/longitude
    const coords = await getLocationCoords(location);
    
    // use latitude/longitude to retrieve 5 day weather forecast
    
    
    // toggle welcome message display
    
    
    // toggle weather forecast section
    
    
    // update current forecast
    

    // create forecast cards for each day
    
    
    // save current location to local storage
    
    
    // add current location to recent searches list in local storage
    
}

const getLocationCoords = async (location) => {
    const GEO_BASE_URL = `http://api.openweathermap.org/geo/1.0/`;

    let url = GEO_BASE_URL;
    
    // check for zip code or city/state
    if (parseInt(location)) {
        url += `zip?zip=${location},US&appid=${OW_KEY}`;

        const response = await fetchCoords(url);

        return { lat: response.lat, lon: response.lon };
    } else {
        url += `direct?q=${location.split(',')[0].trim()},${location.split(',')[1].trim().toUpperCase()},US&appid=${OW_KEY}`;

        const response = await fetchCoords(url);

        return { lat: response[0].lat, lon: response[0].lon };
    }
}

const fetchCoords = async (url) => {
    return await fetch(url, {
        method: 'GET'
    }).then(response => response.json());
}

// TODO: create function to retrieve forecast


// TODO: create function to toggle welcome message


// TODO: create function to toggle weather forecast section


// TODO: create function to update current weather section


// TODO: create function to create forecast cards for each day


// TODO: create function to save data to local storage


// TODO: create function to load data from local storage


// TODO: add on page load function calls

// form submit listener
document.querySelector('#location-form').addEventListener('submit', handleLocationSubmit);
