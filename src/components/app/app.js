import React, { PureComponent } from 'react';
import Header from '../header/Header';
import CityList from '../cityList/CityList';
import CurrentCity from '../currentCity/CurrentCity';
import * as ls from '../../ls';
import { getWeather } from '../../data/data';
import { DragDropContext } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import './app.scss';


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

      if (Object.keys(cities).includes(newActiveCityId + '')) {
        delete cities[newActiveCityId];
      }

      const newCities = { [newActiveCityId]: citiesList, ...cities };

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
