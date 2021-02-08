import React, { useState } from 'react';
import './form.scss';


function Form({ updateWeather }) {

  const [text, setText] = useState('');

  const onValueChange = (e) => {
    let currentText = e.target.value;
    setText(currentText);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const cityName = text;

    if (cityName) {
      updateWeather(cityName)
    }

    setText('');
  }

  return (
    <div className='form'>
      <form
        onSubmit={onSubmit} >
        <input
          placeholder="add location"
          type="text"
          onChange={onValueChange}
          value={text} />
      </form>
    </div>
  )
}

export default React.memo(Form, (prev, next) => (
  prev.updateWeather === next.updateWeather
    ? false
    : true
))