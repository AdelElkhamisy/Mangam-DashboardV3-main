import React, { useState } from 'react'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';

const WeakFilter = () => {
  const [weakfilteract,setweakfilteract]=useState(false);

  return (
    <div className='weak_filter'>
        <h5>أخر الاسبوع</h5>
        <h6 className='choose_filter'>
            {
              !weakfilteract?(
              <MdOutlineKeyboardArrowDown
                style={{cursor:'pointer'}}
                onClick={()=>{
                  setweakfilteract(true);
                }}
              />
              ):(
                <MdOutlineKeyboardArrowUp
                style={{cursor:'pointer'}}
                onClick={()=>{
                  setweakfilteract(false);
                }}
                />
              )
            }
        </h6>
    </div>
  )
}

export default WeakFilter
