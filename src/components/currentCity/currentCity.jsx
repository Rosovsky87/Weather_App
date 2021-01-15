import React, { Component } from 'react';
import styled from 'styled-components';


const Container = styled.div`
margin-bottom: 5px;
`;

const WrapperBody = styled.div`
margin: 5px ;
display: flex;
justify-content: space-evenly;
`;

const WrapperBottom = styled.div`
font-size: 14px;
margin: 5px ;
display: flex;
flex-direction: column;
align-items: center;
`;

export default class CurrentCity extends Component {

	render() {

		const { cityName, temp, feelsLike, maimWeather, desWeather, windSpeed, windDer, weatherIcon } = this.props.city;

		const cityTemp = cityName ?
			<>
				<WrapperBody>
					<img src={weatherIcon} alt="изображение"
						width="90" height="90" />
					<h1>{temp}º C</h1>
				</WrapperBody>
				<WrapperBottom>
					<div>wind: {windSpeed}m/sec. {windDer}</div>
					<div>feels like: {feelsLike}º C</div>
					<div>{maimWeather}: {desWeather}</div>
				</WrapperBottom>
			</>
			: null;

		return (
			<Container>
				{ cityTemp}
			</Container>
		)
	}
}
