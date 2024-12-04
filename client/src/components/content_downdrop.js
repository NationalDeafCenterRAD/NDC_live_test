import React, { useEffect, useState } from "react";
import "./content_downdrop.css";

// Font Style
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

// Logo
import warning_sign from './images/warning_sign.svg';

const ContentDowndrop = ({ buttonLabel, content, symbol, tabindex, clickedId, textContent, textContent1, background, your_color, onClick, textwidth,n,title, id}) => {
  const [warning_sty,setWarningSty] = useState('not-warning')
  useEffect(() => {
    if(n > 0.3){
      setWarningSty('shown-warning')
    }else{
      setWarningSty('not-warning')
    }
  }, [n])
  
  return (
    <>
      <div className = 'jonah-accordion'>
        <div className= 'accordion-item'>
          <div className = 'thetitle'>{title}</div>
          <div className={content} style = {{ background: background }}>
            <div className={textwidth}>
              <div className = 'thep'>
                {textContent}
              </div>
              <div className = 'thep'>
                {textContent1}
              </div>
              <div className = {warning_sty}>
                <button className = 'sample-warning' id = {id}>
                  <img src = {warning_sign} alt = '<Warning Sign>'></img>
                </button>
                <div className = 'sample-comment'>Interpret data with caution. Estimates may be unstable due to small sample size or other factors.</div>
              </div>
            </div>
          </div>
          <button
          onClick={(event) => onClick(event)}
          tabIndex = {tabindex}
          className={ clickedId }
          id = {id}
          aria-hidden = 'true'>
            <span className='accordion-title' style = {{ color: your_color }} id = {id}>
              {buttonLabel}
            </span>
            <span className={symbol} style = {{ color: your_color }} id = {id}>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
  
  export default ContentDowndrop;