// Adjust title width to prevent overlapping
// Check ACS year depending on tabs after removing Demographics B
// US Map needs to include somewhere.
// Also Review the Functions of Selection to See No Errors Using Exported Data
//Import React and css
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import './dashboard.css';
import thelogo from './logo_export.js'
import citation from './citation.js'

//Data
import most_recent_year from './assets/acs_year.json';
import most_recent_year1 from './assets/acs_5_year.json';
import employment from './assets/employment.json';
import usmap from './assets/usmap.json';

//Widgets
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select, { components } from 'react-select';
import ContentDowndrop from "./content_downdrop";

/*Icons and fonts*/
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';
//import warning_sign from './images/warning_sign.svg';

//Charts
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_exporting from 'highcharts/modules/exporting';
//import HCMore from 'highcharts/highcharts-more';
import HC_accessible from "highcharts/modules/accessibility";
import HCItem from 'highcharts/modules/item-series';
//import HCPattern from 'highcharts-pattern-fill';

// Add pattern in Highcharts
HC_exporting(Highcharts);
HC_accessible(Highcharts);
HCItem(Highcharts);
//HCPattern(Highcharts);

// General
let thelist = [
  {label: 'United States', value: 'United States', variable: 'US'},
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

// Second options
let variables = [
  {label: 'Overall', value: 'Overall', variable: 'overall', variables: [''],
   deaf: ['deaf people'], hearing: ['hearing people']},
  {label: 'Age', value: 'Age', variable: 'age', variables: ['16-24','25-34','35-44','45-54','55-64'],
   deaf: ['deaf people in 16-24 age','deaf people in 25-34 age group','deaf people in 35-44 age group','deaf people in 45-54 age group','deaf people in 55-64 age group'], 
   hearing: ['hearing people in 16-24 age people','hearing people in 25-34 age group','hearing people in 35-44 age group','hearing people in 45-54 age group','hearing people in 55-64 age people']},
  {label: 'Race', value: 'Race', variable: 'race', variables: ['Asian','Black','Latinx','Native American','multiracial','white'],
   deaf: ['deaf Asian people','deaf Black people','deaf Latinx people','deaf Native American people','deaf multiracial people','deaf white people'],
   hearing: ['hearing Asian people','hearing Black people','hearing Latinx people','hearing Native American people','hearing multiracial','hearing white people']},
  {label: 'Gender', value: 'Gender', variable: 'gender', variables: ['women','men'],
   deaf: ['deaf women','deaf men'], hearing: ['hearing women','hearing men']},
  {label: 'Disability', value: 'Disability', variable: 'disability', variables: ['blind','disabled','no additional disabilities'],
   deaf: ['deafblind people','deafdisabled people','deaf people with no additional disabilities'], 
   hearing: ['hearing blind people','hearing disabled people', 'hearing people with no additional disabilities']}
]

// For React Select: More Options - Open
let attributions = [
  {label: 'deaf', value: 'deaf', variable: 'overall', color: 'teal', words: 'deaf people'},
  {label: 'hearing', value: 'hearing', variable: 'overall', color: 'black', words: 'hearing people'},
  {label: 'deaf: ages 55-64', value: 'deaf: ages 55-64', variable: 'age', color: 'teal', words: 'deaf people in 55-64 age group'},
  {label: 'deaf: ages 45-54', value: 'deaf: ages 45-54', variable: 'age', color: 'teal', words: 'deaf people in 45-54 age group'},
  {label: 'deaf: ages 35-44', value: 'deaf: ages 35-44', variable: 'age', color: 'teal', words: 'deaf people in 35-44 age group'},
  {label: 'deaf: ages 25-34', value: 'deaf: ages 25-34', variable: 'age', color: 'teal', words: 'deaf people in 25-34 age group'},
  {label: 'deaf: ages 16-24', value: 'deaf: ages 16-24', variable: 'age', color: 'teal', words: 'deaf people in 16-24 age group'},
  {label: 'hearing: ages 55-64', value: 'hearing: ages 55-64', variable: 'age', color: 'black', words: 'hearing people in 55-64 age group'},
  {label: 'hearing: ages 45-54', value: 'hearing: ages 45-54', variable: 'age', color: 'black', words: 'hearing people in 45-54 age group'},
  {label: 'hearing: ages 35-44', value: 'hearing: ages 35-44', variable: 'age', color: 'black', words: 'hearing people in 35-44 age group'},
  {label: 'hearing: ages 25-34', value: 'hearing: ages 25-34', variable: 'age', color: 'black', words: 'hearing people in 25-34 age group'},
  {label: 'hearing: ages 16-24', value: 'hearing: ages 16-24', variable: 'age', color: 'black', words: 'hearing people in 16-24 age group'},
  {label: 'deaf women', value: 'deaf women', variable: 'gender', color: 'teal', words: 'deaf women'},
  {label: 'deaf men', value: 'deaf men', variable: 'gender', color: 'teal', words: 'deaf men'},
  {label: 'hearing women', value: 'hearing women', variable: 'gender', color: 'black', words: 'hearing women'},
  {label: 'hearing men', value: 'hearing men', variable: 'gender', color: 'black', words: 'hearing men'},
  {label: 'deaf Asian', value: 'deaf Asian', variable: 'race', color: 'teal', words: 'deaf Asians'},
  {label: 'deaf Black', value: 'deaf Black', variable: 'race', color: 'teal', words: 'deaf Black people'},
  {label: 'deaf Latinx', value: 'deaf Latinx', variable: 'race', color: 'teal', words: 'deaf Latinx people'},
  {label: 'deaf Native American', value: 'deaf Native American', variable: 'race', color: 'teal', words: 'deaf Native Americans'},
  {label: 'deaf multiracial', value: 'deaf multiracial', variable: 'race', color: 'teal', words: 'deaf multiracial people'},
  {label: 'deaf white', value: 'deaf white', variable: 'race', color: 'teal', words: 'deaf white people'},
  {label: 'hearing Asian', value: 'hearing Asian', variable: 'race', color: 'black', words: 'hearing Asians'},
  {label: 'hearing Black', value: 'hearing Black', variable: 'race', color: 'black', words: 'hearing Black'},
  {label: 'hearing Latinx', value: 'hearing Latinx', variable: 'race', color: 'black', words: 'hearing Latinx'},
  {label: 'hearing Native American', value: 'hearing Native American', variable: 'race', color: 'black', words: 'hearing Native Americans'},
  {label: 'hearing multiracial', value: 'hearing multiracial', variable: 'race', color: 'black', words: 'hearing multiracial people'},
  {label: 'hearing white', value: 'hearing white', variable: 'race', color: 'black', words: 'hearing white people'},
  {label: 'deafblind', value: 'deafblind', variable: 'disability', color: 'teal', words: 'deafblind people'},
  {label: 'deafdisabled', value: 'deafdisabled', variable: 'disability', color: 'teal', words: 'deafdisabled people'},
  {label: 'deaf with no additional disabilities', value: 'deaf with no additional disabilities', variable: 'disability', color: 'teal', words: 'deaf people with no additional disabilities'},  
  {label: 'hearing blind', value: 'hearing blind', variable: 'disability', color: 'black', words: 'hearing blind people'},
  {label: 'hearing disabled', value: 'hearing disabled', variable: 'disability', color: 'black', words: 'hearing disabled people'},
  {label: 'hearing with no additional disabilities', value: 'hearing with no additional disabilities', variable: 'disability', color: 'black', words: 'hearing people with no additional disabilities'}
]

// State Comparison List
let state_comparison = [
  {label: 'Education Attainment',value: 'Education Attainment', disabled: true,},
  {label: 'All Levels', value: 'All Levels', title: "Education Attainment - High School, Some College, AA, BA, MA, PHD", variable: 'all', type: 'education',age: '25-64', description: '', description1: ''},
  {label: 'High School', value: 'High School', title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25-64', description: ' have completed high school or higher', description1: ' have completed high school or higher'},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college',type: 'education',age: '25-64',description: ' have completed some college', description1: ' have completed some college'},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate',type: 'education',age: '25-64', description: " have completed an associate's degree or higher", description1: " have completed an associate's degree or higher"},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher"},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master',type: 'education',age: '25-64', description: " have completed a master's degree or higher", description1: " have completed a master's degree or higher"},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr',type: 'education',age: '25-64', description: ' have completed doctoral degree or equivalent',description1: ' have completed doctoral degree or equivalent'},
  {label: 'Employment Status', value: 'Employment Status', disabled: true},
  {label: 'Employment Rate', value: 'Employment Rate', title: 'Employment Rate', variable: 'employed',type: 'employment',age: '16-64', description: ' are employed',description1: ' are employed'},
  {label: 'Unemployment Rate', value: 'Unemployment Rate', title: 'Unemployment Rate', variable: 'unemployed',type: 'employment',age: '16-64', description: ' are unemployed, which is defined as being currently or recently looking for work', description1: ' are unemployed'},
  {label: 'Not in Labor Force', value: 'Not in Labor Force', title: 'Not in Labor Force', variable: 'notinLF',type: 'employment',age: '16-64', description: ' are not in the labor force, which is defined as not currently employed and not looking for work',description1: ' are not in the labor force'}
]

//Stylize Inner Menu in React Select 
const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <div className='checkbox_grid'>
          <input
          type="checkbox"
          className='menuCheckbox'
          checked={props.isSelected}
          onChange={() => null}
          tabIndex='-1'
          aria-labelledby={props}
          aria-checked = 'false'
          />
          <label role="checkbox" aria-checked="false" aria-labelledby={props} tabIndex="-1" style = {{fontFamily: 'Roboto', fontSize: '16px', cursor: 'pointer'}}>{props.label}</label>
        </div>
      </components.Option>
    </div>
  );
};

//Demographic text
const demo_age = ['16-24 years old','25-34 years old','35-44 years old','45-54 years old','55-64 years old']
const demo_rac = ['Asian','Black','Latinx','Native American','multiracial','white']
const demo_gen = ['women','men']
const deaf_dis = ['deafblind','deafdisabled','deaf with no additional disabilities']
const hear_dis = ['hearing blind','hearing disabled','hearing with no additional disabilities']

// For Education Data
let edulist = ["doctoral degree or equivalent","master’s degree or higher","bachelor’s degree or higher",
               "an associate’s degree or higher",'some college or higher','high school or higher']

