import dom from './domManipulation';

import places from 'places.js';

import './assets/css/style.css';

/* ************************* Asynchronous Functions Giphy API  ************************* */
async function giphyByWords(words) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=4aHxyq90HBQnkmqTtdbAsdwPn2o7POpQ&s=${words}`,
    { mode: 'cors' });
  return await response.json();
}

async function giphyURL(words) {
  try {
    const info = await giphyByWords(words);
    if(
      info.meta.status == 200 && 
      info.data.images
    ) {
      return info.data.images.downsized_large.url;
    }
    return null;
  } catch {
      return null;
  }
}

/* ************************* Asynchronous Functions Weather API  ************************* */
//api.openweathermap.org/data/2.5/weather?q={city name},{state},{country code}&appid={your api key}
async function weatherByLocation(cityName, state, countryCode) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${state},${countryCode}&APPID=d5d0c9ec7a44a11236e82cf90384711a&units=imperial`,
    { mode: 'cors' });
  return await response.json();
}

async function weatherInfo(cityName, state='', countryCode='') {
  try {
    const info = await weatherByLocation(cityName, state, countryCode);
    if(info.cod == 200) {
      const { weather, main, name, cod } = info;
      return { name, weather, main, cod };
    }
    return info;

  } catch {
      return null;
  }
}

/* ************************* Asynchronous Display ************************* */
window.imgLoaded = () => {
  dom.getElement(document, '.loader').style.display = 'none';
  dom.getElement(document, '.info-container').style.display = 'block';
}

const fahrenheitToCelsius = (value) => ((Math.round((value - 32) * 5.0/9.0)*100)/100).toString();
const celsiusToFahrenheit = (value) => ((Math.round((value * 9/5) + 32)*100)/100).toString();
window.changeDegrees = (checkbox) => {
  let callback;
  let symbol;
  if(checkbox.checked) {
    callback = fahrenheitToCelsius;
    symbol = ' °C';
  } else {
    callback = celsiusToFahrenheit;
    symbol = ' °F';
  }

  const degrees = dom.getElements(document, '.f-c');
  const degreesSymbols = dom.getElements(document, '.degrees');
  degrees.forEach((degree) => {
    let value = parseFloat(degree.textContent);
    degree.textContent = callback(value);
  });
  degreesSymbols.forEach((degreesSymbol) => {
    degreesSymbol.textContent = symbol;
  });
}

async function displayLocation(location) {
  const infoContainer = dom.getElement(document, '.info-container');
  infoContainer.style.display = 'none';
  const loader = dom.getElement(document, '.loader');
  loader.style.display = 'block';

  const info = await weatherInfo(location);
  if(info && info.cod === 200){
    const giphyUrl = await giphyURL(info.weather[0].description);
    if(giphyUrl){
      dom.getElement(document, '.giphy').src = giphyUrl;
      dom.render(infoContainer, `
        <div class="main-info d-flex">
          <div class="location">${info.name}</div>
          <div class="temperature text-center"><span class="f-c">${
            parseInt(info.main.temp, 10)
          }</span><span class="degrees"> °F</span></div>
        </div>
        <div class="complementary-info d-flex">
          <div class="remainder-info">
            <ul>
              <li style="text-transform: uppercase;">${info.weather[0].description}</li>
              <li>Feels like: <span class="f-c">${
                parseInt(info.main.feels_like, 10)
              }</span><span class="degrees"> °F</span></li>
              <li>Presure: ${info.main.pressure} hPa</li>
              <li>Humidity: ${info.main.humidity} %</li>
            </ul>
          </div>
          <div class="toggle-temperature text-center">
            <label class="switch">
              <input type="checkbox" onclick="changeDegrees(this)">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      `);
    } 
  } else {
    dom.render(infoContainer, `
      <div style="width:100; text-transform:uppercase; text-align:center; margin: 30px;">
        ${info.message}
      </div>
    `);
    infoContainer.style.display = 'block';
    loader.style.display = 'none';
  }
}

/* ************************* Algolia API config ************************* */
const placesAutocomplete = places({
  appId: 'plL4SFNNP1KW',
  apiKey: '7d4926f92add4f1f57e13f1f5280b1f1',
  container: dom.getElement(document, '#address-input')
});

/* ************************* Search Handler ************************* */
window.searchLocation = (event) => {
  if (event.keyCode === 13) {
    const input = event.target.value;
    if (input === '') {
      console.log('Enter location');
    } else {
      displayLocation(input);
    }
  }
}






