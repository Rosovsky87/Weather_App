import React, { Component } from 'react';
import WeatherData from '../../data/data';
import CityList from '../cityList/cityList';
import CurrentCity from '../currentCity/currentCity';
import SwitchBtn from '../switchBtn/switchBtn';
import { DragDropContext } from 'react-beautiful-dnd';
import { FiSettings, FiX } from "react-icons/fi";
import styled from 'styled-components';
import '@atlaskit/css-reset';


const Container = styled.div`
width: 195px;
height:250px;
border: 3px solid PowderBlue;
border-radius:15px;
margin: 15px 0 0 75%;
background-color: Azure;
align-items: stretch;
`;

const MainHeader = styled.div`
margin: 10px 10px;
display: flex;
justify-content: space-between;
align-items: center;
`;


const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};


export default class App extends Component {

	weatherData = new WeatherData();

	state = {
		citysList: [],
		city: {},
		seeCityList: true,
	}

	componentWillMount = () => {
		localStorage.getItem("user_city") &&
			localStorage.getItem("user_settings") &&
			localStorage.getItem("user_sees") &&
			this.setState({
				city: (JSON.parse(localStorage.getItem("user_city"))),
				citysList: (JSON.parse(localStorage.getItem("user_settings"))),
				seeCityList: (JSON.parse(localStorage.getItem("user_sees")))
			})
	}

	componentDidMount = () => {
		if (localStorage.getItem("user_city")) {
			this.updateWeather();
		}
	}

	componentDidUpdate = (nextProps, { city, citysList, seeCityList }) => {
		localStorage.setItem("user_city", JSON.stringify(city));
		localStorage.setItem("user_settings", JSON.stringify(citysList));
		localStorage.setItem("user_sees", JSON.stringify(seeCityList));
	}

	onCityLoaded = (city) => {
		this.addCity(city);
		this.setState({ city: city });
	}

	unique = (arr) => {
		return arr.reduce((acc, el) => {
			return acc.some(item => el.cityName === item.cityName || el.id === item.id) ? acc : [...acc, el]
		}, []);
	}

	addCity = (city) => {
		this.setState(({ citysList }) => {
			const newCitysList = citysList;
			newCitysList.unshift(city);
			let result = this.unique(newCitysList);
			let a = result.length > 5 ? result.pop() : null;
			return {
				citysList: result
			}
		});
	}

	updateWeather = (cityName) => {
		if (!cityName) { this.setState({ seeCityList: !this.state.seeCityList }) }
		else {
			this.weatherData.getWeather(cityName)
				.then(city => {
					let { cityName } = city;
					if (cityName.includes('Oblast') || cityName.includes(`Oblast’`)) {
						cityName = cityName.split(' ');
						let a = cityName.splice(1, 1);
						cityName = cityName.join();
						city.cityName = cityName;
					}
					return this.onCityLoaded(city);
				})
		}
	}

	onSwitch = () => {
		this.setState(({ seeCityList: !this.state.seeCityList }))
	}

	onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
		const citysList = reorder(
			this.state.citysList,
			result.source.index,
			result.destination.index
		);
		this.setState({ citysList });
	}

	showMainHeader = (cityName, country, icon) => {
		const newTitle = cityName ? (<h4>{cityName} ({country})</h4>) : (<h4>settings</h4>)
		return (
			<MainHeader>
				{newTitle}
				<SwitchBtn onSwitch={() => this.onSwitch()}>{icon}</SwitchBtn>
			</MainHeader>
		)
	}

	onDeleteCity = (city) => {

		this.setState(({ citysList }) => {
			const newCitysList = citysList.filter(el => el.cityName !== city);
			newCitysList.length === 0 ? this.setState({ seeCityList: true }) : this.updateWeather(newCitysList[0].cityName);
			return {
				citysList: newCitysList
			}
		});
	}


	render() {

		const { city, citysList, seeCityList } = this.state;
		const { cityName, country } = city;

		const mainHeader = seeCityList ? this.showMainHeader(null, null, <FiX />) : this.showMainHeader(cityName, country, <FiSettings />)

		const visible = seeCityList ? (
			<CityList
				citysList={citysList}
				updateWeather={(cityName) => this.updateWeather(cityName)}
				onSwitch={this.onSwitch}
				onDeleteCity={(cityName) => this.onDeleteCity(cityName)}
			/>
		) : <CurrentCity city={city} onSwitch={this.onSwitch} />

		return (
			<DragDropContext onDragEnd={this.onDragEnd} >
				<Container >
					{mainHeader}
					{visible}
				</Container >
			</DragDropContext >
		)
	}
}