const Dashboard = ({colors, justcolor, colorfill}) => {
  //Width Screen Size Listener
  const [size, setSize] = useState([0,0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  //Change sidebar width in container
  const [data_sidebar, setData_SideBar] = useState('None')
  const [interface_side, setInterface_Side] = useState('unset')
  const [data_grid, setData_Grid] = useState('grid')
  const [pie_width, setPieWidth] = useState(300)
  const [HCwidth, setHC_Width] = useState(null)
  const [searchable, setSearchable] = useState(true)
  const [slice_string, setSliceString] = useState([50,''])
  const [paddingSide, setPaddingSide] = useState(null)
  useEffect(() => {
    if(size[0] < 800 & size[0] >= 365){
      setPieWidth(300)
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      setSearchable(false)
      setHC_Width(size[0]/1.2)
      setSliceString([5,'.'])
      setPaddingSide('10px')
    }else if(size[1] < 500){
      setSearchable(false)
    }else if(size[0] < 365){
      setPieWidth(200)
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      setSearchable(false)
      setHC_Width(size[0]/1.2)
      setSliceString([4,'.'])
      setPaddingSide('10px')
    }else if(size[0] < 1070){
      setPieWidth(300)
      setData_SideBar('None')
      setInterface_Side('unset')
      setData_Grid('grid')
      setSearchable(true)
      setHC_Width(null)
      setSliceString([10,''])
      setPaddingSide(null)
    }else{
      setPieWidth(300)
      setData_SideBar('None')
      setInterface_Side('unset')
      setData_Grid('grid')
      setSearchable(true)
      setHC_Width(null)
      setSliceString([50,''])
      setPaddingSide(null)
    };
  }, [size])

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

  //Stylize React Selections
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: 'black',
      cursor: 'pointer'
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
      borderRadius: '0 20px 20px 0',
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
  const customStyles1 = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: 'pointer'
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
      borderRadius: '0 20px 20px 0',
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
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      color:'black',
      paddingTop:'3px',
      fontWeight: 700
    }),
  }
  const listoptions = {
    option: (base, state) => ({
      ...base,
      margin: 0,
      cursor: 'pointer',
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected ? '#008e8593' 
                : state.isFocused ? '#ECEDF0' 
                : 'transparent',
      color: state.isSelected ? 'black'  
           : '#0B7373',
      fontSize: 16,
      fontFamily: 'Roboto',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      cursor: 'pointer',
      color: '#0B7373',
      "&:hover": {
        color: '#0B7373'
      }
    }),
    control: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      border: '0.5px #0B7373 solid',
      borderBottom: 'none',
      borderRadius: '20px 20px 0 0',
      background: "#F6F6F7",
      padding: 2,
      "&:hover": {
        background: '#ECEDF0',
        cursor: 'pointer',
        transition: "all 0.1s ease-in-out"
      },
      transition: "all 0.1s ease-in-out"
    }),
    menu: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      position: 'static',
      overflowX: 'hidden',
      border:  '0.5px #0B7373 solid',
      margin:0,
      zIndex: 0,
      padding: 0,
      background: "#F6F6F7",
      borderRadius: '0 0 20px 20px',
      color: '#0B7373',
      boxShadow: 'None',
      "&:hover": {
        background: '#F6F6F7',
        cursor: 'pointer',
        transition: "all 0.5s ease-in-out"
      },
      transition: "all 0.5s ease-in-out"
    }),
    singleValue:(provided, state) => ({
      ...provided,
      cursor: 'pointer',
      height:'100%',
      fontWeight: 700,
      color: '#0B7373',
    })
  }
  const listoptions1 = {
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'transparent',
      color: 'black',
      fontSize: 16,
      fontFamily: 'Roboto',
      cursor: 'pointer'
    }),
    control: (provided) => ({
      ...provided,
      marginTop: 20,
      border: '0.5px #008e85 solid',
      borderBottom: 'none',
      borderRadius: '20px 20px 0 0',
      padding: 2,
      "&:hover": {
        background: '#ECEDF0',
        cursor: 'pointer',
        transition: "all 0.1s ease-in-out"
      },
      transition: "all 0.1s ease-in-out"
    }),
    menu: (provided) => ({
      ...provided,
      position: 'static',
      overflowX: 'hidden',
      border: '0.5px #008e85 solid',
      margin:0,
      zIndex: 0,
      padding: 0,
      background: "#F6F6F7",
      borderRadius: '0 0 20px 20px',
      color: '#008e85',
      boxShadow: 'None',
      "&:hover": {
        background: '#F6F6F7',
        cursor: 'pointer',
        transition: "all 0.5s ease-in-out"
      },
      transition: "all 0.5s ease-in-out"
    }),
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      paddingTop:'3px',
      fontWeight: 700
    }),
  }
  const edulistoptions1 = {
    option: (provided, state) => ({
      ...provided,
      margin: 0,
      cursor: stateDisabled ? 'not-allowed' : 'pointer',
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected & stateDisabled ? 'transparent' 
      : state.isSelected & !stateDisabled ? '#008e8593' 
      : state.isFocused ? '#ECEDF0' 
      : 'transparent',
      color: stateDisabled ? '#bfbfbf' :
        state.isSelected ? 'black'  : 
        '#0B7373',
      fontSize: 16,
      fontFamily: 'Roboto',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      cursor: 'pointer',
      color: stateDisabled ? '#bfbfbf' :'#0B7373',
      "&:hover": {
        color: '#0B7373'
      }
    }),
    control: (provided) => ({
      ...provided,
      cursor: 'pointer',
      border: '0.5px #0B7373 solid',
      borderBottom: 'none',
      borderRadius: '20px 20px 0 0',
      background: "#F6F6F7",
      padding: 2,
      "&:hover": {
        background: '#ECEDF0',
        cursor: 'pointer',
        transition: "all 0.1s ease-in-out"
      },
      transition: "all 0.1s ease-in-out"
    }),
    menu: (provided) => ({
      ...provided,
      cursor: 'pointer',
      position: 'static',
      overflowX: 'hidden',
      border:  '0.5px #0B7373 solid',
      margin:0,
      zIndex: 0,
      padding: 0,
      background: "#F6F6F7",
      borderRadius: '0 0 20px 20px',
      color: '#0B7373',
      boxShadow: 'None',
      "&:hover": {
        background: '#F6F6F7',
        cursor: 'pointer',
        transition: "all 0.5s ease-in-out"
      },
      transition: "all 0.5s ease-in-out"
    }),
    singleValue:(provided) => ({
      ...provided,
      cursor: 'pointer',
      height:'100%',
      fontWeight: 700,
      color: stateDisabled ? '#bfbfbf' : '#0B7373',
    })
  }
  const edulistoptions2 = {
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? 900: 100,
      cursor: stateDisabled ? 'not-allowed' : 'pointer',
      background: state.isSelected & stateDisabled ? 'transparent' 
                : state.isSelected & !stateDisabled ? '#008e8593' 
                : state.isFocused ? '#ECEDF0' 
                : 'transparent',
      color: stateDisabled ? '#bfbfbf' 
           : 'black',
      fontSize: 16,
      fontFamily: 'Roboto'
    }),
    control: (provided) => ({
      ...provided,
      marginTop: 20,
      border: '0.5px #008e85 solid',
      borderBottom: 'none',
      borderRadius: '20px 20px 0 0',
      padding: 2,
      "&:hover": {
        background: '#ECEDF0',
        cursor: 'pointer',
        transition: "all 0.1s ease-in-out"
      },
      transition: "all 0.1s ease-in-out"
    }),
    menu: (provided) => ({
      ...provided,
      position: 'static',
      overflowX: 'hidden',
      border: '0.5px #008e85 solid',
      margin:0,
      zIndex: 0,
      padding: 0,
      background: "#F6F6F7",
      borderRadius: '0 0 20px 20px',
      color: '#008e85',
      boxShadow: 'None',
      "&:hover": {
        background: '#F6F6F7',
        cursor: 'pointer',
        transition: "all 0.5s ease-in-out"
      },
      transition: "all 0.5s ease-in-out"
    }),
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      paddingTop:'3px',
      fontWeight: 700
    }),
  }
  const eduselect_attribution1 = {
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected & stateDisabled ? 'transparent' 
                : state.isSelected & !stateDisabled ? '#008e8593' 
                : state.isFocused ? '#ECEDF0' 
                : 'transparent',
      color: stateDisabled ? '#bfbfbf'
      :'black',
      fontSize: 16,
      fontFamily: 'Roboto',
      cursor: 'pointer'
    }),
    control: (provided) => ({
      ...provided,
      marginTop: -5,
      border: '0.5px #008e85 solid',
      borderBottom: 'none',
      borderRadius: '20px 20px 0 0',
      padding: 2,
      "&:hover": {
        background: '#ECEDF0',
        cursor: 'pointer',
        transition: "all 0.1s ease-in-out"
      },
      transition: "all 0.1s ease-in-out"
    }),
    menu: (provided) => ({
      ...provided,
      position: 'static',
      overflowX: 'hidden',
      border: '0.5px #008e85 solid',
      margin:0,
      zIndex: 0,
      padding: 0,
      background: "#F6F6F7",
      borderRadius: '0 0 20px 20px',
      color: '#008e85',
      boxShadow: 'None',
      "&:hover": {
        background: '#F6F6F7',
        cursor: 'pointer',
        transition: "all 0.5s ease-in-out"
      },
      transition: "all 0.5s ease-in-out"
    }),
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      paddingTop:'3px',
      fontWeight: 700
    }),
    multiValue: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'transparent' : '#333333',
      background: state.isDisabled ? 'transparent' : '#E6E6E6'
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'transparent ': '#333333',
    })
  }
  const eduselect_attribution2 = {
    option: (provided, state) => ({
      ...provided,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected & stateDisabled ? 'transparent' 
                : state.isSelected & !stateDisabled ? '#008e8593' 
                : state.isFocused ? '#ECEDF0' 
                : 'transparent',
      color: stateDisabled ? '#bfbfbf' 
           : 'black',
      fontSize: 16,
      fontFamily: 'Roboto'
    }),
    control: (provided) => ({
      ...provided,
      marginTop: -5,
      border: '0.5px #008e85 solid',
      borderBottom: 'none',
      borderRadius: '20px 20px 0 0',
      padding: 2,
      "&:hover": {
        background: '#ECEDF0',
        cursor: 'pointer',
        transition: "all 0.1s ease-in-out"
      },
      transition: "all 0.1s ease-in-out"
    }),
    menu: (provided) => ({
      ...provided,
      position: 'static',
      overflowX: 'hidden',
      border: '0.5px #008e85 solid',
      margin:0,
      zIndex: 0,
      padding: 0,
      background: "#F6F6F7",
      borderRadius: '0 0 20px 20px',
      color: '#008e85',
      boxShadow: 'None',
      "&:hover": {
        background: '#F6F6F7',
        cursor: 'pointer',
        transition: "all 0.5s ease-in-out"
      },
      transition: "all 0.5s ease-in-out"
    }),
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      paddingTop:'3px',
      fontWeight: 700
    }),
    multiValue: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'transparent' : '#333333',
      background: state.isDisabled ? 'transparent' : '#E6E6E6'
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'transparent ': '#333333',
    })
  }
  const manybuttonStyle = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: 'black',
      cursor: 'pointer'
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
      textAlign: 'center',
      padding: 2,
      borderRadius: 10,
      marginBottom: 10,
      fontSize: '16px',
      fontFamily: 'Roboto',
      border: '0.5px #0B7373 solid',
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
      }
    },
    singleValue:(provided) => ({
      ...provided,
      paddingTop:'3px',
      height:'100%',
      color:'#0B7373'
    }),
  }
  const CompStyles = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: state.isDisabled ? 'default' : 'pointer',
      fontWeight: state.isDisabled ? 900 : 300,
      marginLeft: state.isDisabled ? '0px' : '20px',
      paddingTop: state.isDisabled ? '10px' : '0px'
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
  const stateCompStyles = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: state.isDisabled ? 'default' : 'pointer',
      fontWeight: state.isDisabled ? 900 : 300,
      marginLeft: state.isDisabled ? '0px' : '20px',
      paddingTop: state.isDisabled ? '10px' : '0px'
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
  }

  // Create Tab Force Re-Rendering
  const [a_tab, set_A_Tab] = useState(0)

  // Interacting Selections
  const [selected_attributions, setAttributions] = useState('overall')
  const [deaf_labels, setDeafLabels] = useState(['deaf people'])
  const [hear_labels, setHearLabels] = useState(['hearing people'])
  const [multiVariable, setMultiVariable] = useState([{label: 'Overall', value: 'Overall', variable: 'overall', variables: [''],
                                                       deaf: ['deaf people'], hearing: ['hearing people']}])
  const [categories, setCategories] = useState([''])
  const [more_options, setMoreOptions] = useState(' ')
  const [title_by,setTitleBy] = useState('')
  const changeList = (e) => {
    setAttributions(e.variable)
    setMultiVariable(e)
    setCategories(e.variables)
    setDeafLabels(e.deaf)
    setHearLabels(e.hearing)
    if(e.variable === 'overall'){
      setMoreOptions(' ')
      setTitleBy('')
    }else if(e.variable === 'race'){
      setMoreOptions(' Race ')
      setTitleBy(' By Race')
    }else if(e.variable === 'gender'){
      setMoreOptions(' Gender ')
      setTitleBy(' By Gender')
    }else if(e.variable === 'disability'){
      setMoreOptions(' Disability ')
      setTitleBy(' By Disability')
    }else if(e.variable === 'age'){
      setMoreOptions(' Age ')
      setTitleBy(' By Age')
    }
  }

  // Effect of Attributions under React Selection
  const [num_col, setNumCol] = useState([0,6])
  const [bar_col, setBarColor] = useState(['teal', 'black'])
  const [attribute, setAttribution] = useState(['deaf','hearing'])
  const [words, setWords] = useState(['deaf people','hearing people'])
  const [actions, setActions] = useState('...')
  const [multi_attribution, setMultiAttribution] = useState([{label: 'deaf', value: 'deaf', variable: 'overall', color: 'teal', words: 'deaf people'},
  {label: 'hearing', value: 'hearing', variable: 'overall', color: 'black', words: 'hearing people'}])

  const changeAttribution_A = (e, {action}) => {
    setActions(action)
    // Select attribution of group
    if(e.map(x => x.value)?.length  > 2){
      setMultiAttribution(e.filter(x => x.value !== attribute[0]));
      setBarColor(e.filter(x => x.value !== attribute[0]).map(x => x.color))
      setAttribution(e.filter(x => x.value !== attribute[0]).map(x => x.value));
      setWords(e.filter(x => x.value !== attribute[0]).map(x => x.words));
    }else{
      setMultiAttribution(e);
      setBarColor(e.map(x => x.color))
      setAttribution(e.map(x => x.value));  
      setWords(e.map(x => x.words));      
    } 
  }

  // Change colors based on hearing status: hearing = black; deaf = teal
  useEffect(() => {
    if(bar_col[0] === 'black'){
      if(bar_col[1] === 'black'){
        setNumCol([6,8])
      }else{
        setNumCol([6,0])
      }
    }else{
      if(bar_col[1] === 'black'){
        setNumCol([0,6])
      }else{
        setNumCol([0,2])
      }
    }
  }, [bar_col])

  // Text Description
  const [clickedId1, setClickedId1] = useState('accordion-btn active');
  const [symbol1, setSymbol1] = useState('icon-active');
  const [content1, setContent1] = useState('data-accordion-content-active');
  const clickAccordion1 = () => {
    clickedId1 === 'accordion-btn active' ? setClickedId1('accordion-btn') : setClickedId1('accordion-btn active');
    symbol1 === 'icon' ? setSymbol1('icon-active') : setSymbol1('icon');
    content1 === 'data-accordion-content-active' ? setContent1('data-accordion-content') : setContent1('data-accordion-content-active');
  }

  // State Selection
  const [chosen_state, setChosenState] = useState('US');
  const [state_label, setLabel_State] = useState('United States')
  const [multi_state, setMultiState] = useState([{label: 'United States', value: 'United States'}])
  const [year, setYear] = useState(most_recent_year);
  const [in_the, setIn_The] = useState(' In the ');

  const changeEmpState = (e) => {
    setChosenState(e.variable)
    setLabel_State(e.value)
    setMultiState(e)
    if(e.value === 'United States'){
      setIn_The(' In the ')
      setYear(most_recent_year)
    }else{
      setIn_The(' In ')
      setYear((most_recent_year1-4)+'-'+(most_recent_year1))
    }
  }

  const [chosen_state1, setChosenState1] = useState('Texas');
  const [multi_state1, setMultiState1] = useState([  {label: 'Texas', value: 'Texas'}])
  const [year1, setYear1] = useState((most_recent_year1-4)+'-'+(most_recent_year1));
  const [in_the1, setIn_The1] = useState(' In ');

  const changeEmpState1 = (e) => {
    setChosenState1(e.value)
    setMultiState1(e)
    if(e.value === 'United States'){
      setIn_The1(' In the ')
      setYear1(most_recent_year)
    }else{
      setIn_The1(' In ')
      setYear1((most_recent_year1-4)+'-'+(most_recent_year1))
    }
  }

  // Effect of Accordion
  const [clickedId, setClickedId] = useState('accordion-btn');
  const [symbol, setSymbol] = useState('icon');
  const [content, setContent] = useState('data-accordion-content');
  const [tabindex_acc, setTabIndex_Acc] = useState('-1')
  const clickAccordion = () => {
    clickedId === 'accordion-btn active' ? setClickedId('accordion-btn') : setClickedId('accordion-btn active');
    symbol === 'icon' ? setSymbol('icon-active') : setSymbol('icon');
    content === 'data-accordion-content-active' ? setContent('data-accordion-content') : setContent('data-accordion-content-active');
    if(content === 'data-accordion-content'){
      setTabIndex_Acc('0')
    }else{
      setTabIndex_Acc('-1')
    }
  }

  useEffect(()=>{
    if(actions === 'clear'){
      setClickedId('accordion-btn');
      setSymbol('icon');
      setContent('data-accordion-content');
      setTabIndex_Acc('-1');
      setAttribution(['deaf','hearing'])
      setActions('...')
      setMultiAttribution([{label: 'deaf', value: 'deaf', variable: 'overall', color: 'teal', words: 'deaf people'},
      {label: 'hearing', value: 'hearing', variable: 'overall', color: 'black', words: 'hearing people'}])
    }
  },[actions])

  // Svg download symbol
  Highcharts.SVGRenderer.prototype.symbols.download = function (x, y, w, h) {
    var path = [
        // Arrow stem
        'M', x + w * 0.5, y,
        'L', x + w * 0.5, y + h * 0.7,
        // Arrow head
        'M', x + w * 0.3, y + h * 0.5,
        'L', x + w * 0.5, y + h * 0.7,
        'L', x + w * 0.7, y + h * 0.5,
        // Box
        'M', x, y + h * 0.9,
        'L', x, y + h,
        'L', x + w, y + h,
        'L', x + w, y + h * 0.9
    ];
    return path;
  };

  // Education Attainment Selection
  const [isDisabled, setDisabled] = useState(false)
  const [edutitle_by,setEduTitleBy] = useState('')

  // State Comparison Selection
  const [stateLevelTitle, setStateLevelTitle] = useState("Bachelor's Degree Attainment")
  const [stateLevel, setStateLevel] = useState("bachelor")
  const [stateType, setStateType] = useState('education')
  const [multi_comp_state, setMultiCompState] = useState([{label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor'}])
  const [chart_edcomp, setChart_edcomp] = useState('accordionBtn');
  const [chart_edcomp1, setChart_edcomp1] = useState('accordionBtn');
  const [state_age, setStateAge] = useState('25-64');
  const [state_descript, setStateDescript] = useState(' have completed a bachelor’s degree or higher')
  const [state_descript1, setStateDescript1] = useState(' have completed a bachelor’s degree or higher')

  const changeState = (e) => {
    setMultiCompState(e)
    setStateLevelTitle(e.title)
    setStateLevel(e.variable)
    setStateType(e.type)
    setStateAge(e.age)
    setStateDescript(e.description)
    setStateDescript1(e.description1)
  }

  const [stateDisabled, setStateDisabled] = useState(false)

  useEffect(()=> {
    if(content === 'data-accordion-content' && stateLevel !== 'all'){
      setChart_edcomp('accordionBtn')
      setEduTitleBy(title_by)
      setStateDisabled(false)
    }else if(content === 'data-accordion-content-active' && stateLevel !== 'all'){
      setChart_edcomp('accordionBtnActive')
      setEduTitleBy('')
      setStateDisabled(false)
    }else{
      setChart_edcomp('AllLevels')
      setStateDisabled(true)
      setEduTitleBy('')
    }  
  }, [content,stateLevel,title_by])

  useEffect(()=> {
    if(chosen_state === chosen_state1){
      setChart_edcomp1('CompareItself')
    }else{
      setChart_edcomp1(chart_edcomp)
    }  
  }, [chosen_state,chosen_state1,chart_edcomp])

    useLayoutEffect(()=>{
    if(a_tab === 1){
      setYear(most_recent_year)
      setIn_The(' In the ')
    }else if(state_label !== 'United States'){
      setYear((most_recent_year1-4)+'-'+(most_recent_year1))
      setIn_The(' In ')
    }else if(a_tab === 2){
      setYear((most_recent_year1-4)+'-'+(most_recent_year1))
      setIn_The(' In ')
    }else{
      setYear(most_recent_year)
      setIn_The(' In the ')
    }
    setMultiState({label: state_label, value: state_label, variable: chosen_state})
  },[chosen_state,state_label,a_tab])

  useEffect(()=> {
    if(content === 'data-accordion-content' & stateType === 'education' & selected_attributions === 'age'){
      setEduTitleBy(title_by)
      setDisabled(false)
      setCategories(['25-34','35-44','45-54','55-64'])
      setDeafLabels(['deaf people in 25-34 age group',' deaf people in 35-44 age group',
      'deaf people in 45-54 age group','deaf people in 55-64 age group'])
      setHearLabels(['hearing people in 25-34 age group','hearing people in 35-44 age group',
      'hearing people in 45-54 age group','hearing people in 55-64 age group'])
    }else if(content === 'data-accordion-content' & stateType === 'employment' & selected_attributions === 'age'){
      setEduTitleBy(title_by)
      setDisabled(false)
      setCategories(['16-24','25-34','35-44','45-54','55-64'])
      setDeafLabels(['deaf people in 16-24 age group',
      'deaf people in 25-34 age group',' deaf people in 35-44 age group',
      'deaf people in 45-54 age group','deaf people in 55-64 age group'])
      setHearLabels(['hearing people in 16-24 age group',
      'hearing people in 25-34 age group','hearing people in 35-44 age group',
      'hearing people in 45-54 age group','hearing people in 55-64 age group'])
    }else if(content === 'data-accordion-content'){
      setEduTitleBy(title_by)
      setDisabled(false)
    }else if(content === 'data-accordion-content-active'){
      setEduTitleBy('')
      setDisabled(false)
    }else{
      setDisabled(true)
      setEduTitleBy('')
    }  
  }, [content,title_by, stateType, selected_attributions])

  // Size Checker
  const size_checker = function(n){
    if(n < 100){return 'less than 100'}else{return n}
  }

  // Switch from and to US Map
  const [USmap, setUSmap] = useState('notmap')

  const switchtoUSMap = () => {
    if(USmap === 'notmap'){
      setUSmap('map')
    }else{
      setUSmap('notmap')
    }
  }

  // Demographics
  let overall_demographics = {
    chart:{
      type: 'pie',
      width: HCwidth,
      height: 330
    },
    legend: {
      labelFormat: '{name}',
      align: 'center',
      verticalAlign: 'top'
    },
    title: {
      text: ""
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
          [['deaf', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'overall' & employment.state === state_label &
              employment.attribution === 'deaf').map(
              employment => employment.percentage)[0], colorfill[0],colorfill[0],1],
           ['hearing', 100-employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'overall' & employment.state === state_label &
              employment.attribution === 'deaf').map(
              employment => employment.percentage)[0], colorfill[6],colorfill[6],1]
          ],
        dataLabels: {
            enabled: true,
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
  let deaf_demographics = {
    chart:{
      type: 'pie',
      height: 330,
      width: pie_width
    },
    legend: {
      labelFormat: '<span style="color:#949494">{y}%</span> {name}',
      align: 'center',
      verticalAlign: 'bottom'
    },
    title: {
      text: ""
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
      data: {
        age:
          [['deaf: ages 16-24', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'deaf: ages 16-24').map(
              employment => employment.percentage)[0], colorfill[0],colorfill[0],1],
           ['deaf: ages 25-34', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'deaf: ages 25-34').map(
              employment => employment.percentage)[0], colorfill[1],colorfill[0],1],
           ['deaf: ages 35-44', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'deaf: ages 35-44').map(
              employment => employment.percentage)[0], colorfill[2],colorfill[0],1],
           ['deaf: ages 45-54', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'deaf: ages 45-54').map(
              employment => employment.percentage)[0], colorfill[3],colorfill[0],1],
           ['deaf: ages 55-64', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'deaf: ages 55-64').map(
              employment => employment.percentage)[0], colorfill[4],colorfill[0],1]],
        race:
          [['deaf Asian', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'deaf Asian').map(
              employment => employment.percentage)[0], colorfill[0],colorfill[0],1],
           ['deaf Black', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'deaf Black').map(
              employment => employment.percentage)[0], colorfill[1],colorfill[0],1],
           ['deaf Latinx', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'deaf Latinx').map(
              employment => employment.percentage)[0], colorfill[2],colorfill[0],1],
           ['deaf Native American', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'deaf Native American').map(
              employment => employment.percentage)[0], colorfill[3],colorfill[0],1],
           ['deaf multiracial', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'deaf multiracial').map(
              employment => employment.percentage)[0], colorfill[4],colorfill[0],1],
           ['deaf white', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'deaf white').map(
              employment => employment.percentage)[0], colorfill[5],colorfill[0],1]],
        gender:
          [['deaf women', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'gender' & employment.state === state_label &
              employment.attribution === 'deaf women').map(
              employment => employment.percentage)[0], colorfill[0],colorfill[0],1],
            ['deaf men', 100-employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'gender' & employment.state === state_label &
              employment.attribution === 'deaf women').map(
              employment => employment.percentage)[0], colorfill[1],colorfill[0],1]],
        disability:
          [['deaf with no additional disabilities', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'disability' & employment.state === state_label &
              employment.attribution === 'deaf with no additional disabilities').map(
              employment => employment.percentage)[0], colorfill[0],colorfill[0],1],
           ['deafdisabled', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'disability' & employment.state === state_label &
              employment.attribution === 'deafdisabled').map(
              employment => employment.percentage)[0], colorfill[1],colorfill[0],1],
           ['deafblind', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'disability' & employment.state === state_label &
              employment.attribution === 'deafblind').map(
              employment => employment.percentage)[0], colorfill[2],colorfill[0],1]]
        }[selected_attributions],
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
  let hearing_demographics = {
    chart:{
      type: 'pie',
      height: 330,
      width: pie_width
    },
    legend: {
      labelFormat: '<span style="color:#949494">{y}%</span> {name}',
      align: 'center',
      verticalAlign: 'bottom',
    },
    title: {
      text: ""
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
      data: {
        age:
          [['hearing: ages 16-24', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'hearing: ages 16-24').map(
              employment => employment.percentage)[0], colorfill[6],colorfill[6],1],
           ['hearing: ages 25-34', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'hearing: ages 25-34').map(
              employment => employment.percentage)[0], colorfill[7],colorfill[6],1],
           ['hearing: ages 35-44', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'hearing: ages 35-44').map(
              employment => employment.percentage)[0], colorfill[8],colorfill[6],1],
           ['hearing: ages 45-54', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'hearing: ages 45-54').map(
              employment => employment.percentage)[0], 'url(#black)',colorfill[6],1],
           ['hearing: ages 55-64', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'age' & employment.state === state_label &
              employment.attribution === 'hearing: ages 55-64').map(
              employment => employment.percentage)[0], 'url(#black1)',colorfill[6],1]],
        race:
          [['hearing Asian', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'hearing Asian').map(
              employment => employment.percentage)[0], colorfill[6],colorfill[6],1],
           ['hearing Black', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'hearing Black').map(
              employment => employment.percentage)[0], colorfill[7],colorfill[6],1],
           ['hearing Latinx', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'hearing Latinx').map(
              employment => employment.percentage)[0], colorfill[8],colorfill[6],1],
           ['hearing Native American', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'hearing Native American').map(
              employment => employment.percentage)[0], 'url(#black)',colorfill[6],1],
           ['hearing multiracial', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'hearing multiracial').map(
              employment => employment.percentage)[0], 'url(#black1)',colorfill[6],1],
           ['hearing white', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'race' & employment.state === state_label &
              employment.attribution === 'hearing white').map(
              employment => employment.percentage)[0], 'url(#black2)',colorfill[6],1]],
        gender:
          [['hearing women', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'gender' & employment.state === state_label &
              employment.attribution === 'hearing women').map(
              employment => employment.percentage)[0], colorfill[6],colorfill[6],1],
            ['hearing men', 100-employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'gender' & employment.state === state_label &
              employment.attribution === 'hearing women').map(
              employment => employment.percentage)[0], colorfill[7],colorfill[6],1]],
        disability:
          [['hearing with no additional disabilities', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'disability' & employment.state === state_label &
              employment.attribution === 'hearing with no additional disabilities').map(
              employment => employment.percentage)[0], colorfill[6],colorfill[6],1],
           ['hearing disabled', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'disability' & employment.state === state_label &
              employment.attribution === 'hearing disabled').map(
              employment => employment.percentage)[0], colorfill[7],colorfill[6],1],
           ['hearing blind', employment.filter(employment => employment.type === 'population' & 
              employment.variable === 'disability' & employment.state === state_label &
              employment.attribution === 'hearing blind').map(
              employment => employment.percentage)[0], colorfill[8],colorfill[6],1]]

        }[selected_attributions],
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

  // Employment Chart
  let nation = {
    chart:{
      type: 'column',
      width: HCwidth,
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
      categories: ['United States'],
      visible: false,
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.type === stateType & 
        employment.state === 'United States' &
        (employment.attribution === attribute[0] | employment.attribution === attribute[1]) &
        employment.status === stateLevel).map(
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
      pointFormat: '{categories}<br>{series.name}: <b>{point.y:.1f}%</b></br>',
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
            (employment.filter(employment => employment.type === stateType & 
              employment.variable === selected_attributions & employment.state === 'United States' &
              employment.status === stateLevel & employment.percentage === this.y & employment.attribution.includes(this.series.name)).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            return '\u26a0'+this.y + '%'
          }else{
            return this.y + '%';
          }
        },
        }
      }
    },
    series: [{
      showInLegend: true,
      name: attribute[0],
      color: colorfill[num_col[0]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[0] & 
        employment.status === stateLevel &  
        employment.type === stateType & 
        employment.state === 'United States').map(employment => [0,employment.percentage])
    },
    { showInLegend: true,
      name: attribute[1],
      color: colorfill[num_col[1]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[1] & 
        employment.status === stateLevel & 
        employment.type === stateType & 
        employment.state === 'United States').map(employment => [0,employment.percentage])
    }],
    exporting: {
      allowHTML: true,
      sourceWidth: 1200,
      sourceHeight: 600,
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '18px'
              }
            }
          }
        },
        title: {
          text: stateLevelTitle+edutitle_by+' in the United States, '+year,
          align: 'left',
          y: 50,
          margin:50,
          widthadjust: -200,
          style: {
            color: '#787878',
            fontWeight: 700,
            fontSize: '23px',
            fontFamily: 'Roboto',
            marginRight: 20,
          }
        },
        subtitle: {
          text: 'In the United States, among people aged '+state_age+', an estimated '+
          employment.filter(employment => employment.attribution === attribute[0] & 
            employment.status === stateLevel &  
            employment.type === stateType & 
            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
            )
            +
          words[0]+state_descript+', compared to '+
          employment.filter(employment => employment.attribution === attribute[1] & 
            employment.status === stateLevel &  
            employment.type === stateType & 
            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
            )+
          words[1]+'.<br><br>In this chart, estimates are based on a sample size of '+
          size_checker(employment.filter(employment => employment.type === stateType & 
          employment.attribution === attribute[0] & 
          employment.state === 'United States' &
          employment.status === stateLevel).map(employment => employment.n).reduce(
            (sum, a) => sum + a, 0)).toLocaleString('en-US')+' '+words[0]+' and '+
          size_checker(employment.filter(employment => employment.type === stateType & 
          employment.attribution === attribute[1] & 
          employment.state === 'United States' &
          employment.status === stateLevel).map(employment => employment.n).reduce(
            (sum, a) => sum + a, 0)).toLocaleString('en-US')+' '+words[1]+
          ' in the United States who participated in the '+year+' American Community Survey. The margin of errors are '+
          employment.filter(employment =>
            employment.attribution === attribute[0] & 
            employment.status === stateLevel & 
            employment.type === stateType & 
            employment.state === 'United States').map(
            employment => employment.margin_errors)+
          '% for '+words[0]+' and '+
          employment.filter(employment =>
            employment.attribution === attribute[1] & 
            employment.status === stateLevel & 
            employment.type === stateType & 
            employment.state === 'United States').map(
            employment => employment.margin_errors)+
          '% for '+words[1]+'.<br><br><br>'+citation[0]+' '+citation[1],
          style: {
            fontSize: '12px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: 12
        },
        chart: {
          events: {
            render() {
              const chart = this,
                width = 130;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  10, //y
                  2.37216657881*50, //width
                  50//height
              ).add();
            }
          }
        }
      }
    }
  };
  let nation_variable_only = {
    chart:{
      type: 'column',
      width: HCwidth,
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
      categories: categories.map(word => word.charAt(0).toUpperCase()+word.substring(1)),
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
      max: 1+Math.max(...employment.filter(employment => employment.type === stateType & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === stateLevel).map(
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
              (employment.filter(employment => employment.type === stateType & 
                employment.variable === selected_attributions & employment.state === 'United States' &
                employment.status === stateLevel & employment.percentage === this.y & employment.attribution.includes(this.series.name)).map(
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
      data: employment.filter(employment => employment.type === stateType & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === stateLevel & employment.attribution.includes('deaf')).map(
        employment => [employment.index,employment.percentage])
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === stateType & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === stateLevel & employment.attribution.includes('hearing')).map(
        employment => [employment.index,employment.percentage])
    }],
    exporting: {
      allowHTML: true,
      sourceWidth: 1200,
      sourceHeight: 600,
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '18px'
              }
            }
          }
        },
        title: {
          text: stateLevelTitle+edutitle_by+' in the United States, '+year,
          align: 'left',
          y: 50,
          margin:50,
          widthadjust: -200,
          style: {
            color: '#787878',
            fontWeight: 700,
            fontSize: '23px',
            fontFamily: 'Roboto',
            marginRight: 20,
          }
        },
        subtitle: {
          text: 'In the United States, among people aged '+state_age+', an estimated'+
          employment.filter(employment => employment.type === stateType & 
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === stateLevel & employment.attribution.includes('deaf')).map(
            function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
            ' and '+
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
            deaf_labels[employment.index] : ' '+ 
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
            deaf_labels[employment.index]})+
          state_descript+', compared to '+
          employment.filter(employment => employment.type === stateType & 
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === stateLevel & employment.attribution.includes('hearing')).map(
            function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
            ' and '+
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
            hear_labels[employment.index] : ' '+
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
            hear_labels[employment.index]})+
          '.<br><br>In this chart, estimates are based on a sample size of '+
          size_checker(employment.filter(employment => employment.type === stateType & 
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === stateLevel & employment.attribution.includes('deaf')).map(
            employment => employment.n).reduce(
              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
          ' deaf people and '+
          size_checker(employment.filter(employment => employment.type === stateType & 
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === stateLevel & employment.attribution.includes('hearing')).map(
            employment => employment.n).reduce(
              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
          ' hearing people in the United States who participated in the '+year+
          ' American Community Survey. The margin of errors are '+
          employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status === stateLevel & 
            employment.type === stateType & 
            employment.state === 'United States').map(
            employment => employment.margin_errors)+
          '% for deaf people and '+
          employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status === stateLevel & 
            employment.type === stateType & 
            employment.state === 'United States').map(employment => employment.margin_errors)+
          '% for hearing people.<br><br><br>'+citation[0]+' '+citation[1],
          style: {
            fontSize: '12px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: 12
        },
        chart: {
          events: {
            render() {
              const chart = this,
                width = 130;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  10, //y
                  2.37216657881*50, //width
                  50//height
              ).add();
            }
          }
        }
      }
    }
  };
  let nation_all = {
    chart:{
      type: 'column',
      width: HCwidth,
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
      categories: ['High School','Some College',"Associate's","Bachelor's","Master's","PhD, JD or MD"],
      visible: true,
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      accessibility:{
        description: attribute.map(function(a){return(' '+a)})+' categories'
      }
    },
    yAxis: {
      min: 0,
      max: 100,
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
        return this.x+'<br><br>'+this.series.name+': <b>'+this.y+'%</b>'
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
              (employment.filter(employment => employment.attribution === 'deaf' & 
              employment.status !== 'no HS diploma' &  
              employment.type === 'education' & 
              employment.state === 'United States' &
              employment.percentage === this.y).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
            ){
              return '\u26a0'+this.y + '%'
            }else{
              return this.y + '%';
            }
          },
        }
      }
    },
    series: [{
      showInLegend: true,
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'deaf' & 
        employment.status !== 'no HS diploma' &  
        employment.type === 'education' & 
        employment.state === 'United States').map(employment => employment.percentage).reverse()
    },
    { showInLegend: true,
      name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'hearing' & 
        employment.status !== 'no HS diploma' & 
        employment.type === 'education' & 
        employment.state === 'United States').map(employment => employment.percentage).reverse()
    }],
    exporting: {
      allowHTML: true,
      sourceWidth: 1200,
      sourceHeight: 600,
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '18px'
              }
            }
          }
        },
        title: {
          text: stateLevelTitle+edutitle_by+' in the United States, '+year,
          align: 'left',
          y: 50,
          margin:50,
          widthadjust: -200,
          style: {
            color: '#787878',
            fontWeight: 700,
            fontSize: '23px',
            fontFamily: 'Roboto',
            marginRight: 20,
          }
        },
        subtitle: {
          text: 'In the United States, among people aged '+state_age+', an estimated'+
          employment.filter(employment => employment.attribution === 'deaf' & 
          employment.status !== 'no HS diploma' &  
          employment.type === 'education' & 
          employment.state === 'United States').map(
            function(employment, index){ return index === 0 ? 
            ' and '+
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
            edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
            edulist[index] :
            ' '+employment.percentage+'% '+edulist[index]}).reverse()+
          ', compared to '+
          employment.filter(employment => employment.attribution === 'hearing' & 
          employment.status !== 'no HS diploma' & 
          employment.type === 'education' & 
          employment.state === 'United States').map(
            function(employment, index){ return index === 0 ? 
            ' and '+
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
            edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
            (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
            edulist[index] :
            ' '+employment.percentage+'% '+edulist[index]}).reverse()+
          '.<br><br>In this chart, estimates are based on a sample size of '+
          size_checker(employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status === 'no HS diploma' & employment.type === 'education' & 
            employment.state === 'United States').map(employment => employment.n).reduce(
              (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
          size_checker(employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status === 'no HS diploma' & employment.type === 'education' & 
            employment.state === 'United States').map(employment => employment.n).reduce(
              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
          ' hearing people in the United States who participated in the American Community '+year+
          ' American Community Survey. The margin of errors are between '+
          employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status === 'phd/dr' & 
            employment.type === 'education' & 
            employment.state === 'United States').map(
            employment => employment.margin_errors)+
          '% and '+
          employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status === 'HS diploma' & 
            employment.type === 'education' & 
            employment.state === 'United States').map(
            employment => employment.margin_errors)+
          '% for deaf people, and between '+
          employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status === 'phd/dr' & 
            employment.type === 'education' & 
            employment.state === 'United States').map(employment => employment.margin_errors)+
          '% and '+
          employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status === 'HS diploma' & 
            employment.type === 'education' & 
            employment.state === 'United States').map(employment => employment.margin_errors)+
          '% for hearing people.<br><br><br>'+citation[0]+' '+citation[1],
          style: {
            fontSize: '12px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: 12
        },
        chart: {
          events: {
            render() {
              const chart = this,
                width = 130;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  10, //y
                  2.37216657881*50, //width
                  50//height
              ).add();
            }
          }
        }
      }
    }
  };

  // Comparison Chart
  let state = {
    chart:{
      type: 'column',
      height: 330,
      inverted: true      
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: ['United States'],
      visible: false,
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.type === stateType & 
        (employment.state === chosen_state | employment.state === chosen_state1) &
        (employment.attribution === attribute[0] | employment.attribution === attribute[1]) &
        employment.status === stateLevel).map(
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
            (employment.filter(employment => (employment.attribution === attribute[0] | 
              employment.attribution === attribute[1]) & 
              employment.status === stateLevel &  
              employment.type === stateType & 
              employment.state === chosen_state & employment.attribution.includes(this.series.name)).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            return '\u26a0'+this.y + '%'
          }else{
            return this.y + '%';
          }
        },
        }
      }
    },
    series: [{
      showInLegend: true,
      name: attribute[0],
      color: colorfill[num_col[0]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[0] & 
        employment.status === stateLevel &  
        employment.type === stateType & 
        employment.state === chosen_state).map(employment => [0,employment.percentage])
    },
    { showInLegend: true,
      name: attribute[1],
      color: colorfill[num_col[1]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[1] & 
        employment.status === stateLevel & 
        employment.type === stateType & 
        employment.state === chosen_state).map(employment => [0,employment.percentage])
    }],
    exporting: {
      enabled: false 
    }
  };
  let state_variable_only = {
    chart:{
      type: 'column',
      height: 330,
      inverted: true
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: categories.map(word => word.charAt(0).toUpperCase()+word.substring(1)),
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
      max: 1+Math.max(...employment.filter(employment => employment.type === stateType & 
      employment.variable === selected_attributions & (employment.state === chosen_state |
      employment.state === chosen_state1) &
      employment.status === stateLevel).map(
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
              (employment.filter(employment => employment.type === stateType & 
              employment.variable === selected_attributions & employment.state === chosen_state &
              employment.status === stateLevel & employment.percentage === this.y & employment.attribution.includes(this.series.name)).map(
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
      data: employment.filter(employment => employment.type === stateType & 
        employment.variable === selected_attributions & employment.state === chosen_state &
        employment.status === stateLevel & employment.attribution.includes('deaf')).map(
        employment => [employment.index,employment.percentage])
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === stateType & 
        employment.variable === selected_attributions & employment.state === chosen_state &
        employment.status === stateLevel & employment.attribution.includes('hearing')).map(
        employment => [employment.index,employment.percentage])
    }],
    exporting: { 
      enabled: false 
    }
  };

  let state1 = {
    chart:{
      type: 'column',
      height: 330,
      inverted: true
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: ['United States'],
      visible: false,
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.type === stateType & 
        (employment.state === chosen_state | employment.state === chosen_state1) &
        (employment.attribution === attribute[0] | employment.attribution === attribute[1]) &
        employment.status === stateLevel).map(
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
            (employment.filter(employment => (employment.attribution === attribute[0] | 
              employment.attribution === attribute[1]) & 
              employment.status === stateLevel &  
              employment.type === stateType & 
              employment.state === chosen_state1 & employment.attribution.includes(this.series.name)).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            return '\u26a0'+this.y + '%'
          }else{
            return this.y + '%';
          }
        },
        }
      }
    },
    series: [{
      showInLegend: true,
      name: attribute[0],
      color: colorfill[num_col[0]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[0] & 
        employment.status === stateLevel &  
        employment.type === stateType & 
        employment.state === chosen_state1).map(employment => [0,employment.percentage])
    },
    { showInLegend: true,
      name: attribute[1],
      color: colorfill[num_col[1]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[1] & 
        employment.status === stateLevel & 
        employment.type === stateType & 
        employment.state === chosen_state1).map(employment => [0,employment.percentage])
    }],
    exporting: { 
      enabled: false 
    }
  };
  let state_variable_only1 = {
    chart:{
      type: 'column',
      height: 330,
      inverted: true
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: categories.map(word => word.charAt(0).toUpperCase()+word.substring(1)),
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
      max: 1+Math.max(...employment.filter(employment => employment.type === stateType & 
      employment.variable === selected_attributions & (employment.state === chosen_state |
      employment.state === chosen_state1) &
      employment.status === stateLevel).map(
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
              (employment.filter(employment => employment.type === stateType & 
              employment.variable === selected_attributions & employment.state === chosen_state1 &
              employment.status === stateLevel & employment.percentage === this.y & employment.attribution.includes(this.series.name)).map(
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
      data: employment.filter(employment => employment.type === stateType & 
        employment.variable === selected_attributions & employment.state === chosen_state1 &
        employment.status === stateLevel & employment.attribution.includes('deaf')).map(
        employment => [employment.index,employment.percentage])
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === stateType & 
        employment.variable === selected_attributions & employment.state === chosen_state1 &
        employment.status === stateLevel & employment.attribution.includes('hearing')).map(
        employment => [employment.index,employment.percentage])
    }],
    exporting: { 
      enabled: false 
    }
  };

  let stateall = {
    chart:{
      type: 'column',
      height: 330,
      inverted: true
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: ['High School','Some College',"Associate's","Bachelor's","Master's","PhD, JD or MD"],
      visible: true,
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      accessibility:{
        description: attribute.map(function(a){return(' '+a)})+' categories'
      }
    },
    yAxis: {
      min: 0,
      max: 100,
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
        return this.x+'<br><br>'+this.series.name+': <b>'+this.y+'%</b>'
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
              (employment.filter(employment => employment.attribution === 'deaf' & 
              employment.status !== 'no HS diploma' &  
              employment.type === 'education' & 
              employment.state === chosen_state &
              employment.percentage === this.y).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
            ){
              return '\u26a0'+this.y + '%'
            }else{
              return this.y + '%';
            }
          },
        },
        point: {
          events: {
            click: function () {
              window.location.href = this.series.options.website;
            }
          }
        },
        cursor: 'pointer'
      }
    },
    series: [{
      showInLegend: true,
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'deaf' & 
        employment.status !== 'no HS diploma' &  
        employment.type === 'education' & 
        employment.state === chosen_state).map(employment => employment.percentage).reverse()
    },
    { showInLegend: true,
      name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'hearing' & 
        employment.status !== 'no HS diploma' & 
        employment.type === 'education' & 
        employment.state === chosen_state).map(employment => employment.percentage).reverse()
    }],
    exporting: { 
      enabled: false 
    }
  };
  let stateall1 = {
    chart:{
      type: 'column',
      height: 330,
      inverted: true
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: ['High School','Some College',"Associate's","Bachelor's","Master's","PhD, JD or MD"],
      visible: true,
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      accessibility:{
        description: attribute.map(function(a){return(' '+a)})+' categories'
      }
    },
    yAxis: {
      min: 0,
      max: 100,
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
        return this.x+'<br><br>'+this.series.name+': <b>'+this.y+'%</b>'
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
              (employment.filter(employment => employment.attribution === 'deaf' & 
              employment.status !== 'no HS diploma' &  
              employment.type === 'education' & 
              employment.state === chosen_state1 &
              employment.percentage === this.y).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
            ){
              return '\u26a0'+this.y + '%'
            }else{
              return this.y + '%';
            }
          },
        },
        point: {
          events: {
            click: function () {
              window.location.href = this.series.options.website;
            }
          }
        },
        cursor: 'pointer'
      }
    },
    series: [{
      showInLegend: true,
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'deaf' & 
        employment.status !== 'no HS diploma' &  
        employment.type === 'education' & 
        employment.state === chosen_state1).map(employment => employment.percentage).reverse()
    },
    { showInLegend: true,
      name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'hearing' & 
        employment.status !== 'no HS diploma' & 
        employment.type === 'education' & 
        employment.state === chosen_state1).map(employment => employment.percentage).reverse()
    }],
    exporting: { 
      enabled: false 
    }
  };
  
  // USMap function
  const translate = {x: 0,y: 5};

  // Zoom function
  const svgViewportWidth = 965;
  const svgViewportHeight = 650;
  const { containerHeight, containerWidth } = [0,0];

  //Write HTML d scripts
  return ( 
    <>
      <div className="body">
        <div className = 'container'>
          <div className = 'main-grid'>
            <div className = 'main-a'>
              <div id = 'title'>
                Deaf Postsecondary Data from the American Community Survey ({year}) <i id = 'beta'>BETA</i>
              </div>
            </div>  
            <div className = 'main-b'>                
            </div>
          </div>
          <Tabs onSelect={tabIndex => set_A_Tab(tabIndex)}>
            <TabList aria-label="Education and Employment Tabs">
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}} aria-label='Demographics Interactive Statistics'>{'Demographics'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}} aria-label='National Level Interactive Chart'>{'National Level'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}} aria-label='State Level Interactive Charts'>{'State Level'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'About Dashboard'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            </TabList>
            <TabPanel>
              <div className='inside_container'>
                <p className='aria-text'>Left Content</p>
                <p className='aria-text'>
                  This content contains the United States map with title.
                </p>
                <p className='aria-text'>
                  When you select any options, this will change description.
                </p>
                <p className='aria-text'>Beginning of Interactive Chart</p>
                <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} aria-hidden="true">
                  <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                </button>
                <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}}>
                  <div className='data_sidebar_interface' aria-hidden = 'true'>
                    <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = '-1'>
                      <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                    </button>
                    <div className="select-container">
                      <button className="select-left-button1" onClick = {switchtoUSMap}>
                        <FontAwesome name = 'map' className = 'icon_style'/>
                      </button>
                      <div className = 'select-right'>
                        <Select styles={customStyles1}
                        value = {multi_state}
                        options = {thelist}
                        tabIndex = {tabindex}
                        isSearchable = {searchable}
                        onChange = {changeEmpState}
                        />
                      </div>
                    </div>
                    <Select 
                    styles={listoptions1}
                    value = {multiVariable}
                    menuIsOpen={true}
                    tabIndex = {tabindex}
                    onChange = {changeList}
                    options = {variables}
                    isSearchable = {false}
                    />
                    <div style={{marginBottom:60}}></div>
                  </div>
                </div>
                <div className={data_grid}>
                  <div className='a'>
                    <div className = 'title' aria-hidden = 'true'>{'DEAF DEMOGRAPHICS: '+state_label.toUpperCase()}</div>
                    <div className = 'aria-text'>{'Title - Deaf Demographics: '+state_label}</div>
                    {
                      {
                        map: 
                          <>
                          <button className='usmap-close' onClick={switchtoUSMap}>
                            X
                          </button>
                          <div style={{marginLeft: 'auto',marginRight: 'auto',marginTop: '20px',
                                        width: 'auto', padding: '10px', maxWidth: '500px',maxHeight: '500px'}}>
                            <div style={{overflow:'hidden', height: 300, width: 'auto'}}>
                              <svg viewBox={[0, 0, svgViewportWidth, svgViewportHeight].join(' ')} width={containerWidth}
                                height={containerHeight} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
                                  {usmap.map((stateData, index) =>
                                    <a href={'/#location: '+stateData.id}>
                                      <path
                                      className="map_path"
                                      style={{cursor: "pointer"}}
                                      key={index+'a'}
                                      stroke="#fff"
                                      strokeWidth="3px"
                                      d={stateData.shape}
                                      onClick={() => {
                                        setLabel_State(usmap.map(usmap => usmap.name)[index])
                                        setChosenState(usmap.map(usmap => usmap.name)[index])
                                        }
                                      }
                                      />
                                    <rect style={{cursor: "pointer", display: stateData.display}}
                                    className = "map_rect"
                                    rx='5' ry='5'
                                    key = {index+'b'}
                                    onClick={() => {
                                      setLabel_State(usmap.map(usmap => usmap.name)[index])
                                      setChosenState(usmap.map(usmap => usmap.name)[index])
                                      }
                                    }
                                    x={stateData.xend} y={stateData.yend} 
                                    height="30" width="55"/>
                                    <line className = "map_line"
                                    x1={stateData.firstx} y1={stateData.firsty} 
                                    x2={stateData.secondx} y2={stateData.secondy}
                                    style={{cursor: "pointer", display: stateData.display,strokeWidth:"3"}}/>
                                    <line className = "map_line"
                                    x1={stateData.secondx} y1={stateData.secondy} 
                                    x2={stateData.thirdx} y2={stateData.thirdy}
                                    style={{cursor: "pointer", display: stateData.display,strokeWidth:"3"}}/>
                                    <line className = "map_line"
                                    x1={stateData.thirdx} y1={stateData.thirdy} 
                                    x2={stateData.fourthx} y2={stateData.fourthy}
                                    style={{cursor: "pointer", display: stateData.display1,strokeWidth:"3"}}/>
                                    <text className = 'map_text'
                                    key = {index+'c'}
                                    onClick={() => {
                                      setLabel_State(usmap.map(usmap => usmap.name)[index])
                                      setChosenState(usmap.map(usmap => usmap.name)[index])
                                      }
                                    }
                                    style={{cursor: "pointer"}}
                                    x={stateData.X} 
                                    y={stateData.Y}>
                                      {stateData.id}
                                    </text></a>
                                  )
                                  }
                              </svg>
                            </div>
                          </div>
                          </>,
                        notmap: 
                        {
                          overall: 
                            <>
                              <div style={{displays:'contents'}}>
                                <HighchartsReact highcharts={Highcharts} options={overall_demographics}/>
                              </div>
                            </>,
                          age:
                            <div className='subgrid'>
                              <div className='subgrid_a'>
                                <HighchartsReact highcharts={Highcharts} options={deaf_demographics}/>
                              </div>
                              <div className = 'subgrid_b'>
                                <HighchartsReact highcharts={Highcharts} options={hearing_demographics}/>
                              </div>
                            </div>,
                          race:
                            <div className='subgrid'>
                              <div className='subgrid_a'>
                                <HighchartsReact highcharts={Highcharts} options={deaf_demographics}/>
                              </div>
                              <div className = 'subgrid_b'>
                                <HighchartsReact highcharts={Highcharts} options={hearing_demographics}/>
                              </div>
                            </div>,
                          gender:
                            <div className='subgrid'>
                              <div className='subgrid_a'>
                                <HighchartsReact highcharts={Highcharts} options={deaf_demographics}/>
                              </div>
                              <div className = 'subgrid_b'>
                                <HighchartsReact highcharts={Highcharts} options={hearing_demographics}/>
                              </div>
                            </div>,
                          disability:
                            <div className='subgrid'>
                              <div className='subgrid_a'>
                                <HighchartsReact highcharts={Highcharts} options={deaf_demographics}/>
                              </div>
                              <div className = 'subgrid_b'>
                                <HighchartsReact highcharts={Highcharts} options={hearing_demographics}/>
                              </div>
                            </div>
                        }[selected_attributions]
                      }[USmap]
                    }
                    <p className='aria-text'>Description:</p>
                    <ContentDowndrop buttonLabel = '' 
                      clickedId = {clickedId1}
                      symbol = {symbol1}
                      content = {content1}
                      tabIndex = {tabindex}
                      background = '#ffffff'
                      your_color = '#008e84'
                      textwidth = 'text-contain'
                      onClick = {clickAccordion1}
                      textContent = {
                        {
                          overall:
                            'Among people aged 16-64, an estimated '+
                            employment.filter(employment => employment.type === 'population' & 
                              employment.variable === 'overall' & employment.state === state_label &
                              employment.attribution === 'deaf').map(
                              employment => employment.percentage)+'% of the population'+in_the.toLowerCase()+state_label+
                            ' is deaf. In other words, there are '+
                            employment.filter(employment => employment.type === 'population' & 
                              employment.variable === 'overall' & employment.state === state_label &
                              employment.attribution === 'deaf').map(
                              employment => employment.n).toLocaleString('en-US')+' deaf people living'+
                              in_the.toLowerCase()+state_label+'.',
                          age:
                            in_the+state_label+', among deaf people aged 16-64, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'age' & employment.state === state_label &
                            employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (demo_age[demo_age.length-1] === demo_age[employment.index]) ?
                                ' and '+employment.percentage+'% are '+demo_age[employment.index] :
                                ' '+employment.percentage+'% are '+demo_age[employment.index+1]
                              }
                            )+'. Among hearing people, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'age' & employment.state === state_label &
                            employment.attribution.includes('hearing')).map(
                              function(employment,index){ return (demo_age[demo_age.length-1] === demo_age[employment.index]) ?
                                ' and '+employment.percentage+'% are '+demo_age[employment.index] :
                                ' '+employment.percentage+'% are '+demo_age[employment.index+1]
                              }
                            )+'.',
                          race:
                            in_the+state_label+', among deaf people aged 16-64, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'race' & employment.state === state_label &
                            employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (demo_rac[demo_rac.length-1] === demo_rac[employment.index]) ?
                                ' and '+employment.percentage+'% are '+demo_rac[employment.index] :
                                ' '+employment.percentage+'% are '+demo_rac[employment.index]
                              }
                            )+'. Among hearing people, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'race' & employment.state === state_label &
                            employment.attribution.includes('hearing')).map(
                              function(employment,index){ return (demo_rac[demo_rac.length-1] === demo_rac[employment.index]) ?
                                ' and '+employment.percentage+'% are '+demo_rac[employment.index] :
                                ' '+employment.percentage+'% are '+demo_rac[employment.index]
                              }
                            )+'.',
                          gender:
                            in_the+state_label+', among deaf people aged 16-64, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'gender' & employment.state === state_label &
                            employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (demo_gen[demo_gen.length-1] === demo_gen[employment.index]) ?
                                ' and '+employment.percentage+'% are '+demo_gen[employment.index] :
                                ' '+employment.percentage+'% are '+demo_gen[employment.index]
                              }
                            )+'. Among hearing people, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'gender' & employment.state === state_label &
                            employment.attribution.includes('hearing')).map(
                              function(employment,index){ return (demo_gen[demo_gen.length-1] === demo_gen[employment.index]) ?
                                ' and '+employment.percentage+'% are '+demo_gen[employment.index] :
                                ' '+employment.percentage+'% are '+demo_gen[employment.index]
                              }
                            )+'.',
                          disability:
                            in_the+state_label+', among deaf people aged 16-64, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'disability' & employment.state === state_label &
                            employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (deaf_dis[deaf_dis.length-1] === deaf_dis[employment.index]) ?
                                ' and '+employment.percentage+'% are '+deaf_dis[employment.index] :
                                ' '+employment.percentage+'% are '+deaf_dis[employment.index]
                              }
                            )+'. Among hearing people, an estimated '+
                            employment.filter(employment => employment.type === 'population' &
                            employment.variable === 'disability' & employment.state === state_label &
                            employment.attribution.includes('hearing')).map(
                              function(employment,index){ return (hear_dis[hear_dis.length-1] === hear_dis[employment.index]) ?
                                ' and '+employment.percentage+'% are '+hear_dis[employment.index] :
                                ' '+employment.percentage+'% are '+hear_dis[employment.index]
                              }
                            )+'.'
                        }[selected_attributions]
                      }
                    />
                  </div>
                  <div className='b' style={{display:interface_side}}>
                    <p className='aria-text'>Right Content</p>
                    <p className='aria-text'>
                      This content consists of 2 selection options: 50 states plus United States and Washington D.C., 
                      AND four categories (i.e. AGE, race, gender, and disability).
                    </p>
                    <p className='aria-text'>
                      When you select any of these options, this will also affect description.
                    </p>
                    <div className="select-container">
                      <button className="select-left-button" onClick = {switchtoUSMap}>
                        <FontAwesome name = 'map' className = 'icon_style'/>
                      </button>
                      <div className = 'select-right'>
                        <form>
                          <label id="aria-label1" className = 'aria-focus' htmlFor="aria-input1">
                          </label>
                          <div style = {{marginBottom: '10px'}}/>
                          <Select 
                          aria-labelledby="aria-label1"
                          //ariaLiveMessages={{
                          //  onFocus,
                          //}}
                          inputId="aria-input1"
                          name="aria-live"
                          //onMenuOpen={onMenuOpen1}
                          //onMenuClose={onMenuClose1}
                          styles={customStyles}
                          value = {multi_state}
                          options = {thelist}
                          isSearchable = {searchable}
                          onChange = {changeEmpState}
                          tabIndex={null}
                          />
                        </form> 
                      </div>
                    </div>
                    <form>
                      <div style = {{marginBottom: '12px'}}/>
                      <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input">
                      </label>
                      <div style={{ padding: 10 }}/>
                      <Select 
                      aria-labelledby="aria-label"
                      inputId="aria-example-input"
                      name="aria-live-color"
                      //ariaLiveMessages={{
                      //  onFocus,
                      //}}
                      styles={listoptions}
                      value = {multiVariable}
                      menuIsOpen={true}
                      //openMenuOnFocus={true}
                      options = {variables}
                      onChange = {changeList}
                      isSearchable = {false}
                      tabIndex={null}/>
                    </form>
                  </div>
                </div>
              </div>              
            </TabPanel>
            <TabPanel>
              <div className='inside_container'>
                <p className='aria-text'>Left Content</p>
                <p className='aria-text'>
                  This content contains interactive chart with title and selection option atop.
                </p>
                <p className='aria-text'>
                  When you select any options, this will change not only a chart but title and description including 
                  all information in exported chart in the employment content.
                </p>
                <p className='aria-text'>Beginning of Interactive Chart</p>
                <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex1} aria-hidden = 'true'>
                  <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                </button>
                <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                  <div className='data_sidebar_interface'>
                    <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                      <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                    </button>
                    <Select 
                    styles={stateCompStyles}
                    value = {multi_comp_state}
                    options = {state_comparison}
                    isSearchable = {searchable}
                    onChange = {changeState}
                    isOptionDisabled = {state_comparison => state_comparison.disabled}
                    tabIndex={null}
                    />
                    <Select 
                    styles={edulistoptions2}
                    value = {multiVariable}
                    menuIsOpen={true}
                    isDisabled={stateDisabled}
                    onChange = {changeList}
                    options = {variables}
                    isSearchable = {false}
                    />
                    <div style={{ padding: 10 }} /> 
                    <ContentDowndrop buttonLabel = {'More'+more_options+'Options'}
                      clickedId = {clickedId}
                      symbol = {symbol}
                      tabIndex = {tabindex}
                      content = {content}
                      background = 'transparent'
                      your_color = 'white'
                      textwidth = 'text-contain1'
                      onClick = {clickAccordion}
                      textContent={
                        <Select 
                        styles={eduselect_attribution2}
                        menuIsOpen={true}
                        isMulti={true}
                        isDisabled={stateDisabled}
                        tabIndex = {tabindex_acc}
                        value = {multi_attribution}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                          Option
                        }}
                        options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
                        isSearchable = {false}
                        onChange = {changeAttribution_A}
                        />
                      }
                    />
                    <div style={{marginBottom:60}}></div>
                  </div>
                </div>
                <div className={data_grid}>
                  <div className='a'>
                  <div className = 'title'>{stateLevelTitle.toUpperCase()+edutitle_by.toUpperCase()+': UNITED STATES'}</div>
                    {
                      {
                        accordionBtn: <HighchartsReact highcharts={Highcharts} options={nation_variable_only}/>,
                        accordionBtnActive: <HighchartsReact highcharts={Highcharts} options={nation}/>,
                        AllLevels: <HighchartsReact highcharts={Highcharts} options={nation_all}/>
                      }[chart_edcomp]
                    }
                    <ContentDowndrop buttonLabel = '' 
                      clickedId = {clickedId1}
                      symbol = {symbol1}
                      content = {content1}
                      background = '#ffffff'
                      your_color = '#008e84'
                      textwidth = 'text-contain'
                      onClick = {clickAccordion1}
                      n = {
                        {
                          accordionBtn: Math.max(...employment.filter(employment => employment.type === stateType & 
                            employment.variable === selected_attributions & employment.state === 'United States' &
                            employment.status === stateLevel).map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                            )),
                          accordionBtnActive: Math.max(...employment.filter(employment => (employment.attribution === attribute[0] | 
                            employment.attribution === attribute[1]) & 
                            employment.status === stateLevel & 
                            employment.type === stateType & 
                            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                            )),
                          AllLevels: Math.max(...employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
                            employment.status === 'phd/dr' & employment.type === 'education' & 
                            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                            ))
                        }[chart_edcomp]
                      }
                      textContent={
                        {
                          accordionBtn: 'In the United States, among people aged '+state_age+', an estimated'+
                            employment.filter(employment => employment.type === stateType & 
                              employment.variable === selected_attributions & employment.state === 'United States' &
                              employment.status === stateLevel & employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              deaf_labels[employment.index] : ' '+ 
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              deaf_labels[employment.index]})+
                            state_descript+', compared to '+
                            employment.filter(employment => employment.type === stateType & 
                              employment.variable === selected_attributions & employment.state === 'United States' &
                              employment.status === stateLevel & employment.attribution.includes('hearing')).map(
                              function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              hear_labels[employment.index] : ' '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              hear_labels[employment.index]})+
                            '.',
                          accordionBtnActive: 'In the United States, among people aged '+state_age+', an estimated '+
                            employment.filter(employment => employment.attribution === attribute[0] & 
                              employment.status === stateLevel &  
                              employment.type === stateType & 
                              employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                                function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                              )
                              +
                            words[0]+state_descript+', compared to '+
                            employment.filter(employment => employment.attribution === attribute[1] & 
                              employment.status === stateLevel &  
                              employment.type === stateType & 
                              employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                                function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                              )+
                            words[1]+'.',
                          AllLevels: 'In the United States, among people aged '+state_age+', an estimated'+
                            employment.filter(employment => employment.attribution === 'deaf' & 
                            employment.status !== 'no HS diploma' &  
                            employment.type === 'education' & 
                            employment.state === 'United States').map(
                              function(employment, index){ return index === 0 ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                              edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
                              edulist[index] :
                              ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                            ', compared to '+
                            employment.filter(employment => employment.attribution === 'hearing' & 
                            employment.status !== 'no HS diploma' & 
                            employment.type === 'education' & 
                            employment.state === 'United States').map(
                              function(employment, index){ return index === 0 ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                              edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
                              edulist[index] :
                              ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                            '.'
                        }[chart_edcomp]
                      }
                      textContent1={
                        {
                          accordionBtn: 'In this chart, estimates are based on a sample size of '+
                            size_checker(employment.filter(employment => employment.type === stateType & 
                              employment.variable === selected_attributions & employment.state === 'United States' &
                              employment.status === stateLevel & employment.attribution.includes('deaf')).map(
                              employment => employment.n).reduce(
                                (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                            ' deaf people and '+
                            size_checker(employment.filter(employment => employment.type === stateType & 
                              employment.variable === selected_attributions & employment.state === 'United States' &
                              employment.status === stateLevel & employment.attribution.includes('hearing')).map(
                              employment => employment.n).reduce(
                                (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                            ' hearing people in the United States who participated in the '+year+
                            ' American Community Survey. The margin of errors are '+
                            employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === stateLevel & 
                              employment.type === stateType & 
                              employment.state === 'United States').map(
                              employment => employment.margin_errors)+
                            '% for deaf people and '+
                            employment.filter(employment => employment.attribution === 'hearing' & 
                              employment.status === stateLevel & 
                              employment.type === stateType & 
                              employment.state === 'United States').map(employment => employment.margin_errors)+
                            '% for hearing people.',
                          accordionBtnActive: 'In this chart, estimates are based on a sample size of '+
                            size_checker(employment.filter(employment => employment.type === stateType & 
                            employment.attribution === attribute[0] & 
                            employment.state === 'United States' &
                            employment.status === stateLevel).map(employment => employment.n).reduce(
                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+' '+words[0]+' and '+
                            size_checker(employment.filter(employment => employment.type === stateType & 
                            employment.attribution === attribute[1] & 
                            employment.state === 'United States' &
                            employment.status === stateLevel).map(employment => employment.n).reduce(
                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+' '+words[1]+
                            ' in the United States who participated in the '+year+' American Community Survey. The margin of errors are '+
                            employment.filter(employment =>
                              employment.attribution === attribute[0] & 
                              employment.status === stateLevel & 
                              employment.type === stateType & 
                              employment.state === 'United States').map(
                              employment => employment.margin_errors)+
                            '% for '+words[0]+' and '+
                            employment.filter(employment =>
                              employment.attribution === attribute[1] & 
                              employment.status === stateLevel & 
                              employment.type === stateType & 
                              employment.state === 'United States').map(
                              employment => employment.margin_errors)+
                            '% for '+words[1]+'.',
                          AllLevels: 'In this chart, estimates are based on a sample size of '+
                            size_checker(employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === 'no HS diploma' & employment.type === 'education' & 
                              employment.state === 'United States').map(employment => employment.n).reduce(
                                (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
                            size_checker(employment.filter(employment => employment.attribution === 'hearing' & 
                              employment.status === 'no HS diploma' & employment.type === 'education' & 
                              employment.state === 'United States').map(employment => employment.n).reduce(
                                (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                            ' hearing people in the United States who participated in the American Community '+year+
                            ' American Community Survey. The margin of errors are between '+
                            employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === 'phd/dr' & 
                              employment.type === 'education' & 
                              employment.state === 'United States').map(
                              employment => employment.margin_errors)+
                            '% and '+
                            employment.filter(employment => employment.attribution === 'deaf' & 
                              employment.status === 'HS diploma' & 
                              employment.type === 'education' & 
                              employment.state === 'United States').map(
                              employment => employment.margin_errors)+
                            '% for deaf people, and between '+
                            employment.filter(employment => employment.attribution === 'hearing' & 
                              employment.status === 'phd/dr' & 
                              employment.type === 'education' & 
                              employment.state === 'United States').map(employment => employment.margin_errors)+
                            '% and '+
                            employment.filter(employment => employment.attribution === 'hearing' & 
                              employment.status === 'HS diploma' & 
                              employment.type === 'education' & 
                              employment.state === 'United States').map(employment => employment.margin_errors)+
                            '% for hearing people.',
                        }[chart_edcomp]
                      }
                    />
                  </div>
                  <div className='b' style={{display:interface_side}}>
                    <p className='aria-text'>Right Content</p>
                    <p className='aria-text'>
                      This content consists of three selection options: 50 states plus United States and Washington D.C., 
                      four categories (i.e. overall, race, gender, and disability), and more specific groups.
                    </p>
                    <p className='aria-text'>
                      When you select any of these options, this will also affect a chart, title and description 
                      including all information in exported chart in the employment content.
                    </p>
                    <form>
                      <label id="aria-label1" className = 'aria-focus' htmlFor="aria-input1">
                      </label>
                      <div style = {{marginBottom: '10px'}}/>
                      <Select 
                        aria-labelledby="aria-label1"
                        //ariaLiveMessages={{
                        //  onFocus,
                        //}}
                        inputId="aria-input1"
                        name="aria-live"
                        //onMenuOpen={onMenuOpen1}
                        //onMenuClose={onMenuClose1}
                        styles={CompStyles}
                        value = {multi_comp_state}
                        options = {state_comparison}
                        isSearchable = {searchable}
                        onChange = {changeState}
                        isOptionDisabled = {state_comparison => state_comparison.disabled}
                        tabIndex={null}
                      />
                    </form>
                    <form>
                      <div style = {{marginBottom: '12px'}}/>
                      <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input">
                        
                      </label>
                      <div style={{ padding: 10 }}/>
                      <Select 
                      aria-labelledby="aria-label"
                      inputId="aria-example-input"
                      name="aria-live-color"
                      //ariaLiveMessages={{
                      //  onFocus,
                      //}}
                      styles={edulistoptions1}
                      value = {multiVariable}
                      isDisabled={stateDisabled}
                      menuIsOpen={true}
                      //openMenuOnFocus={true}
                      options = {variables}
                      onChange = {changeList}
                      isSearchable = {false}
                      tabIndex={null}/>
                    </form>
                    <div style={{ padding: 10 }}/>
                    <ContentDowndrop buttonLabel = {'More'+more_options+'Options'} 
                      clickedId = {clickedId}
                      symbol = {symbol}
                      content = {content}
                      background = 'transparent'
                      your_color = '#008e84'
                      textwidth = 'text-contain1'
                      onClick = {clickAccordion}
                      textContent={
                      <form>
                        <div style = {{marginBottom: '12px'}}/>
                        <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input">
                        </label>
                        <div style={{ padding: 10 }}/>
                        <Select 
                        aria-labelledby="aria-label"
                        inputId="aria-example-input"
                        name="aria-live-color"
                        styles={eduselect_attribution1}
                        value = {multi_attribution}
                        tabIndex = {tabindex_acc}
                        isDisabled={stateDisabled}
                        menuIsOpen={true}
                        //openMenuOnFocus={true}
                        isMulti={true}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        maxMenuHeight={200}
                        components={{
                          Option
                        }}
                        options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
                        isSearchable = {false}
                        onChange = {changeAttribution_A}/>
                      </form>}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className='inside_container'>
                <p className='aria-text'>Left Content</p>
                <p className='aria-text'>
                  This content contains interactive chart with title and selection option atop.
                </p>
                <p className='aria-text'>
                  When you select any options, this will change not only a chart but title and description including 
                  all information in exported chart in the employment content.
                </p>
                <p className='aria-text'>Beginning of Interactive Chart</p>
                <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex1} aria-hidden = 'true'>
                  <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                </button>
                <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                  <div className='data_sidebar_interface'>
                    <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                      <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                    </button>
                    <Select 
                    styles={stateCompStyles}
                    value = {multi_comp_state}
                    options = {state_comparison}
                    isSearchable = {searchable}
                    onChange = {changeState}
                    isOptionDisabled = {state_comparison => state_comparison.disabled}
                    tabIndex={null}
                    />
                    <Select 
                    styles={edulistoptions2}
                    value = {multiVariable}
                    menuIsOpen={true}
                    isDisabled={stateDisabled}
                    onChange = {changeList}
                    options = {variables}
                    isSearchable = {false}
                    />
                    <div style={{ padding: 10 }} /> 
                    <ContentDowndrop buttonLabel = {'More'+more_options+'Options'}
                      clickedId = {clickedId}
                      symbol = {symbol}
                      tabIndex = {tabindex}
                      content = {content}
                      background = 'transparent'
                      your_color = 'white'
                      textwidth = 'text-contain1'
                      onClick = {clickAccordion}
                      textContent={
                        <Select 
                        styles={eduselect_attribution2}
                        menuIsOpen={true}
                        isMulti={true}
                        isDisabled={stateDisabled}
                        tabIndex = {tabindex_acc}
                        value = {multi_attribution}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                          Option
                        }}
                        options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
                        isSearchable = {false}
                        onChange = {changeAttribution_A}
                        />
                      }
                    />
                    <div style={{marginBottom:60}}></div>
                  </div>
                </div>
                <div className={data_grid}>
                  <div className = 'a'>
                    <div className = 'state_title'>{stateLevelTitle.toUpperCase()+edutitle_by.toUpperCase()+': '+state_label.toUpperCase()+
                      ' AND '+chosen_state1.toUpperCase()}
                    </div>
                    <div className='state_grid'>
                      <div className='state_a'>
                      <div className = 'aria-text'>{'Chart Title - '+stateLevelTitle+edutitle_by+': '+state_label+' and '+chosen_state1}</div>
                        <div style = {{maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <form>
                          <label id="aria-label" className = 'aria-focus' htmlFor="aria-input">
                          </label>
                          <div style = {{marginBottom: '10px'}}></div>
                          <Select
                            aria-labelledby="aria-label"
                            //ariaLiveMessages={{
                            //  onFocus,
                            //}}
                            inputId="aria-input"
                            name="aria-live"
                            //onMenuOpen={onMenuOpen}
                            //onMenuClose={onMenuClose}
                            styles={manybuttonStyle}
                            value = {multi_state}
                            options = {thelist}
                            isSearchable = {searchable}
                            onChange = {changeEmpState}
                            tabIndex={null}
                          /> 
                        </form>
                        </div>
                        {
                          {
                            accordionBtn: <HighchartsReact highcharts={Highcharts} options={state_variable_only}/>,
                            accordionBtnActive: <HighchartsReact highcharts={Highcharts} options={state}/>,
                            AllLevels: <HighchartsReact highcharts={Highcharts} options={stateall}/>
                          }[chart_edcomp]
                        }
                      </div>
                      <div className='state_b'>
                        <div style = {{maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <form>
                          <label id="aria-label" className = 'aria-focus' htmlFor="aria-input">
                          </label>
                          <div style = {{marginBottom: '10px'}}></div>
                          <Select
                            aria-labelledby="aria-label"
                            //ariaLiveMessages={{
                            //  onFocus,
                            //}}
                            inputId="aria-input"
                            name="aria-live"
                            //onMenuOpen={onMenuOpen}
                            //onMenuClose={onMenuClose}
                            styles={manybuttonStyle}
                            value = {multi_state1}
                            options = {thelist}
                            isSearchable = {searchable}
                            onChange = {changeEmpState1}
                            tabIndex={null}
                          /> 
                        </form>
                        </div>
                        {
                          {
                            accordionBtn: <HighchartsReact highcharts={Highcharts} options={state_variable_only1}/>,
                            accordionBtnActive: <HighchartsReact highcharts={Highcharts} options={state1}/>,
                            AllLevels: <HighchartsReact highcharts={Highcharts} options={stateall1}/>
                          }[chart_edcomp]
                        }
                      </div>
                      <div className = 'state_c'>
                        <ContentDowndrop buttonLabel = '' 
                          clickedId = {clickedId1}
                          symbol = {symbol1}
                          content = {content1}
                          background = '#ffffff'
                          your_color = '#008e84'
                          textwidth = 'text-contain'
                          onClick = {clickAccordion1}
                          n = {
                            {
                              accordionBtn: Math.max(...employment.filter(employment => employment.type === stateType & 
                                employment.variable === selected_attributions & (employment.state === chosen_state | employment.state === chosen_state1) &
                                employment.status === stateLevel).map(employment => [employment.margin_errors,employment.percentage]).map(
                                  function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                                )),
                              accordionBtnActive: Math.max(...employment.filter(employment => (employment.attribution === attribute[0] | 
                                employment.attribution === attribute[1]) & 
                                employment.status === stateLevel & 
                                employment.type === stateType & 
                                (employment.state === chosen_state | employment.state === chosen_state1)).map(employment => [employment.margin_errors,employment.percentage]).map(
                                  function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                                )),
                              AllLevels: Math.max(...employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
                                employment.status === 'phd/dr' & employment.type === 'education' & 
                                (employment.state === chosen_state | employment.state === chosen_state1)).map(employment => [employment.margin_errors,employment.percentage]).map(
                                  function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                                ))
                            }[chart_edcomp]
                          }
                          textContent={
                              {
                                accordionBtn: in_the+state_label+', among people aged '+state_age+', an estimated'+
                                  employment.filter(employment => employment.type === stateType & 
                                    employment.variable === selected_attributions & employment.state === chosen_state &
                                    employment.status === stateLevel & employment.attribution.includes('deaf')).map(
                                    function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    deaf_labels[employment.index] : ' '+ 
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    deaf_labels[employment.index]})+
                                  state_descript+', compared to '+
                                  employment.filter(employment => employment.type === stateType & 
                                    employment.variable === selected_attributions & employment.state === chosen_state &
                                    employment.status === stateLevel & employment.attribution.includes('hearing')).map(
                                    function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    hear_labels[employment.index] : ' '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    hear_labels[employment.index]})+
                                  '. While '+in_the1.toLowerCase()+chosen_state1+', among people aged '+state_age+', an estimated'+
                                  employment.filter(employment => employment.type === stateType & 
                                    employment.variable === selected_attributions & employment.state === chosen_state1 &
                                    employment.status === stateLevel & employment.attribution.includes('deaf')).map(
                                    function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    deaf_labels[employment.index] : ' '+ 
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    deaf_labels[employment.index]})+
                                  state_descript1+', compared to '+
                                  employment.filter(employment => employment.type === stateType & 
                                    employment.variable === selected_attributions & employment.state === chosen_state1 &
                                    employment.status === stateLevel & employment.attribution.includes('hearing')).map(
                                    function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    hear_labels[employment.index] : ' '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                    hear_labels[employment.index]})+
                                  '.',
                                accordionBtnActive: in_the+state_label+', among people aged '+state_age+', an estimated '+
                                  employment.filter(employment => employment.attribution === attribute[0] & 
                                    employment.status === stateLevel &  
                                    employment.type === stateType & 
                                    employment.state === chosen_state).map(employment => [employment.margin_errors,employment.percentage]).map(
                                      function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                    )
                                    +
                                  words[0]+state_descript+', compared to '+
                                  employment.filter(employment => employment.attribution === attribute[1] & 
                                    employment.status === stateLevel &  
                                    employment.type === stateType & 
                                    employment.state === chosen_state).map(employment => [employment.margin_errors,employment.percentage]).map(
                                      function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                    )+
                                  words[1]+'. While '+in_the1.toLowerCase()+chosen_state1+', among people aged '+state_age+', an estimated '+
                                  employment.filter(employment => employment.attribution === attribute[0] & 
                                    employment.status === stateLevel &  
                                    employment.type === stateType & 
                                    employment.state === chosen_state1).map(employment => [employment.margin_errors,employment.percentage]).map(
                                      function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                    )
                                    +
                                  words[0]+state_descript1+', compared to '+
                                  employment.filter(employment => employment.attribution === attribute[1] & 
                                    employment.status === stateLevel &  
                                    employment.type === stateType & 
                                    employment.state === chosen_state1).map(employment => [employment.margin_errors,employment.percentage]).map(
                                      function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                    )+
                                  words[1]+'.',
                                AllLevels: in_the+state_label+', among people aged '+state_age+', an estimated'+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.status !== 'no HS diploma' &  
                                  employment.type === 'education' & 
                                  employment.state === chosen_state).map(
                                    function(employment, index){ return index === 0 ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                    edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
                                    edulist[index] :
                                    ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                                  ', compared to '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.status !== 'no HS diploma' & 
                                  employment.type === 'education' & 
                                  employment.state === chosen_state).map(
                                    function(employment, index){ return index === 0 ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                    edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
                                    edulist[index] :
                                    ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                                  '. While'+in_the1.toLowerCase()+chosen_state1+', among people aged '+state_age+', an estimated'+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.status !== 'no HS diploma' &  
                                  employment.type === 'education' & 
                                  employment.state === chosen_state1).map(
                                    function(employment, index){ return index === 0 ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                    edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
                                    edulist[index] :
                                    ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                                  ', compared to '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.status !== 'no HS diploma' & 
                                  employment.type === 'education' & 
                                  employment.state === chosen_state1).map(
                                    function(employment, index){ return index === 0 ? 
                                    ' and '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                    edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                    (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
                                    edulist[index] :
                                    ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                                  '.',
                                CompareItself: 'You have selected the same geographic location, consider selecting two different locations.'
                              }[chart_edcomp1]
                            }
                          textContent1={
                              {
                                accordionBtn: 'In this chart, estimates are based on a sample size of '+
                                  size_checker(employment.filter(employment => employment.type === stateType & 
                                    employment.variable === selected_attributions & employment.state === chosen_state &
                                    employment.status === stateLevel).map(employment => employment.n).reduce(
                                      (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                  ' people'+in_the.toLowerCase()+state_label+' and '+
                                  size_checker(employment.filter(employment => employment.type === stateType & 
                                    employment.variable === selected_attributions & employment.state === chosen_state1 &
                                    employment.status === stateLevel).map(employment => employment.n).reduce(
                                      (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                  ' people'+in_the1.toLowerCase()+chosen_state1+' who participated'+
                                  in_the.toLowerCase()+year1+
                                  ' American Community Survey.'+in_the+state_label+', the margin of errors are '+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state).map(employment => employment.margin_errors)+
                                  '% for deaf people and '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state).map(employment => employment.margin_errors)+
                                  '% for hearing people while'+
                                  in_the1.toLowerCase()+chosen_state1+', the margin of errors are '+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state1).map(employment => employment.margin_errors)+
                                  '% for deaf people and '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state1).map(employment => employment.margin_errors)+
                                  '% for hearing people.',
                                accordionBtnActive: 'In this chart, estimates are based on a sample size of '+
                                  size_checker(employment.filter(employment => employment.type === stateType & 
                                  (employment.attribution === attribute[0] | employment.attribution === attribute[1]) & 
                                  employment.state === chosen_state &
                                  employment.status === stateLevel).map(employment => employment.n).reduce(
                                    (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                  ' people'+in_the.toLowerCase()+state_label+
                                  ' and '+size_checker(employment.filter(employment => employment.type === stateType & 
                                    (employment.attribution === attribute[0] | employment.attribution === attribute[1]) & 
                                    employment.state === chosen_state1 &
                                    employment.status === stateLevel).map(employment => employment.n).reduce(
                                      (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                  ' people'+in_the1.toLowerCase()+chosen_state1+' who participated'+
                                  in_the.toLowerCase()+year1+
                                  ' American Community Survey.'+in_the+state_label+', the margin of errors are '+
                                  employment.filter(employment => employment.attribution === attribute[0] & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state).map(employment => employment.margin_errors)+
                                  '% for '+words[0]+' and '+
                                  employment.filter(employment => employment.attribution === attribute[1] & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state).map(employment => employment.margin_errors)+
                                  '% for '+words[1]+' while'+in_the1.toLowerCase()+chosen_state1+', the margin of errors are '+
                                  employment.filter(employment => employment.attribution === attribute[0] & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state1).map(employment => employment.margin_errors)+
                                  '% for '+words[0]+' and '+
                                  employment.filter(employment => employment.attribution === attribute[1] & 
                                    employment.status === stateLevel & 
                                    employment.type === stateType & 
                                    employment.state === chosen_state1).map(employment => employment.margin_errors)+
                                  '% for '+words[1]+'.',
                                AllLevels: 'In this chart, estimates are based on a sample size of '+
                                  size_checker(employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
                                    employment.status === 'no HS diploma' & employment.type === 'education' & 
                                    employment.state === chosen_state).map(employment => employment.n).reduce(
                                      (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                  ' people'+in_the.toLowerCase()+state_label+' and '+
                                  size_checker(employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
                                    employment.status === 'no HS diploma' & employment.type === 'education' & 
                                    employment.state === chosen_state1).map(employment => employment.n).reduce(
                                      (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                  ' people'+in_the1.toLowerCase()+chosen_state1+' who participated'+
                                  in_the.toLowerCase()+year1+
                                  ' American Community Survey.'+in_the+state_label+', the margin of errors are between '+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                    employment.status === 'phd/dr' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state).map(
                                    employment => employment.margin_errors)+
                                  '% and '+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                    employment.status === 'HS diploma' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state).map(
                                    employment => employment.margin_errors)+
                                  '% for deaf people, and between '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                    employment.status === 'phd/dr' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state).map(employment => employment.margin_errors)+
                                  '% and '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                    employment.status === 'HS diploma' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state).map(employment => employment.margin_errors)+
                                  '% for hearing people while'+in_the1.toLowerCase()+chosen_state1+
                                  ', the margin of errors are between '+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                    employment.status === 'phd/dr' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state1).map(
                                    employment => employment.margin_errors)+
                                  '% and '+
                                  employment.filter(employment => employment.attribution === 'deaf' & 
                                    employment.status === 'HS diploma' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state1).map(
                                    employment => employment.margin_errors)+
                                  '% for deaf people, and between '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                    employment.status === 'phd/dr' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state1).map(employment => employment.margin_errors)+
                                  '% and '+
                                  employment.filter(employment => employment.attribution === 'hearing' & 
                                    employment.status === 'HS diploma' & 
                                    employment.type === 'education' & 
                                    employment.state === chosen_state1).map(employment => employment.margin_errors)+
                                  '% for hearing people.',
                                CompareItself:''
                              }[chart_edcomp1]
                            }
                        />
                        <div style = {{marginBottom: '20px'}}/>
                      </div>
                    </div>
                  </div>
                  <div className='b' style={{display:interface_side}}>
                      <p className='aria-text'>Right Content</p>
                      <p className='aria-text'>
                        This content consists of three selection options: 50 states plus United States and Washington D.C., 
                        four categories (i.e. overall, race, gender, and disability), and more specific groups.
                      </p>
                      <p className='aria-text'>
                        When you select any of these options, this will also affect a chart, title and description 
                        including all information in exported chart in the employment content.
                      </p>
                      <form>
                        <label id="aria-label1" className = 'aria-focus' htmlFor="aria-input1">
                        </label>
                        <div style = {{marginBottom: '10px'}}/>
                        <Select 
                          aria-labelledby="aria-label1"
                          //ariaLiveMessages={{
                          //  onFocus,
                          //}}
                          inputId="aria-input1"
                          name="aria-live"
                          //onMenuOpen={onMenuOpen1}
                          //onMenuClose={onMenuClose1}
                          styles={CompStyles}
                          value = {multi_comp_state}
                          options = {state_comparison}
                          isSearchable = {searchable}
                          onChange = {changeState}
                          isOptionDisabled = {state_comparison => state_comparison.disabled}
                          tabIndex={null}
                        />
                      </form>
                      <form>
                        <div style = {{marginBottom: '12px'}}/>
                        <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input">
                          
                        </label>
                        <div style={{ padding: 10 }}/>
                        <Select 
                        aria-labelledby="aria-label"
                        inputId="aria-example-input"
                        name="aria-live-color"
                        //ariaLiveMessages={{
                        //  onFocus,
                        //}}
                        styles={edulistoptions1}
                        value = {multiVariable}
                        isDisabled={stateDisabled}
                        menuIsOpen={true}
                        //openMenuOnFocus={true}
                        options = {variables}
                        onChange = {changeList}
                        isSearchable = {false}
                        tabIndex={null}/>
                      </form>
                      <div style={{ padding: 10 }}/>
                      <ContentDowndrop buttonLabel = {'More'+more_options+'Options'} 
                        clickedId = {clickedId}
                        symbol = {symbol}
                        content = {content}
                        background = 'transparent'
                        your_color = '#008e84'
                        textwidth = 'text-contain1'
                        onClick = {clickAccordion}
                        textContent={
                        <form>
                          <div style = {{marginBottom: '12px'}}/>
                          <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input">
                          </label>
                          <div style={{ padding: 10 }}/>
                          <Select 
                          aria-labelledby="aria-label"
                          inputId="aria-example-input"
                          name="aria-live-color"
                          styles={eduselect_attribution1}
                          value = {multi_attribution}
                          tabIndex = {tabindex_acc}
                          isDisabled={stateDisabled}
                          menuIsOpen={true}
                          //openMenuOnFocus={true}
                          isMulti={true}
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          maxMenuHeight={200}
                          components={{
                            Option
                          }}
                          options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
                          isSearchable = {false}
                          onChange = {changeAttribution_A}/>
                        </form>}
                      />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className='inside_container'>
                <div className = 'title'>{'ABOUT DASHBOARD'}</div>
                <div className='text-contain'>
                  <div className = 'thep'>
                    <b>About this Data</b>
                  </div>
                  <div className = 'thep'>
                    Data for this dashboard are taken from the American Community Survey, an annual 
                    survey conducted by the U.S. Census Bureau, providing the most recent information 
                    on employment and educational trends for deaf people in the United States. Survey 
                    respondents who stated that they were deaf, or had serious difficulty hearing, were 
                    used to represent the deaf population in these analyses. The {most_recent_year} sample included {
                      employment.filter(employment => employment.type === 'employment' & 
                        employment.attribution === 'deaf' & 
                        employment.state === 'United States' &
                        (employment.status === 'unemployed' | employment.status === 'employed' | 
                        employment.status === 'notinLF')).map(employment => employment.n).reduce(
                        (sum, a) => sum + a, 0).toLocaleString('en-US')
                    } deaf people, and the 5-year sample ({(most_recent_year1-4)+'-'+(most_recent_year1)}) 
                    used for state-level data included {
                      employment.filter(employment => employment.type === 'employment' & 
                        employment.attribution === 'deaf' & 
                        employment.state !== 'United States' &
                        (employment.status === 'unemployed' | employment.status === 'employed' | 
                        employment.status === 'notinLF')).map(employment => employment.n).reduce(
                        (sum, a) => sum + a, 0).toLocaleString('en-US')
                    } deaf people. 
                    {/*For more information, see our Method page.*/}
                  </div>
                  <div className = 'thep'>
                    <b>Recommended Citation</b>
                  </div>
                  <div className = 'thep' style={{textIndent: '-26px', paddingLeft: '26px'}}>
                    {citation[0]}
                    <a href = 'https://nationaldeafcenter.org/resources/research-data/dashboard/' style = {{textDecoration: 'none', color: '#0B7373'}}>
                      <b>{citation[1]}</b>
                    </a>
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

export default Dashboard;