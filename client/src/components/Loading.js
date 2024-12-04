//Import React and css
import React from "react";
import './loading.css';



const Loading = () => {
  //Write HTML d scripts
  return (
    <>
    <div className = 'img_container'>
        <div className = 'img_center'>
            <div className = 'cycle_loading'/>
            <div className = 'loading' />
        </div>
    </div>
    </>
  );
};

export default Loading;