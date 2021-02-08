import React from 'react';
import './currentCity.scss';


function CurrentCity({ city }) {

  const { temp, feelsLike, maimWeather, desWeather, windSpeed, windDer, weatherIcon } = city;

  return (
    <>
      <div className='body'>
        <img src={weatherIcon} alt="изображение"
          width="150" />
        <div>{temp}º C</div>
      </div>
      <div className='bottom'>
        <div>wind: {windSpeed}m/sec. {windDer}</div>
        <div>feels like: {feelsLike}º C</div>
        <div>{maimWeather}: {desWeather}</div>
      </div>
    </>
  )
}

export default CurrentCity