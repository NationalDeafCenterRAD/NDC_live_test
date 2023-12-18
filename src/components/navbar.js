// Embed in any website: https://betterprogramming.pub/how-to-embed-a-react-application-on-any-website-1bee1d15617f
// How to deploy: https://www.youtube.com/watch?v=ZKxvBsGVKR8
// https://app.netlify.com/ for one man army deployment
// for company team deployment
// npm run build; serve -s build;
/*JS works with CSS*/
import './navbar.css';
import './dashboard.css';
import Loading from './Loading.js';
import "iframe-resizer/js/iframeResizer.contentWindow"; // add this
//import copyright from './images/CC_BY-NC-ND.svg';

// Data
import us25_64 from './assets/us25_64.json';

/*React and Switching Page Function and Click Outside Function*/
import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route, 
  Link,
} from 'react-router-dom';

/*Icons and fonts*/
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';

//Charts
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCPattern from 'highcharts-pattern-fill';
import HC_exporting from 'highcharts/modules/exporting';
import HC_accessible from "highcharts/modules/accessibility";

// Widgets
import {CirclePicker} from 'react-color';

// Add pattern in Highcharts
HCPattern(Highcharts);
HC_exporting(Highcharts);
HC_accessible(Highcharts)

/*Functional Pages*/
const Faster = lazy(() => import('./fasterone.js'));
const EducationChartText = lazy(() => import('./educationcharttext.js'));
const EducationChart = lazy(() => import('./educationchart.js'));
const EmploymentChartText = lazy(() => import('./employmentcharttext.js'));
const EmploymentChart = lazy(() => import('./employmentchart.js'));
const AboutData = lazy(() => import('./aboutdata.js'));
const StateReport = lazy(() => import('./state_report_page.js'))

