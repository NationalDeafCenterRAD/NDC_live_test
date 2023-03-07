// React
import React from "react";

// Assets
import employment from './assets/employment.json';
import acs_one_year from './assets/acs_year.json';
import './edu_chart_text.css';

// Font Families
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

//Chart
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const EducationChartText = () => {

  const colorfill = ['#00A79D','#43C9C8','#D6EEF0','url(#teal)','url(#teal1)','url(#teal2)','#282729','#949494','#dbdbdb']
  
  let education_attainment = {
    chart:{
      type: 'column',
      height: 330
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: ['Asian','Black','Latinx','Native American','Multiracial','White'],
      visible: true,
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.type === 'education' & 
        employment.variable === 'race' & employment.state === 'United States' &
        employment.status === 'bachelor').map(
        employment => employment.percentage)),
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        format: '{value}%'
      }
    },
    tooltip: {
      formatter: function () {
        return this.series.name+': <b>'+this.y+'%</b>'
      },
      shared: false,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderWidth: 0,
      borderRadius: 20,
      border: 'none',
      style: {
        fontSize: '16px',
        color: '#fff'
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            if(
              (employment.filter(employment => employment.type === 'education' & 
                employment.variable === 'race' & employment.state === 'United States' &
                employment.status === 'bachelor' & employment.percentage === this.y & employment.attribution.includes(this.series.name)).map(
                function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
            ){
              return '\u26a0'+this.y + '%'
            }else{
              return this.y + '%';
            }
            //return '<img src=''></img>'
          },
        }
      }
    },
    series: [{
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === 'education' & 
        employment.variable === 'race' & employment.state === 'United States' &
        employment.status === 'bachelor' & employment.attribution.includes('deaf')).map(
        employment => [employment.index,employment.percentage])
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === 'education' & 
        employment.variable === 'race' & employment.state === 'United States' &
        employment.status === 'bachelor' & employment.attribution.includes('hearing')).map(
        employment => [employment.index,employment.percentage])
    }],
    exporting: {
      enabled: false
    }
  };

  return(
    <div className = 'body'>
      <div className = 'width-of-textchart'>
        <div className = 'grid-of-textchart'>
          <div className = 'text-for-chart'>
            <div className = 'title-for-chart'>Education Attainment</div>
            Fewer deaf people completed high school or college degrees than their hearing peers in {acs_one_year}. Educational attainment 
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
          <div className = 'chart-for-text'>
            <HighchartsReact highcharts={Highcharts} options={education_attainment}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationChartText;
