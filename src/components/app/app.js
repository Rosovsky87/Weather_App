import React, { PureComponent } from 'react';
import Header from '../header/Header';
import CityList from '../cityList/CityList';
import CurrentCity from '../currentCity/CurrentCity';
import * as ls from '../../ls';
import { getWeather } from '../../data/data';
import { DragDropContext } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import './app.scss';


// Добрый день.
// В данном тестовом задании ВЫ можете встретить комментарии в верхней части файла.
// В реальной работе комментарии оставляю, только если того требует проект и/или руководство, по этому заране предупреждаю,что комментарии могут показаться Вам излишними.
// Данных используемых в работе немного, по этому я решение не использовать REDUX, а все данные разместил в компоненте App.

// В state данные по городам я разбил на две части это:
//1) cities - объект, в котором непосредственно и записаны все показатели по погоде и по самому городу;
//2) citiesOrder - массив, каждый элемент которого указывает на соответсвующий город из "cities"
// Таким разделением мы фактически отделили сами данные от конфигурации их расположения в массиве, что на боьших проектах при больших объёмах, значительно ускоряет работу программы, так как манипулировать массивом с числами куда проще и производительнее чем с массивом наполненным тяжеловесными и большими объектами.

// Так же ниже вы можете обратить внимание, на то, что при удалении города из списка городов("cities") в самом прилжении, само свойство в объекте "cities" не удаляется, а вместо этого ключу данного свойства присваивается значение "null".
// Это так же сделанно для ускорения работы приложения. Конечно на таком небольшом приложении разницы видно не будет, но на больших приложениях производительность выше.
// По поводу информации на тему того, что присвоение "null" работает быстрее чем "delete" я подчерпнул с предыдущего места работы. Мне на эту тему давали прочесть несколько статей.
// К сожелению я те статьи сейчас найти не могу, но есть обсуждение этого момента - https://news.ycombinator.com/item?id=4744314


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const parserJSON = (value) => JSON.parse(value);
const serializerJSON = (value) => JSON.stringify(value);
const WEATHER_KEY = 'WEATHER_KEY';


class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeCityId: null,
      cities: {},
      citiesOrder: [],
      seeCityList: true,
      ...ls.get(WEATHER_KEY, parserJSON),
    }
  }


  componentDidMount() {
    if (this.state.cities) {
      this.updateWeather();
    }
  }


  componentDidUpdate(prevProps, prevState) {
    const { cities, seeCityList, activeCityId, citiesOrder } = this.state;
    ls.set(WEATHER_KEY, { cities, seeCityList, activeCityId, citiesOrder }, serializerJSON);

    if (citiesOrder[0] !== prevState.citiesOrder[0]) {
      citiesOrder.length > 0
        ? this.updateWeather(this.state.cities[citiesOrder[0]].cityName)
        : this.updateWeather('')
    }
  }

  addCity(citiesList) {
    this.setState(({ citiesOrder, cities }) => {
      const newActiveCityId = citiesList.id;
      const newCitiesOrder = [...new Set([newActiveCityId, ...citiesOrder])];

      const newCities = { ...cities, [newActiveCityId]: citiesList };

      if (newCitiesOrder.length > 5) {
        const idToDelete = newCitiesOrder.pop();
        newCities[idToDelete] = null;
      }
      return {
        activeCityId: newActiveCityId,
        cities: newCities,
        citiesOrder: newCitiesOrder,
      }
    })
  }


  updateWeather = async (cityName) => {
    if (!cityName) return;
    const place = await getWeather(cityName)
    if (!place) return
    this.addCity(place);
  }


  toggleCityList = () => {
    this.setState({ seeCityList: !this.state.seeCityList })
  }


  onDragEnd = (result) => {
    if (!result.destination) return;

    const citiesOrder = reorder(
      this.state.citiesOrder,
      result.source.index,
      result.destination.index
    );

    this.setState({ citiesOrder });
  }


  deleteCity = (cityId) => {
    this.setState(({ citiesOrder, cities }) => {

      return {
        citiesOrder: citiesOrder.filter((id) => id !== cityId),
        cities: { ...cities, [cityId]: null },
      };
    });
  }

  render() {
    const { activeCityId, citiesOrder, cities, seeCityList } = this.state;

    return (
      <DragDropContext onDragEnd={this.onDragEnd} >
        <div className='container' >
          <Header
            onSwitch={this.toggleCityList}
            city={seeCityList ? null : cities[activeCityId]}
            showSettingsButton={citiesOrder.length > 0} />
          {
            seeCityList ? (
              <>
                <CityList
                  citiesOrder={citiesOrder}
                  cities={cities}
                  updateWeather={this.updateWeather}
                  onDeleteCity={this.deleteCity} />
              </>
            ) : (
                <>
                  <CurrentCity
                    city={cities[activeCityId]} />
                </>
              )
          }
        </div >
      </DragDropContext >
    )
  }
}

export default App
