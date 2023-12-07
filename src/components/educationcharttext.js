// React
import React from "react";

// Assets
import employment from './assets/employment.json';
import acs_one_year from './assets/acs_year.json';
import './edu_chart_text.css';

// Font Families
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

const EducationChartText = () => {
  return(
    <div className = 'body'>
      <div className = 'width-of-textchart'>
        <div className = 'title-for-chart'>Education Attainment</div>
        Fewer deaf people completed high school or college degrees than their hearing peers in <div id = 'find-here-please'>{acs_one_year}</div>. Educational attainment 
        varies across gender, race, and ethnicity. For example, 
        {' '+employment.filter(employment => employment.type === 'education' & 
          employment.state === 'United States' &
          employment.attribution === 'deaf white' &
          employment.status === 'bachelor').map(
          employment => employment.percentage)}
        % of white deaf people have a bachelor's degree or higher 
        compared to 
        {' '+employment.filter(employment => employment.type === 'education' & 
          employment.state === 'United States' &
          employment.attribution === 'deaf Black' &
          employment.status === 'bachelor').map(
          employment => employment.percentage)}
        % of Black deaf and 
        {' '+employment.filter(employment => employment.type === 'education' & 
          employment.state === 'United States' &
          employment.attribution === 'deaf Latinx' &
          employment.status === 'bachelor').map(
          employment => employment.percentage)}
        % of Latinx deaf people. To learn more, explore educational attainment data on the national and state tabs.
      </div>
    </div>
  )
}

export default EducationChartText;