const Navbar = () => {
  // Color Accessibility Options
  // Change Color function
  const colors = ['#863bff','#ff69ff','#d60068','#eb4034','#ff990a','#ffbe0a','#e3cc00','#48bd00','#00A79D','#24ede6','#00c3ff','#b39862']
  
  // Pattern Switch
  const [colorfill, setColorFill] = useState(['#00A79D','#43C9C8','#D6EEF0','url(#teal)','url(#teal1)','url(#teal2)','#282729','#949494','#dbdbdb'])
  const [justcolor, setJustColor] = useState('#00A79D')
  const Colorpicker = (color) => {
      setJustColor(color.hex)
      if(color.hex === '#863bff'){
        setColorFill(['#7140BF','#b485ff','#dbc4ff','url(#purple)','url(#purple1)','url(#purple2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#ff69ff'){
        setColorFill(['#d100d1','#ff69ff','#ffccff','url(#pink)','url(#pink1)','url(#pink2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#d60068'){
        setColorFill(['#a3004f','#ff007c','#ff94c8','url(#maroon)','url(#maroon1)','url(#maroon2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#eb4034'){
        setColorFill(['#a80b00','#eb4034','#ffa099','url(#red)','url(#red1)','url(#red2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#ff990a'){
        setColorFill(['#cc7904','#ff990a','#ffc778','url(#orange)','url(#orange1)','url(#orange2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#ffbe0a'){
        setColorFill(['#c99400','#ffbe0a','#ffe18f','url(#yellow)','url(#yellow1)','url(#yellow2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#e3cc00'){
        setColorFill(['#a19100','#e3cc00','#fff491','url(#gold)','url(#gold1)','url(#gold2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#48bd00'){
        setColorFill(['#2e7800','#48bd00','#a9ff73','url(#green)','url(#green1)','url(#green2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#00a79d'){
        setColorFill(['#00A79D','#43C9C8','#D6EEF0','url(#teal)','url(#teal1)','url(#teal2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#24ede6'){
        setColorFill(['#00c9c3','#24fff8','#ccfffd','url(#blue)','url(#blue1)','url(#blue2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#00c3ff'){
        setColorFill(['#009ac9','#45d3ff','#adecff','url(#sky)','url(#sky1)','url(#sky2)','#282729','#949494','#dbdbdb'])
      }else if(color.hex === '#b39862'){
        setColorFill(['#856c3a','#b39862','#dbccad','url(#brown)','url(#brown1)','url(#brown2)','#282729','#949494','#dbdbdb'])
      }
  } 

  // Popup switch // To fix asynchronous problem  https://dev.to/shareef/react-usestate-hook-is-asynchronous-1hia
  const [popup_style, setPopupStyle] = useState('popup-close');
  const [collapse, setCollapse] = useState(false);
  const buttonpopupRef = useRef()
  const popupRef = useRef()
        
  const changePopup = () => {
    popup_style === 'popup-open' ? setPopupStyle('popup-close') : setPopupStyle('popup-open');
    popup_style === 'popup-open' ? setCollapse(true) : setCollapse(false);
  };
      
  useEffect(() => {
    const outsideDetection = e => {
      if ( buttonpopupRef.current && !buttonpopupRef.current.contains(e.target) &&
            popupRef.current && !popupRef.current.contains(e.target)){
            setPopupStyle('popup-close')
          }
        }
        
      document.addEventListener('mousedown', outsideDetection)
        
      return () => {
        // Clean up the event listener
        document.removeEventListener('mousedown', outsideDetection)
      }
  }, [popup_style])
  
  //Demostrated chart
  let demo = {
      chart:{
        type: 'column',
        height: '200px'
      },
      title: {
        text: ""
      },
      xAxis: {
        visible: false
      },
      yAxis: {
        visible: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false
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
      series: [{
        showInLegend: false,
        name: 'Deaf + White',
        color: colorfill[0],
        borderColor: colorfill[0],
        borderWidth: 1,
        data: us25_64.filter(us25_64 => us25_64.RACETH === 'White' & 
        us25_64.SCHL === 'HS diploma' & us25_64.type === 'race' & us25_64.year === 2019).map(
        us25_64 => us25_64.attain).reverse()
      },
      { showInLegend: false,
        name: 'Deaf + Black',
        color: colorfill[1],
        borderColor: colorfill[0],
        borderWidth: 1,
        data: us25_64.filter(us25_64 => us25_64.RACETH === 'Black' & 
        us25_64.SCHL === 'HS diploma' & us25_64.type === 'race' & us25_64.year === 2019).map(
        us25_64 => us25_64.attain).reverse()
      },
      {
        showInLegend: false,
        name: 'Deaf + Asian/Pacific Islander',
        color: colorfill[2],
        borderColor: colorfill[0],
        borderWidth: 1,
        data: us25_64.filter(us25_64 => us25_64.RACETH === 'Asian/Pacific Islander' & 
        us25_64.SCHL === 'HS diploma' & us25_64.type === 'race' & us25_64.year === 2019).map(
        us25_64 => us25_64.attain).reverse()
      }, 
      {
        showInLegend: false,
        name: 'Deaf + Native American',
        color: colorfill[3],
        borderColor: colorfill[0],
        borderWidth: 1,
        data: us25_64.filter(us25_64 => us25_64.RACETH === 'Native American' & 
        us25_64.SCHL === 'HS diploma' & us25_64.type === 'race' & us25_64.year === 2019).map(
        us25_64 => us25_64.attain).reverse()
      },
      { showInLegend: false,
        name: 'Deaf + Latinx',
        color: colorfill[4],
        borderColor: colorfill[0],
        borderWidth: 1,
        data: us25_64.filter(us25_64 => us25_64.RACETH === 'Latinx' & 
        us25_64.SCHL === 'HS diploma' & us25_64.type === 'race' & us25_64.year === 2019).map(
        us25_64 => us25_64.attain).reverse()
      },
      {
        showInLegend: false,
        name: 'Deaf + Other Race/Multiracial',
        color: colorfill[5],
        borderColor: colorfill[0],
        borderWidth: 1,
        data: us25_64.filter(us25_64 => us25_64.RACETH === 'Other Race/Multiracial' & 
        us25_64.SCHL === 'HS diploma' & us25_64.type === 'race' & us25_64.year === 2019).map(
        us25_64 => us25_64.attain).reverse()
      }],
      exporting: {
        enabled: false
      }
  };

  /*Create the open and close nav column function*/
  const [style, setStyle] = useState('column-close');
  const [a_tabindex, setTabIndex] = useState('-1');
  const buttonRef = useRef();
  const sidebarRef = useRef();

  const changeWidth = () => {
    if(style === 'column-close'){
      setStyle('column-close');
      setTabIndex('0');
    }else{
      setStyle('column-close');
      setTabIndex('-1');
    }
  }; 

  useEffect(() => {
    const outsideDetection = e => {
      if ( buttonRef.current && !buttonRef.current.contains(e.target) &&
           sidebarRef.current && !sidebarRef.current.contains(e.target)){
        setStyle('column-close')
      }
    }
    document.addEventListener('mousedown', outsideDetection)
    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', outsideDetection)
    }
  }, [style])

  // Add style on linked text
  const linkStyle = {
    textDecoration: "none",
    color: 'white',
    fontWeight: 600,
    fontSize: '16px'
  };

  return (
  <>
    <div className = 'entire-container'>
    <div className='body'>
      <button className = 'invisible-button' value = 'accessibility' onClick = {changePopup} ref = {buttonpopupRef} aria-label = 'Accessibility - Color Options' aria-expanded = {collapse} aria-hidden = 'true'>
        <FontAwesome className='iconButton' name = 'universal-access' style = {{fontSize: '20px'}}/>
        <div className = 'Jonah-nav-text'>ACCESSIBILITY</div> 
      </button> 
      <div className = {popup_style}>
        <div className = 'accessible-container' ref = {popupRef}>
          <div className = 'accessible-box' id = 'accessible-id'>
            <div className = 'title'>ACCESSIBILITY OPTIONS</div>
            <HighchartsReact highcharts={Highcharts} options={demo}/>
          </div>
          <div className = 'accessible-box'>
            <div className = 'accessible-color'>
              <CirclePicker colors={colors} color={justcolor} onChangeComplete={Colorpicker}/>
            </div>
            <button className='accessible-close' onClick={changePopup} ref = {buttonpopupRef} aria-hidden="true">
              X
            </button>
          </div>
        </div>
      </div>
    </div>
    <Router>
      <div className={style} ref = {sidebarRef}>
        <div style = {{textAlign: 'right', marginRight: '10px'}}>
          <button className = 'for-column-close' onClick={changeWidth} ref = {buttonRef} aria-hidden="true">
            X
          </button>
        </div>
        <Link to='/' style={linkStyle} tabIndex = {a_tabindex}>
          <div className = 'column-text'>
            <FontAwesome className='column-item' name = 'pie-chart'/>
            &nbsp;&nbsp;&nbsp; 
            General
          </div>
        </Link>
      </div>
      <Suspense fallback={<Loading/>}>
      <Routes>
        <Route exact path='/' element={<Faster colors={colors} 
                                                  justcolor={justcolor} 
                                                  colorfill={colorfill}/>}/>                                        
        <Route exact path='/EducationChartText' element={<EducationChartText />}/>
        <Route exact path='/EducationChart' element={<EducationChart />}/>
        <Route exact path='/EmploymentChartText' element={<EmploymentChartText />}/>
        <Route exact path='/EmploymentChart' element={<EmploymentChart />}/>
        <Route exact path='/AboutData' element={<AboutData />}/>
        <Route exact path='/StateReport' element={<StateReport />}/>
      </Routes>
      </Suspense>
    </Router>
    </div>
  </>
  )
}

export default Navbar;
