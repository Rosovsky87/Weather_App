import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FiMenu, FiTrash2 } from "react-icons/fi";
import styled from 'styled-components';


const Container = styled.div`
margin-bottom: 8px;
display: flex;
flex-direction: column;
height:150px;
`;

const TaskList = styled.div`
padding: 5px;
height:150px;
`;

const Input = styled.input`
margin: 12px 5px 12px 15px;
border: 3px solid PowderBlue;
border-radius:5px;
width: 155px;
:focus {
	border: 3px solid SkyBlue
};
outline: none;
`;

const IconWrapper = styled.div`
margin: 3px;
`;


const City = styled.div`
margin: 5px ;
height:25px;
display: flex;
background-color: PowderBlue;
border-radius:5px;
cursor : pointer;
`;

const CityName = styled.div`
flex-grow:2;
margin-top: 1px ;
`;


const CityList = (props) => {

	const [text, setText] = useState('');

	const onValueChange = (e) => {
		let currentText = e.target.value;
		setText(currentText);
	}

	const onSubmit = (e) => {
		e.preventDefault();
		const cityName = text;
		if (cityName) {
			props.updateWeather(cityName)
		}
		setText('');
	}

	const onChange = (e) => {
		const cityName = e.target.innerHTML;
		if (cityName) {
			props.updateWeather(cityName)
		}
		setText('');
	}


	return (
		<>

			<Container>
				<div>
					<Droppable droppableId="droppable">
						{(provided) => (
							<TaskList
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{props.citysList.map((city, index) => (
									<Draggable
										key={city.id}
										draggableId={city.id + ''}
										index={index}
									>
										{(provided) => (
											<City
												ref={provided.innerRef}
												{...provided.draggableProps}>
												<IconWrapper {...provided.dragHandleProps} >
													<FiMenu />
												</IconWrapper>
												<CityName onClick={(cityName) => onChange(cityName)}>
													{city.cityName}
												</CityName>
												<IconWrapper>
													<FiTrash2 onClick={() => props.onDeleteCity(city.cityName)} />
												</IconWrapper>
											</City>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</TaskList>
						)}
					</Droppable>
				</div>
			</Container>
			<div>
				<form
					onSubmit={onSubmit} >
					<Input
						placeholder="add location"
						type="text"
						onChange={onValueChange}
						value={text} />
				</form>
			</div>
		</>
	)
}

export default CityList;
