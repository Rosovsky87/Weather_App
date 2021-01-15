import React, { Component } from 'react';


export default class SwitchBtn extends Component {

	render() {
		return (
			<div onClick={this.props.onSwitch} >
				{this.props.children}
			</ div>
		)
	}
}
