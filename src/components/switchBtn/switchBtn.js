import React from 'react';
import { FiSettings, FiX } from "react-icons/fi";


function SwitchBtn({ onSwitch, isCity }) {

  return (
    <div onClick={onSwitch} >
      {isCity ? <FiSettings size='2em' /> : <FiX size='2em' />}
    </ div>
  )
}

export default SwitchBtn