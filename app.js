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
      document.getElementById(
        'weather-metric'
      ).innerText = `Weather for 5 days (${
        UNITS === 'metric' ? 'degrees' : 'fahrenheit'
      })`;
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
  <td><canvas id="${data.city.name}-chart" width="400" height="300"></canvas></td></tr>`;
  document
    .getElementById('weather-table')
    .insertAdjacentHTML('beforeend', weatherTableContent);
  const { dates, temps, feels_temps } = transformWeatherData(data);
  console.log(dates, temps);
  const ctx = document.getElementById(`${data.city.name}-chart`);
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'average temperature',
          data: temps,
          fill: false,
          borderColor: '#FEB100',
        },
        {
          label: 'feels like',
          data: feels_temps,
          fill: false,
          borderColor: '#5cadfa',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: `${data.city.name}`,
      },
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
 * transform dates into human readable
 */
transformDates = (dates) => {
  return dates.map((date) => dayjs(date).format('MMM-DD hhA'));
};

/**
 * transforms the api data into
 */
transformWeatherData = (data) => {
  const weather_daily = data.list;
  let daily_temps = [];
  let feels_temps = [];
  let daily_date = [];
  let x = 0;
  for (weather of weather_daily) {
    if (x % 4 === 0) {
      feels_temps.push(weather.main.feels_like);
      daily_temps.push(weather.main.temp);
      daily_date.push(weather.dt_txt);
    }
    x += 1;
  }
  return {
    dates: transformDates(daily_date),
    temps: daily_temps,
    feels_temps: feels_temps,
  };
};
