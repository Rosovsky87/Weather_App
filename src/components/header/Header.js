import React from 'react';
import SwitchBtn from '../switchBtn/switchBtn.js';
import './header.scss';


function Header({ onSwitch, city, showSettingsButton }) {

  const { cityName, country } = city || {}

  return (
    <div className='settings_btn'>
      {
        city
          ? <h2>{cityName} ({country})</h2>
          : <h2>settings</h2>
      }
      {
        showSettingsButton && <SwitchBtn onSwitch={onSwitch} isCity={Boolean(city)} />
      }
    </div>
  )
}

export default React.memo(Header, (prev, next) => (
  prev.showSettingsButton !== next.showSettingsButton || prev.city !== next.city
    ? false
    : true
))