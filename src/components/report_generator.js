import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import './dashboard.css';
import NDC_logo from './images/NDC_logo_color_horizontal-black-text.png';
//import citation from './citation.js'

//Data
import acs_5_year from './assets/acs_5_year.json';
import employment from './assets/employment.json';

//Widgets
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import jsPDF from 'jspdf'
import Select from 'react-select';
//import {
//  Link
//} from 'react-router-dom';

/*Icons and fonts*/
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';

//ChartJS Plugin
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from "react-chartjs-2";

const plugin = {
  beforeDraw: (chartCtx) => {
    const ctx = chartCtx.canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chartCtx.width, chartCtx.height);
    ctx.restore();
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//State Option List
let geographics = [
  {label: 'Alabama', value: 'Alabama', variable: 'Alabama'},
  {label: 'Alaska', value: 'Alaska', variable: 'Alaska'},
  {label: 'Arizona', value: 'Arizona', variable: 'Arizona'},
  {label: 'Arkansas', value: 'Arkansas', variable: 'Arkansas'},
  {label: 'California', value: 'California', variable: 'California'},
  {label: 'Colorado', value: 'Colorado', variable: 'Colorado'},
  {label: 'Connecticut', value: 'Connecticut', variable: 'Connecticut'},
  {label: 'Delaware', value: 'Delaware', variable: 'Delaware'},
  {label: 'District of Columbia', value: 'District of Columbia', variable: 'District of Columbia'},
  {label: 'Florida', value: 'Florida', variable: 'Florida'},
  {label: 'Georgia', value: 'Georgia', variable: 'Georgia'},
  {label: 'Hawaii', value: 'Hawaii', variable: 'Hawaii'},
  {label: 'Idaho', value: 'Idaho', variable: 'Idaho'},
  {label: 'Illinois', value: 'Illinois', variable: 'Illinois'},
  {label: 'Indiana', value: 'Indiana', variable: 'Indiana'},
  {label: 'Iowa', value: 'Iowa', variable: 'Iowa'},
  {label: 'Kansas', value: 'Kansas', variable: 'Kansas'},
  {label: 'Kentucky', value: 'Kentucky', variable: 'Kentucky'},
  {label: 'Louisiana', value: 'Louisiana', variable: 'Louisiana'},
  {label: 'Maine', value: 'Maine', variable: 'Maine'},
  {label: 'Maryland', value: 'Maryland', variable: 'Maryland'},
  {label: 'Massachusetts', value: 'Massachusetts', variable: 'Massachusetts'},
  {label: 'Michigan', value: 'Michigan', variable: 'Michigan'},
  {label: 'Minnesota', value: 'Minnesota', variable: 'Minnesota'},
  {label: 'Mississippi', value: 'Mississippi', variable: 'Mississippi'},
  {label: 'Missouri', value: 'Missouri', variable: 'Missouri'},
  {label: 'Montana', value: 'Montana', variable: 'Montana'},
  {label: 'Nebraska', value: 'Nebraska', variable: 'Nebraska'},
  {label: 'Nevada', value: 'Nevada', variable: 'Nevada'},
  {label: 'New Hampshire', value: 'New Hampshire', variable: 'New Hampshire'},
  {label: 'New Jersey', value: 'New Jersey', variable: 'New Jersey'},
  {label: 'New Mexico', value: 'New Mexico', variable: 'New Mexico'},
  {label: 'New York', value: 'New York', variable: 'New York'},
  {label: 'North Carolina', value: 'North Carolina', variable: 'North Carolina'},
  {label: 'North Dakota', value: 'North Dakota', variable: 'North Dakota'},
  {label: 'Ohio', value: 'Ohio', variable: 'Ohio'},
  {label: 'Oklahoma', value: 'Oklahoma', variable: 'Oklahoma'},
  {label: 'Oregon', value: 'Oregon', variable: 'Oregon'},
  {label: 'Pennsylvania', value: 'Pennsylvania', variable: 'Pennsylvania'},
  {label: 'Rhode Island', value: 'Rhode Island', variable: 'Rhode Island'},
  {label: 'South Carolina', value: 'South Carolina', variable: 'South Carolina'},
  {label: 'South Dakota', value: 'South Dakota', variable: 'South Dakota'},
  {label: 'Tennessee', value: 'Tennessee', variable: 'Tennessee'},
  {label: 'Texas', value: 'Texas', variable: 'Texas'},
  {label: 'Utah', value: 'Utah', variable: 'Utah'},
  {label: 'Vermont', value: 'Vermont', variable: 'Vermont'},
  {label: 'Virginia', value: 'Virginia', variable: 'Virginia'},
  {label: 'Washington', value: 'Washington', variable: 'Washington'},
  {label: 'West Virginia', value: 'West Virginia', variable: 'West Virginia'},
  {label: 'Wisconsin', value: 'Wisconsin', variable: 'Wisconsin'},
  {label: 'Wyoming', value: 'Wyoming', variable: 'Wyoming'}
]

const ReportGenerator = ({colors, justcolor, colorfill, navmenu}) => {
  // Paint style of React
  /*const chart_option_style = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: state.isDisabled ? 'default' : 'pointer',
      fontWeight: state.isDisabled ? 900 : 300
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0 0 10px 10px',
      overflow: 'hidden'
    }),
    indicatorSeparator: () => {},
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'black',
      "&:hover": {
        color: 'black'
      }
    }),
    control: (provided) => ({
      ...provided,
      background: "white",
      borderRadius: 100,
      border: 'None',
      padding: 2,
      "&:hover": {
        background: "#F6F6F7",
        color: 'white',
        cursor: 'pointer',
        transition: "all 0.5s ease-in-out"
      },
      transition: "all 0.5s ease-in-out"
    }),
    placeholder: (defaultStyles) => {
      return {
          ...defaultStyles,
          color: 'black',
          fontWeight: 700,
      }
    },
    singleValue:(provided, state) => ({
      ...provided,
      height:'100%',
      color:'black',
      paddingTop:'3px',
      fontWeight: state.isDisabled ? 900 : 700
    }),
  }*/
  const chart_side_style = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: state.isDisabled ? 'default' : 'pointer',
      fontWeight: state.isDisabled ? 900 : 300
    }),
    indicatorSeparator: () => {},
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#0B7373',
      "&:hover": {
        color: '#0B7373'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0 0 10px 10px',
      overflow: 'hidden'
    }),
    control: (provided) => ({
      ...provided,
      background: "#F6F6F7",
      borderRadius: 100,
      border: '0.5px #0B7373 solid',
      padding: 2,
      "&:hover": {
        background: '#ECEDF0',
        color: 'white',
        cursor: 'pointer',
        transition: "all 0.1s ease-in-out"
      },
      transition: "all 0.1s ease-in-out"
    }),
    placeholder: (defaultStyles) => {
      return {
          ...defaultStyles,
          color: '#0B7373',
          fontWeight: 700,
      }
    },
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      color:'#0B7373',
      paddingTop:'3px',
      fontWeight: 700,
    }),
  }
  // Screen size effect
  const [searchable, setSearchable] = useState(true)
  const [data_sidebar, setData_SideBar] = useState('None')
  const [interface_side, setInterface_Side] = useState('unset')
  const [data_grid, setData_Grid] = useState('grid')

  useLayoutEffect(() => {
    function updateSize() {
      if(window.innerWidth < 800){
        setInterface_Side('None')
        setData_SideBar('grid')
        setData_Grid('ungrid')
        setSearchable(false)
      }else{
        setInterface_Side('unset')
        setData_SideBar('None')
        setData_Grid('grid')
        setSearchable(true)
      }
      // setPieWidth on another ifelse
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Change geographic locations
  const [chosen_state, setChosenState] = useState('Texas');
  const [multi_state, setMultiState] = useState([{label: 'Texas', value: 'Texas'}])

  const changeGeoState = (e) => {
    setChosenState(e.variable)
    setMultiState(e)
  }
  
  // Chart JS necessary info
  const options = {
    responsive: true,
    devicePixelRatio: 2,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10 //this change the font size
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10 //this change the font size
          },
          format: {
            style: 'percent'
          }
        }
      }
    },
    plugins: {
      BackgroundColor: {
        color: 'orange',
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
    },
  };
  const labels = ['High School', 'Some College', "Associate's", "Bachelor's", "Master's", 'PhdD, JD, or MD'];
  const data = {
    labels,
    datasets: [
      {
        label: chosen_state,
        data: 
          employment.filter(employment => employment.attribution === 'deaf' & 
          employment.status !== 'no HS diploma' &  
          employment.type === 'education' & 
          employment.state === chosen_state).map(employment => employment.percentage/100).reverse(),
        backgroundColor: colorfill[0],
        borderWidth: 0,
        borderColor: colorfill[0],
        borderRadius: 10
      },
      {
        label: 'United States',
        data:  
          employment.filter(employment => employment.attribution === 'deaf' & 
          employment.status !== 'no HS diploma' &  
          employment.type === 'education' & 
          employment.state === 'United States').map(employment => employment.percentage/100).reverse(),
        backgroundColor: colorfill[2],
        borderWidth: 1,
        borderColor: colorfill[0],
        borderRadius: 10
      },
    ],
  };
  
  // Just fill in. These are nothing for now.
  const year = (acs_5_year-4)+'-'+acs_5_year;
  const slice_string = [50,'']
  const paddingSide = null


  // PDF Report Function
  const pdfRef = useRef(null)

  const generatePDF = () => {
      const content = pdfRef.current;

      const doc = new jsPDF('p','pt','letter');
      doc.html(content, {
          callback: function (doc) {
              doc.save('sample.pdf');
          }
      });
  };

  //SideBar Width
  const [sidebarWidth, setSideBarWidth] = useState('-290px');
  const [icon_rotate, setIcon_Rotate] = useState('rotate3d(0, 1, 0, 0deg)')
  const buttonRef = useRef()
  const sidebarRef = useRef()
  const [tabindex, setTabIndex] = useState('-1')
  const [tabindex1, setTabIndex1] = useState('0')

  const changeSideBarWidth = () => {
    if(sidebarWidth === '-290px'){
      setSideBarWidth('0px')
      setIcon_Rotate('rotate3d(0, 1, 0, 180deg)')
      setTabIndex('0')
      setTabIndex1('-1')
    }else{
      setSideBarWidth('-290px')
      setIcon_Rotate('rotate3d(0, 1, 0, 0deg)')
      setTabIndex('-1')
      setTabIndex1('0')
    }
  }; 

  useEffect(() => {
    const outsideDetection = e => {
      if ( buttonRef.current && !buttonRef.current.contains(e.target) &&
           sidebarRef.current && !sidebarRef.current.contains(e.target)){
        setSideBarWidth('-290px')
        setIcon_Rotate('rotate3d(0, 1, 0, 0deg)')
      }
    }

    document.addEventListener('mousedown', outsideDetection)

    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', outsideDetection)
    }
  }, [sidebarWidth])

  // Text Functions
  const [major_race,setMajorRace] = useState('white')
  const [highest_obtain, setHighObtain] = useState('Asian')
  const [lowest_obtain, setLowObtain] = useState('Latinx')
  useEffect(() => {
    setMajorRace(employment.filter(employment => employment.type === 'population' & 
      employment.variable === 'race' & employment.state === chosen_state &
      employment.attribution.includes('deaf')).map(employment => 
      [employment.attribution,employment.percentage]).reduce((a, b) => a[1] > b[1] ? a : b)[0])
    setHighObtain(employment.filter(employment => employment.variable === 'race' & 
      employment.status === 'bachelor' &  
      employment.type === 'education' & 
      employment.attribution.includes('deaf') &
      employment.state === chosen_state).map(employment => 
      [employment.attribution, employment.percentage]).reduce((a, b) => a[1] > b[1] ? a : b)[0])
    setLowObtain(employment.filter(employment => employment.variable === 'race' & 
      employment.status === 'bachelor' &  
      employment.type === 'education' & 
      employment.attribution.includes('deaf') &
      employment.state === chosen_state).map(employment => 
      [employment.attribution, employment.percentage]).reduce((a, b) => a[1] < b[1] ? a : b)[0])
    },[chosen_state,major_race,highest_obtain])

  return ( 
    <>
      <div className="body">
        <div className = 'container'>
          <div className = 'main-grid'>
            <div className = 'main-a'>
              <div id = 'title'>
                Deaf Postsecondary Data from the American Community Survey ({year})
              </div>
            </div>  
            <div className = 'main-b'/>                
          </div>
          <Tabs>
            <TabList aria-label="Tab - Report Generator">
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}} aria-label='Main Page'>{'Main'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            </TabList>
            <TabPanel>

            {/*Possible solution: https://jsfiddle.net/canvasjs/6u4gj3cx/*/}

              <div className='inside_container'>
                <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex1} aria-hidden = 'true'>
                  <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                </button>
                <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                  <div className='data_sidebar_interface'>
                    <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                      <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                    </button>
                  </div>
                </div>
                <div className={data_grid}>
                  <div className='a'>
                    <div className = 'title'>{'REPORT GENERATOR'}</div>
                    <button onClick={generatePDF}>Download Report</button>
                    <div className = 'pdf-viewer'>
                      <div ref={pdfRef} className = 'pdf-margin'>
                        <table>
                          <tr>
                            <th className='pdf-side-width'>
                              <img src = {NDC_logo} style = {{width: '150px', display: 'block', paddingRight: '50px'}} alt = 'NDC_logo'/>
                            </th>
                            <th>
                              <div className = 'pdf-title'>
                                <p className = 'pdf-text'>{chosen_state} State:</p>
                                <p className = 'pdf-text'>Deaf Education Facts</p>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>
                              <div className = 'pdf-percentage' style = {{color: colorfill[0]}}>
                                {
                                  employment.filter(employment => employment.type === 'population' & 
                                  employment.variable === 'overall' & employment.state === chosen_state &
                                  employment.attribution === 'deaf').map(employment => employment.percentage)+'%'
                                }
                              </div>
                              <div className = 'pdf-subtitle'>{'of 16-64 year olds are deaf in '+chosen_state}</div>
                            </th>
                            <th>
                              <div style = {{marginTop: '20px'}}/>
                              <div className = 'pdf-subtitle' style = {{width: '332px', textAlign: 'justify'}}>
                                {'According to the '+year+' American Community Survey 5-year data, among people aged 16-64, an estimated '+
                                  employment.filter(employment => employment.type === 'population' & 
                                    employment.variable === 'overall' & employment.state === chosen_state &
                                    employment.attribution === 'deaf').map(employment => employment.percentage)+
                                 '% of the population in '+chosen_state+' State is deaf. There are '+
                                 employment.filter(employment => employment.type === 'population' & 
                                    employment.variable === 'overall' & employment.state === chosen_state &
                                    employment.attribution === 'deaf').map(
                                    employment => employment.n).toLocaleString('en-US')+
                                 ' deaf people living in the state; an estimated '+
                                 employment.filter(employment => employment.type === 'population' & 
                                    employment.variable === 'disability' & employment.state === chosen_state &
                                    employment.attribution.includes('deaf')).map(
                                      function(employment, index){
                                       return index === 2 ? ' and '+employment.percentage+'% are '+employment.attribution : ' '+employment.percentage+'% are '+employment.attribution
                                    })+
                                 '; '+
                                 employment.filter(employment => employment.type === 'population' & 
                                 employment.variable === 'race' & employment.state === chosen_state &
                                 employment.attribution.includes('deaf')).map(
                                   function(employment, index){
                                    return index === 5 ? ' and '+employment.percentage+'% are '+employment.attribution.substring(5) : ' '+employment.percentage+'% are '+employment.attribution.substring(5)
                                 })+
                                 '.'} 
                              </div>
                            </th>
                          </tr>
                        </table>
                        <div className = 'pdf-title'>
                          <p className = 'pdf-text' style = {{marginBottom: '10px'}}>Key Findings</p>
                        </div>
                        <ul>
                          <li class = 'pdf-subtitle' style = {{color: 'black', marginBottom: '10px'}}>
                            {"About "+
                             employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === 'some college' &  
                              employment.type === 'education' & 
                              employment.state === chosen_state).map(employment => employment.percentage)+
                            "% of deaf students have completed some college. However, unsurprisingly, a fewer deaf students ("+
                            employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === 'associate' &  
                              employment.type === 'education' & 
                              employment.state === chosen_state).map(employment => employment.percentage)+
                            "%) obtain their associate's degree."}
                          </li>
                          <li class = 'pdf-subtitle' style = {{color: 'black'}}>
                            {"Compared to the national average, "+chosen_state+" has the highest education attainment percentages by "+
                            employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === 'phd/dr' &  
                              employment.type === 'education' & 
                              employment.state === chosen_state).map(employment => employment.percentage)+
                            '%-'+
                            employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === 'phd/dr' &  
                              employment.type === 'education' & 
                              employment.state === 'US').map(employment => employment.percentage)+
                            '%.'}
                          </li>
                        </ul>
                        <Bar options = {options} data = {data} plugins = {[plugin]} height='100px'/>
                        <div className = 'pdf-title'>
                          <p className = 'pdf-text' style = {{marginBottom: '10px', marginTop: '10px'}}>Race and Education</p>
                        </div>
                        <ul>
                          <li class = 'pdf-subtitle' style = {{color: 'black', marginBottom: '10px'}}>
                            {
                              chosen_state+' is predominately '+
                              employment.filter(employment => employment.type === 'population' & 
                                employment.variable === 'race' & employment.state === chosen_state &
                                employment.attribution.includes('deaf')).map(employment => 
                                [employment.attribution,employment.percentage]).reduce((a, b) => a[1] > b[1] ? a : b)[0].substring(5)+' while '+

                              employment.filter(employment => employment.attribution === major_race & 
                                employment.status === 'bachelor' &  
                                employment.type === 'education' & 
                                employment.state === chosen_state).map(employment => employment.percentage)+'% of '+
                              employment.filter(employment => employment.type === 'population' & 
                                employment.variable === 'race' & employment.state === chosen_state &
                                employment.attribution.includes('deaf')).map(employment => 
                                [employment.attribution,employment.percentage]).reduce((a, b) => a[1] > b[1] ? a : b)[0].substring(5)+
                              " college students obtain a bachelor's degree."
                            }
                          </li>
                          <li class = 'pdf-subtitle' style = {{color: 'black', marginBottom: '10px'}}>
                            {
                              'D'+employment.filter(employment => employment.variable === 'race' & 
                                employment.status === 'bachelor' &  
                                employment.type === 'education' & 
                                employment.attribution.includes('deaf') &
                                employment.state === chosen_state).map(employment => 
                                [employment.attribution, employment.percentage]).reduce((a, b) => a[1] > b[1] ? a : b)[0].substring(1)+
                              ' college students ('+
                              employment.filter(employment => employment.status === 'bachelor' &  
                                employment.type === 'education' & 
                                employment.attribution === highest_obtain &
                                employment.state === chosen_state).map(employment => 
                                employment.percentage)+"%) reported the highest percentage of those with a bachelor's degree or higher compared to hearing "+
                              highest_obtain.substring(5)+' college students ('+
                              employment.filter(employment => employment.status === 'bachelor' &  
                                employment.type === 'education' & 
                                employment.attribution === 'hearing '+highest_obtain.substring(5) &
                                employment.state === chosen_state).map(employment => 
                                employment.percentage)+'%).'
                              
                              }
                          </li>
                          <li class = 'pdf-subtitle' style = {{color: 'black'}}>
                            {
                              employment.filter(employment => employment.status === 'bachelor' &  
                                employment.type === 'education' & 
                                employment.attribution === lowest_obtain &
                                employment.state === chosen_state).map(employment => 
                                employment.percentage)+'% of '+lowest_obtain.substring(5)+" and 12.2% of Latinx have completed a Bachelor's degree or higher."
                            }
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='b' style={{display:interface_side}}>
                    <p className='aria-text'>Right Content</p>
                    <p className='aria-text'>
                      This content consists of several selection options that affect report.
                    </p>
                    <p className='aria-text'>
                      When one of these options is selected, this will also affect a chart, title, description, and other selection options 
                      including all information in exported chart.
                    </p>
                    <form>
                      <label id="aria-label" className = 'aria-focus' htmlFor="aria-input"/>
                      <div style = {{marginBottom: '10px'}}/>
                      <Select
                      aria-labelledby="aria-label"
                      //ariaLiveMessages={{
                      //  onFocus,
                      //}}
                      inputId="aria-input"
                      name="aria-live"
                      //onMenuOpen={onMenuOpen}
                      //onMenuClose={onMenuClose}
                      styles={chart_side_style}
                      value = {multi_state}
                      options = {geographics}
                      isSearchable = {searchable}
                      onChange = {changeGeoState}
                      tabIndex={null}
                      /> 
                    </form>
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ReportGenerator;
//chili powder, cumin, sugar, tomato paste, garlic powder, salt, pepper, and optional cayenne. 