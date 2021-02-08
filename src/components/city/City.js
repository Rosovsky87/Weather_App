import React from 'react';
import { FiMenu, FiTrash2 } from "react-icons/fi";
import './city.scss';


function City({ onChange, onDeleteCity, provided, city }) {

  return (
    <div className='city'
      ref={provided.innerRef}
      {...provided.draggableProps}>
      <div className='iconWrapper' {...provided.dragHandleProps} >
        <FiMenu />
      </div>
      <div className='cityName' onClick={(cityName) => onChange(cityName)}>
        {city.cityName}
      </div>
      <div className='iconWrapper'>
        <FiTrash2 onClick={(cityId) => onDeleteCity(cityId)} />
      </div>
    </div>
  )
}

export default City
