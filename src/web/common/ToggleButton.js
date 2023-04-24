import React, { useState } from 'react';
import "css/common/common.css";

function ToggleButton({id, title, parentMethod}) {
    const [active, setActive] = useState(true);

    const handleClick = () => {
      setActive(!active);
      if(active){
        parentMethod()
      }
    };
  
    return (
      <div id={id} className={`toggle-root-div ${active ? 'active' : ''}`}>
        <span>{title}</span> 
        <div className="toggle-container">
            <button className={`toggle-button ${active ? 'active' : ''}`} onClick={handleClick} type="button">
            <div className="toggle-knob" />
            </button>
        </div>
      </div>
    );
  }
  

export default ToggleButton;
