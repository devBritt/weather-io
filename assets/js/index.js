const OW_KEY = require('../../config');
const GEO_BASE_URL = `http://api.openweathermap.org/geo/1.0/direct`;
const OC_BASE_URL = `https://api.openweathermap.org/data/3.0/onecall`;

// location form submit handler
const handleLocationSubmit = (e) => {
    const location = document.querySelector('#loc-input').value;


    // get location latitude/longitude


    // use latitude/longitude to retrieve 5 day weather forecast


    // toggle welcome message display


    // toggle weather forecast section


    // update current forecast


    // create forecast cards for each day


    // save current location to local storage


    // add current location to recent searches list in local storage

}

// TODO: create function to retrieve location coordinates


// TODO: create fnction to retrieve forecast


// TODO: create function to toggle welcome message


// TODO: create function to toggle weather forecast section


// TODO: create function to update current weather section


// TODO: create function to create forecast cards for each day


// TODO: create function to save data to local storage


// TODO: create function to load data from local storage


// TODO: add on page load function calls

// form submit listener
document.querySelector('#location-form').addEventListener('submit', handleLocationSubmit);
