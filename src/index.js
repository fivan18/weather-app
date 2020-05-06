import dom from './domManipulation';
import layouts from './layouts';


import './assets/css/style.css';

/* ************************* Asynchronous Functions Giphy API  ************************* */
async function giphyByWords(words) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=4aHxyq90HBQnkmqTtdbAsdwPn2o7POpQ&s=${words}`,
    { mode: 'cors' },
  );
  const content = await response.json();
  return content;
}

async function giphyURL(words) {
  try {
    const info = await giphyByWords(words);
    if (
      info.meta.status === 200
      && info.data.images
    ) {
      return info.data.images.downsized_large.url;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/* ************************* Asynchronous Functions Weather API  ************************* */
// api.openweathermap.org/data/2.5/weather?q={city name},{state},{country code}&appid={your api key}
async function weatherByLocation(cityName, state, countryCode) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${state},${countryCode}&APPID=d5d0c9ec7a44a11236e82cf90384711a&units=imperial`,
    { mode: 'cors' },
  );
  const content = await response.json();
  return content;
}

async function weatherInfo(cityName, state = '', countryCode = '') {
  try {
    const info = await weatherByLocation(cityName, state, countryCode);
    if (info.cod === 200) {
      const {
        weather, main, name, cod,
      } = info;
      return {
        name, weather, main, cod,
      };
    }
    return info;
  } catch (e) {
    return null;
  }
}
/* ************************* Asynchronous Display ************************* */
async function displayLocation(location) {
  const infoContainer = dom.getElement(document, '.info-container');
  infoContainer.style.display = 'none';
  const loader = dom.getElement(document, '.loader');
  loader.style.display = 'block';

  const info = await weatherInfo(location);
  if (info && info.cod === 200) {
    const giphyUrl = await giphyURL(info.weather[0].description);
    if (giphyUrl) {
      dom.getElement(document, '.giphy').src = giphyUrl;
      dom.render(infoContainer, layouts.mainContent(info));
    }
  } else {
    dom.render(infoContainer, layouts.message(info.message));
    infoContainer.style.display = 'block';
    loader.style.display = 'none';
  }
}

/* ************************* Helper Functions ************************* */
const fahrenheitToCelsius = (value) => ((Math.round((value - 32) * (5.0 / 9.0)) * 100) / 100)
  .toString();
const celsiusToFahrenheit = (value) => ((Math.round((value * (9.0 / 5.0)) + 32) * 100) / 100)
  .toString();

/* ************************* Handlers ************************* */
window.imgLoaded = () => {
  dom.getElement(document, '.loader').style.display = 'none';
  dom.getElement(document, '.info-container').style.display = 'block';
};

window.changeDegrees = (checkbox) => {
  let callback;
  let symbol;
  if (checkbox.checked) {
    callback = fahrenheitToCelsius;
    symbol = ' °C';
  } else {
    callback = celsiusToFahrenheit;
    symbol = ' °F';
  }

  const degrees = dom.getElements(document, '.f-c');
  const degreesSymbols = dom.getElements(document, '.degrees');
  degrees.forEach((degree) => {
    const value = parseFloat(degree.textContent);
    degree.textContent = callback(value);
  });
  degreesSymbols.forEach((degreesSymbol) => {
    degreesSymbol.textContent = symbol;
  });
};

window.searchLocation = (event) => {
  if (event.keyCode === 13) {
    const input = event.target.value;
    if (input === '') {
      dom.render(dom.getElement(document, '.info-container'), layouts.message('Enter location'));
    } else {
      displayLocation(input);
    }
  }
};

/* ************************* Algolia API config ************************* */
/* eslint import/no-unresolved: [2, { ignore: ['^places.js$'] }] */
const places = require('places.js');

const placesAutocomplete = places({ // eslint-disable-line no-unused-vars
  appId: 'plL4SFNNP1KW',
  apiKey: '7d4926f92add4f1f57e13f1f5280b1f1',
  container: dom.getElement(document, '#address-input'),
});
