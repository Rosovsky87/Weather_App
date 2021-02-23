
const getData = async (cityName) => {

  const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&APPID=1fb8f1d720988873605cf76fe9165755`);

  if (!data.ok) {
    alert(`Такого города нет. Введите верное название города`);
    return
  }

  return data.json();
}

const degToCompass = (num) => {
  while (num < 0) num += 360;
  while (num >= 360) num -= 360;
  const val = Math.round((num - 11.25) / 22.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE",
    "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[Math.abs(val)];
}

const weatherIcon = (data) => {
  const res = (`http://openweathermap.org/img/wn/${data}@2x.png`);
  return res;
}

const transformWeather = (res) => {

  return {
    id: res.id,
    cityName: res.name,
    country: res.sys.country,
    temp: Math.round(res.main.temp),
    feelsLike: res.main.feels_like,
    maimWeather: res.weather[0].main,
    desWeather: res.weather[0].description,
    weatherIcon: weatherIcon(res.weather[0].icon),
    windSpeed: res.wind.speed,
    windDer: degToCompass(res.wind.deg),
  }
}

export const getWeather = async (cityName) => {
  const res = await getData(cityName);
  if (!res) return
  return transformWeather(res);
}