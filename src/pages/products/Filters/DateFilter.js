import React, { useState } from 'react'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
const DateFilter = () => {
  const [datefilteract,setdatefilteract]=useState(false);

  return (
    <div className="date_filter">
      <h5>ترتيب عن طريق</h5>
      <h6>الاحدث</h6>
      <h6 className='choose_filter'>
            {
              !datefilteract?(
              <MdOutlineKeyboardArrowDown
                style={{cursor:'pointer'}}
                onClick={()=>{
                  setdatefilteract(true);
                }}
              />
              ):(
                <MdOutlineKeyboardArrowUp
                style={{cursor:'pointer'}}
                onClick={()=>{
                  setdatefilteract(false);
                }}
                />
              )
            }
      </h6>
    </div>
  )
}

export default DateFilter
