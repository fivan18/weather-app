const layouts = (() => {
  function mainContent(info) {
    return `
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
    `;
  }

  function message(msg) {
    return `
      <div style="width:100; text-transform:uppercase; text-align:center; margin: 30px;">
        ${msg}
      </div>
    `;
  }

  return {
    mainContent,
    message
  };
})();


export default layouts;