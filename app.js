//API KEY
const API_KEY = '415095d6d53abdc56ed23ecd58706b71';
//event listeners
window.onload = function () {
  document.querySelector('#vacation-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    if (city === '') {
      document.getElementById('result').innerHTML = showDialog(
        'warning',
        'enter in a city'
      );
    } else {
      document.getElementById('result').innerHTML = showDialog(
        'success',
        'nice job'
      );
      getWeatherData(city);
    }
    console.log('hello:', city);
  });
};

/**
 * change websites theme to dark
 */
changeWebsiteTheme = () => {
  const checkBox = document.getElementById('check');
  if (checkBox.checked == true) {
    console.log('checked');
  } else {
    console.log('not checked');
  }
};

/**
 * get weather data
 */
getWeatherData = (city) => {
  const URL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${API_KEY}`;
  return fetch(URL).then((res) => {
    console.log(res.json);
  });
};

/**
 *  display success or error message depending on inpout values
 */
showDialog = (dialogType, text) => {
  let dialog;
  switch (dialogType) {
    case 'warning':
      dialog = "<div class='alert alert-warning'>";
      break;
    case 'success':
      dialog = "<div class='alert alert-success'>";
      break;
  }
  dialog += text;
  dialog += '</div>';
  return dialog;
};
