export default class WeatherData {
	getData = async (cityName) => {
		const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=1fb8f1d720988873605cf76fe9165755`);

		if (!data.ok) {
			throw new Error(`Could not fetch, received ${data.status}`);
		}

		return await data.json()
	}

	getWeather = async (cityName) => {
		const res = await this.getData(cityName);
		return await this._transformWeather(res);
	}

	degToCompass = (num) => {
		while (num < 0) num += 360;
		while (num >= 360) num -= 360;
		const val = Math.round((num - 11.25) / 22.5);
		const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE",
			"SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
		return arr[Math.abs(val)];
	}

	weatherIcon = (data) => {
		const res = (`http://openweathermap.org/img/wn/${data}@2x.png`);
		return res;
	}

	_transformWeather = (res) => {
		return {
			id: res.id,
			cityName: res.name,
			country: res.sys.country,
			temp: Math.round(res.main.temp),
			feelsLike: res.main.feels_like,
			maimWeather: res.weather[0].main,
			desWeather: res.weather[0].description,
			weatherIcon: this.weatherIcon(res.weather[0].icon),
			windSpeed: res.wind.speed,
			windDer: this.degToCompass(res.wind.deg),
		}
	}
}
