import {
  render,
  getElement,
  addClass,
  removeClass,
  setEventHandler,
} from './domManipulation';

import places from 'places.js';

//api.openweathermap.org/data/2.5/weather?q={city name},{state},{country code}&appid={your api key}
async function weatherByLocation(cityName, state, countryCode) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${state},${countryCode}&APPID=d5d0c9ec7a44a11236e82cf90384711a`,
    { mode: 'cors' });
  return await response.json();
}

async function weatherInfo(cityName, state='', countryCode='') {
  try {
    const info = await weatherByLocation(cityName, state, countryCode);
    if(info.cod == 200) {
      const { weather, main, name, cod } = info;
      return { name, weather, main, cod };
    } else {
      return info;
    }

  } catch (e) {
      console.error(e);
  }
  return null;
}

async function displayLocation(location) {
  console.log('here');
  const myInfo = await weatherInfo(location);
  const element = getElement(document, '.location');
  if(myInfo){
    render(element, JSON.stringify(myInfo, undefined, 2));
  } else {
    render(element, 'try again please, it was a problem');
  }
}

const placesAutocomplete = places({
  appId: 'plL4SFNNP1KW',
  apiKey: '7d4926f92add4f1f57e13f1f5280b1f1',
  container: getElement(document, '#address-input')
});

window.searchLocation = () => {
  const input = getElement(document, '#address-input').value;
  if (input === '') {
    console.log('Enter location');
  } else {
    displayLocation(input);
  }
}






