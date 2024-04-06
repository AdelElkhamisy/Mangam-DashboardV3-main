import React, { useState } from 'react'
import {MdOutlineKeyboardArrowDown} from 'react-icons/md'
import {MdOutlineKeyboardArrowUp} from 'react-icons/md'
import './style.css'
import CatesFilter from './Filters/CatesFilter'
import DateFilter from './Filters/DateFilter'
import WeakFilter from './Filters/WeakFilter'
const Filter = () => {

  return (
    <div className='filter_pagee'>{
      // <div className="filter_right">
      //   <CatesFilter/>
      //   <DateFilter/>
      // </div>
      // <div className="filter_left">
      //   <WeakFilter/>
      // </div>
    }</div>
  )
}

export default Filter
