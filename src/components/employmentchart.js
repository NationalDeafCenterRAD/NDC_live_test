// React
import React from "react";

// Assets
import employment from './assets/employment.json';
import './emp_chart_text.css';

// Font Families
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

//Chart
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const EmploymentChartText = () => {

  const colorfill = ['#00A79D','#43C9C8','#D6EEF0','url(#teal)','url(#teal1)','url(#teal2)','#282729','#949494','#dbdbdb']
  
  let deaf_emp = {
    chart:{
      type: 'pie',
      height: 330,
    },
    legend: {
      labelFormat: '<span style="color:#949494">{y}%</span> {name}',
      align: 'center',
      verticalAlign: 'bottom'
    },
    title: {
      useHTML: true,
      text: "deaf",
      verticalAlign: 'middle',
      floating: true,
      y:-20,
      style: {
        fontFamily: 'Roboto Slab, serif',
        fontSize: '20px'
      },
    },
    tooltip: {
      formatter: function () {
        return this.point.name+': <b>'+this.y+'%</b>'
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
    defs: {
      patterns: [
        {
          id: "purple",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#7140BF',
              icon: <div />
            }
        },
        {
          id: "purple1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#7140BF',
            fill: '#dbc4ff',
            strokeWidth: 2,
          }
        },
        {
          id: "purple2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#b485ff',
            strokeWidth: 3
          }
        },
        {
          id: "pink",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#d100d1',
              icon: <div />
            }
        },
        {
          id: "pink1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#d100d1',
            fill: '#ffccff',
            strokeWidth: 2,
          }
        },
        {
          id: "pink2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#ff69ff',
            strokeWidth: 3
          }
        },
        {
          id: "maroon",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#a3004f',
              icon: <div />
            }
        },
        {
          id: "maroon1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#a3004f',
            fill: '#ff94c8',
            strokeWidth: 2,
          }
        },
        {
          id: "maroon2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#ff007c',
            strokeWidth: 3
          }
        },
        {
          id: "red",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#a80b00',
              icon: <div />
            }
        },
        {
          id: "red1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#a80b00',
            fill: '#ffa099',
            strokeWidth: 2,
          }
        },
        {
          id: "red2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#eb4034',
            strokeWidth: 3
          }
        },
        {
          id: "orange",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#cc7904',
              icon: <div />
            }
        },
        {
          id: "orange1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#cc7904',
            fill: '#ffc778',
            strokeWidth: 2,
          }
        },
        {
          id: "orange2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#ff990a',
            strokeWidth: 3
          }
        },
        {
          id: "yellow",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#c99400',
              icon: <div />
            }
        },
        {
          id: "yellow1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#c99400',
            fill: '#ffe18f',
            strokeWidth: 2,
          }
        },
        {
          id: "yellow2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#ffbe0a',
            strokeWidth: 3
          }
        },
        {
          id: "gold",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#a19100',
              icon: <div />
            }
        },
        {
          id: "gold1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#a19100',
            fill: '#fff491',
            strokeWidth: 2,
          }
        },
        {
          id: "gold2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#e3cc00',
            strokeWidth: 3
          }
        },
      {
          id: "green",
          path: {
            d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
            stroke: "#FFFFFF",
            strokeWidth: 1,
            fill: '#2e7800',
            icon: <div />
          }
        },
        {
          id: "green1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#2e7800',
            fill: '#a9ff73',
            strokeWidth: 2,
          }
        },
        {
          id: "green2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#48bd00',
            strokeWidth: 3
          }
        },
        {
          id: "teal",
          path: {
            d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
            stroke: "#FFFFFF",
            strokeWidth: 1,
            fill: '#00A79D',
            icon: <div />
          }
        },
        {
          id: "teal1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#00A79D',
            fill: '#D6EEF0',
            strokeWidth: 2,
          }
        },
        {
          id: "teal2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#43C9C8',
            strokeWidth: 3
          }
        },
      {
          id: "blue",
          path: {
            d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
            stroke: "#FFFFFF",
            strokeWidth: 1,
            fill: '#00c9c3',
            icon: <div />
          }
        },
        {
          id: "blue1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#00c9c3',
            fill: '#ccfffd',
            strokeWidth: 2,
          }
        },
        {
          id: "blue2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#24fff8',
            strokeWidth: 3
          }
        },
        {
          id: "sky",
          path: {
            d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
            stroke: "#FFFFFF",
            strokeWidth: 1,
            fill: '#009ac9',
            icon: <div />
          }
        },
        {
          id: "sky1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#009ac9',
            fill: '#adecff',
            strokeWidth: 2,
          }
        },
        {
          id: "sky2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#45d3ff',
            strokeWidth: 3
          }
        },
        {
          id: "brown",
          path: {
            d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
            stroke: "#FFFFFF",
            strokeWidth: 1,
            fill: '#856c3a',
            icon: <div />
          }
        },
        {
          id: "brown1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#856c3a',
            fill: '#dbccad',
            strokeWidth: 2,
          }
        },
        {
          id: "brown2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#b39862',
            strokeWidth: 3
          }
        }
      ]
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        innerSize: "auto",
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          formatter:function(){
            return this.y + '%'
          },
        },
      showInLegend: true,
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      innerSize: '77%',
      keys: ['name', 'y', 'color','borderColor','borderWidth'],
      data:
          [['Employed', employment.filter(employment => employment.type === 'employment' & 
              employment.variable === 'overall' & employment.state === 'United States' &
              employment.status === 'employed' &
              employment.attribution === 'deaf').map(
              employment => employment.percentage)[0], colorfill[0],colorfill[0],1],
           ['Unemployed', employment.filter(employment => employment.type === 'employment' & 
              employment.variable === 'overall' & employment.state === 'United States' &
              employment.status === 'unemployed' &
              employment.attribution === 'deaf').map(
              employment => employment.percentage)[0], colorfill[1],colorfill[0],1],
           ['Not in Labor Force', employment.filter(employment => employment.type === 'employment' & 
              employment.variable === 'overall' & employment.state === 'United States' &
              employment.status === 'notinLF' &
              employment.attribution === 'deaf').map(
              employment => employment.percentage)[0], colorfill[2],colorfill[0],1]],
        dataLabels: {
            enabled: false,
            format: '{point.y}%'
        },
        center: ['50%', '48%'],
        size: '100%',
        startAngle: 0,
        endAngle: 0
    }],
    exporting: {
      enabled: false 
    }
  }
  let hearing_emp = {
    chart:{
      type: 'pie',
      height: 330,
    },
    legend: {
      labelFormat: '<span style="color:#949494">{y}%</span> {name}',
      align: 'center',
      verticalAlign: 'bottom',
    },
    title: {
      useHTML: true,
      text: "hearing",
      verticalAlign: 'middle',
      floating: true,
      y:-20,
      style: {
        fontFamily: 'Roboto Slab, serif',
        fontSize: '20px'
      },
    },
    tooltip: {
      formatter: function () {
        return this.point.name+': <b>'+this.y+'%</b>'
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
    defs: {
      patterns: [
        {
          id: "black",
          path: {
              d:'M 2, 2.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0, M 6.5, 6.5 a 0.75,0.75 0 0,0 1.50,0 a 0.75,0.75 0 0,0 -1.50,0',
              stroke: "#FFFFFF",
              strokeWidth: 1,
              fill: '#282729',
              icon: <div />
            }
        },
        {
          id: "black1",
          path: {
            d: 'M 0 0 L 10 10 M 10 0 L 0 10',
            stroke: '#282729',
            fill: '#949494',
            strokeWidth: 2,
          }
        },
        {
          id: "black2",
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            stroke: '#dbdbdb',
            fill: '#282729',
            strokeWidth: 3
          }
        }
      ]
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        innerSize: "auto",
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          formatter:function(){
            return this.y + '%'
          },
        },
      showInLegend: true,
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Percentage',
      innerSize: '77%',
      keys: ['name', 'y', 'color','borderColor','borderWidth'],
      data:
          [['Employed', employment.filter(employment => employment.type === 'employment' & 
            employment.variable === 'overall' & employment.state === 'United States' &
            employment.status === 'employed' &
            employment.attribution === 'hearing').map(
            employment => employment.percentage)[0], colorfill[6],colorfill[6],1],
          ['Unemployed', employment.filter(employment => employment.type === 'employment' & 
            employment.variable === 'overall' & employment.state === 'United States' &
            employment.status === 'unemployed' &
            employment.attribution === 'hearing').map(
            employment => employment.percentage)[0], colorfill[7],colorfill[6],1],
          ['Not in Labor Force', employment.filter(employment => employment.type === 'employment' & 
            employment.variable === 'overall' & employment.state === 'United States' &
            employment.status === 'notinLF' &
            employment.attribution === 'hearing').map(
            employment => employment.percentage)[0], colorfill[8],colorfill[6],1]],
        dataLabels: {
            enabled: false,
            format: '{point.y}%'
        },
        center: ['50%', '48%'],
        size: '100%',
        startAngle: 0,
        endAngle: 0
    }],
    exporting: {
      enabled: false 
    }
  }

  return(
    <div className = 'body'>
      <div className = 'width-of-textchart'>
        <div className='chart-text-subgrid'>
          <div className='charttext-subgrid_a'>
            <HighchartsReact highcharts={Highcharts} options={deaf_emp}/>
          </div>
          <div className = 'chart-text-subgrid_b'>
            <HighchartsReact highcharts={Highcharts} options={hearing_emp}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmploymentChartText;
