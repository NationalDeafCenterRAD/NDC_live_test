// React
import React from "react";

// Assets
import employment from './assets/employment.json';
import './emp_chart_text.css';

// Font Families
import "@fontsource/roboto-slab";
import "@fontsource/roboto";


const EmploymentChartText = () => {
  return(
    <div className = 'body'>
      <div className = 'width-of-textchart'>
        <div className = 'title-for-chart'>Employment Rates</div>
        National employment statistics show lower employment rates among deaf people. Almost half of deaf people are not in the labor force. 
        Employment rates vary by gender, race and ethnicity. For example, 
        {' '+employment.filter(employment => employment.type === 'employment' & 
          employment.state === 'United States' &
          employment.attribution === 'deafdisabled' &
          employment.status === 'employed').map(
          employment => employment.percentage)}
        % of deafdisabled people are employed compared to 
        {' '+employment.filter(employment => employment.type === 'employment' & 
          employment.state === 'United States' &
          employment.attribution === 'deaf with no additional disabilities' &
          employment.status === 'employed').map(
          employment => employment.percentage)}
        % of deaf people without additional disabilities.  To learn more, explore employment data on the national and state tabs.
      </div>
    </div>
  )
}

export default EmploymentChartText;
