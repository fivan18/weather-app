import {
  render,
  getElement,
  addClass,
  removeClass,
  setEventHandler,
} from './domManipulation';

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

async function run(location) {
  const myInfo = await weatherInfo(location);
  const element = getElement(document, '#content pre');
  if(myInfo){
    render(element, JSON.stringify(myInfo, undefined, 2));
  } else {
    render(element, 'try again please, it was a problem');
  }
}
 run('mexico');



