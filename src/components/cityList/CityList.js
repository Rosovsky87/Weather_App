import React from 'react';
import City from '../city/City';
import Form from '../form/Form';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './cityList.scss';


const CityList = ({ citiesOrder, cities, onDeleteCity, updateWeather }) => {

  const onChange = (e) => {
    const cityName = e.target.innerHTML;
    updateWeather(cityName)
  }

  return (
    <>
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div className='list'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {(citiesOrder).map((cityId, index) => {
              const city = cities[cityId];
              return (
                <Draggable
                  key={cityId}
                  draggableId={`${cityId}-drragable-id`}
                  index={index}
                >
                  {(provided) => (
                    <City
                      onChange={(cityName) => onChange(cityName)}
                      onDeleteCity={() => onDeleteCity(cityId)}
                      provided={provided}
                      city={city}
                      cityId={cityId}
                    />
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Form
        updateWeather={(cityName) => updateWeather(cityName)}
      />
    </>
  )
}

export default CityList;
