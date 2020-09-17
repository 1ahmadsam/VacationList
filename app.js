//API KEY
const API_KEY = 'a4d6ef5f73e193501bb217d15ab890d7';
let UNITS = 'metric';
//event listeners
window.onload = function () {
  document.querySelector('#vacation-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    if (city === '') {
      showDialog('warning', 'Enter in a City');
    } else {
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
  const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${UNITS}`;
  return fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.cod === '404') {
        showDialog('warning', 'Enter a Valid City');
      } else if (data.cod === '200') {
        showDialog('success', `Added '${city.toUpperCase()}' to the table`);
        createWeatherTable(data);
      }
    })
    .catch((error) => console.log(error));
};

/**
 * create table with weather data
 *
 */
createWeatherTable = (data) => {
  let weatherTableContent = '';
  weatherTableContent += `<tr>
  <td>${data.city.name}</td>
  <td><canvas id="myChart" width="400" height="400"></canvas></td></tr>`;
  document.getElementById('weather-table').innerHTML += weatherTableContent;
  const { dates, temps } = transformWeatherData(data);
  console.log(dates, temps);
  const ctx = document.getElementById('myChart');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: temps,
      datasets: [
        {
          label: '# of Votes',
          data: dates,
        },
      ],
    },
  });

  console.log('hello');
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
  document.getElementById('result').innerHTML = dialog;
};

/**
 * transforms the api data into
 */
transformWeatherData = (data) => {
  const weather_daily = data.list;
  let daily_temps = [];
  let daily_date = [];
  for (weather of weather_daily) {
    daily_temps.push(weather.main.temp);
    daily_date.push(weather.dt_txt);
  }
  return { dates: daily_date, temps: daily_temps };
};
