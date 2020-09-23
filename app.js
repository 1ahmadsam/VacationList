//API KEY
const API_KEY = 'a4d6ef5f73e193501bb217d15ab890d7';
let UNITS = 'metric';
let ALL_CITIES = [];
let currentUnits = () => (UNITS === 'metric' ? '°C' : '°F');
const weatherCodes = [
  'Clouds',
  'Clear',
  'Snow',
  'Rain',
  'Drizzle',
  'Thunderstorm',
];
//chart

let myChart;
let radarChart;
//event listeners
window.onload = function () {
  document.querySelector('#vacation-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    if (city === '') {
      showDialog('warning', 'Enter in a City');
    } else {
      if (ALL_CITIES.includes(city.toUpperCase())) {
        showDialog('warning', 'Already entered that city');
        return;
      }
      getWeatherData(city);
    }
  });
};

/**
 * change websites theme to dark
 */
const changeWebsiteUnits = () => {
  const checkBox = document.getElementById('check');
  if (checkBox.checked == true) {
    UNITS = 'imperial';
  } else {
    UNITS = 'metric';
  }
  //work on clearing logic
  document.getElementById('weather-table').innerHTML = '';
  let temp_cities = [...ALL_CITIES];

  myChart = null;
  radarChart = null;
  temp_cities.forEach((city) => {
    getWeatherData(city);
  });
  ALL_CITIES = [];

  const weather_unit = document.querySelector('.weather-unit');
  weather_unit.innerText = currentUnits();
};

/**
 * get weather data
 */
getWeatherData = (city) => {
  const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${UNITS}`;
  return fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === '404') {
        showDialog('warning', 'Enter a Valid City');
      } else if (data.cod === '200') {
        document.getElementById(
          'weather-metric'
        ).innerText = `Weather for next 5 days (${currentUnits()})`;
        ALL_CITIES.push(data.city.name.toUpperCase());
        showDialog(
          'success',
          `Added ${data.city.name}, ${data.city.country} to the table`
        );
        //if weather table exists, update it instead
        myChart ? updateWeatherTable(data) : createWeatherTable(data);
      }
    })
    .catch((error) => console.log(error));
};

/**
 * given list of weather types, count occurence
 */
const countWeatherType = (weatherTypes) => {
  let listOfOccurences = [];

  weatherCodes.forEach((weather) => {
    let i = 0;
    weatherTypes.forEach((type) => {
      if (type === weather) {
        i += 1;
      }
    });
    listOfOccurences.push(i);
  });
  return listOfOccurences;
};

/**
 * create table with weather data
 *
 */
createWeatherTable = (data) => {
  let weatherTableContent = '';
  weatherTableContent += `<tr>
  <td><canvas id="${data.city.name}-chart" width="400" height="300"></canvas></td></tr><tr>
  <td><canvas id="radar-chart" width="400" height="300"></canvas></td></tr>`;
  document
    .getElementById('weather-table')
    .insertAdjacentHTML('beforeend', weatherTableContent);
  const { dates, temps, feels_temps, weather } = transformWeatherData(data);

  //weather type
  const weatherListOccurence = countWeatherType(weather);

  const ctx = document.getElementById(`${data.city.name}-chart`);
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: `${data.city.name}`,
          data: temps,
          fill: false,
          borderColor: 'rgba(255,99,132,1)',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: `Average Temperature`,
      },
    },
  });
  radarChart = new Chart(document.getElementById('radar-chart'), {
    type: 'radar',
    data: {
      labels: weatherCodes,
      datasets: [
        {
          label: `${data.city.name}`,
          fill: true,
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          data: weatherListOccurence,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Weather by Type',
      },
    },
  });
};

const updateWeatherTable = (data) => {
  const { dates, temps, feels_temps, weather } = transformWeatherData(data);

  //weather type
  const weatherListOccurence = countWeatherType(weather);
  const randomBetween = (min, max) =>
    min + Math.floor(Math.random() * (max - min + 1));
  const r = randomBetween(0, 255);
  const g = randomBetween(0, 255);
  const b = randomBetween(0, 255);

  myChart.data.datasets.push({
    label: `${data.city.name}`,
    data: temps,
    fill: false,
    borderColor: `rgb(${r},${g},${b}, 1)`,
  });
  radarChart.data.datasets.push({
    label: `${data.city.name}`,
    data: weatherListOccurence,
    fill: true,

    backgroundColor: `rgb(${r},${g},${b}, 0.2)`,
    borderColor: `rgb(${r},${g},${b}, 1)`,
  });
  myChart.update();
  radarChart.update();
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
  let weather_list = [];
  let x = 0;
  for (weather of weather_daily) {
    if (x % 4 === 0) {
      feels_temps.push(weather.main.feels_like);
      daily_temps.push(weather.main.temp);
      daily_date.push(weather.dt_txt);
      weather_list.push(weather.weather[0].main);
    }
    x += 1;
  }
  return {
    dates: transformDates(daily_date),
    temps: daily_temps,
    feels_temps: feels_temps,
    weather: weather_list,
  };
};
