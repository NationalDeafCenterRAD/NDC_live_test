import { useState } from "react";
import "./buttongroup.css";

const ButtonGroup = ({ buttons, AfterClick, thewidth }) => {
    const [clickedId, setClickedId] = useState(0);
  
    const handleClick = (event, id) => {
      setClickedId(id);
      AfterClick(event);
    };
  
    return (
      <>
      <div className = '.btn-group'>
        {buttons.map((buttonLabel, i) => (
          <button
            key={i}
            name={buttonLabel}
            onClick={(event) => handleClick(event, i)}
            className={i === clickedId ? "btn-active" : "btn"}
            style={{width:thewidth}}
          >
            {buttonLabel}
            {clickedId[0]}
          </button>
        ))}
      </div>
      </>
    );
  };
  
  export default ButtonGroup;
