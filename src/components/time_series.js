import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';import './dashboard.css';
import thelogo from './logo_export.js'

//Data
import most_recent_year from './assets/acs_year.json';
import employment from './assets/employment.json';
import timeseries from './assets/timeseries.json';

//Widgets
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select, { components } from 'react-select';
import ButtonGroup from './buttongroup.js';
import ContentDowndrop from "./content_downdrop";

/*Icons and fonts*/
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';

//Charts
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HCMore from 'highcharts/highcharts-more';
import HCPattern from 'highcharts-pattern-fill';
import HC_exporting from 'highcharts/modules/exporting';
//import HCxrange from 'highcharts/modules/xrange';

// Add pattern in Highcharts
HCPattern(Highcharts);
HC_exporting(Highcharts);
HCMore(Highcharts);

//Current Year
//const current_year = new Date().getFullYear()

// General 
let variables = [
  {label: 'Overall', value: 'Overall', variable: 'overall', variables: ['']},
  {label: 'Race', value: 'Race', variable: 'race', variables: ['Asian','Black','Latinx','Native American','multiracial','white']},
  {label: 'Gender', value: 'Gender', variable: 'gender', variables: ['women','men']},
  {label: 'Disability', value: 'Disability', variable: 'disability', variables: ['blind','disabled','no additional disabilities']}
]
// For React Select: More Options - Open
let attributions = [
  {label: 'deaf', value: 'deaf', variable: 'overall', color: 'teal', words: 'deaf people'},
  {label: 'hearing', value: 'hearing', variable: 'overall', color: 'black', words: 'hearing people'},
  {label: 'deaf: ages 55-64', value: 'deaf: ages 55-64', variable: 'age', color: 'teal', words: 'deaf people who fall in 55-64 age group'},
  {label: 'deaf: ages 45-54', value: 'deaf: ages 45-54', variable: 'age', color: 'teal', words: 'deaf people who fall in 45-54 age group'},
  {label: 'deaf: ages 35-44', value: 'deaf: ages 35-44', variable: 'age', color: 'teal', words: 'deaf people who fall in 35-44 age group'},
  {label: 'deaf: ages 25-34', value: 'deaf: ages 25-34', variable: 'age', color: 'teal', words: 'deaf people who fall in 25-34 age group'},
  {label: 'hearing: ages 55-64', value: 'hearing: ages 55-64', variable: 'age', color: 'black', words: 'hearing people who fall in 55-64 age group'},
  {label: 'hearing: ages 45-54', value: 'hearing: ages 45-54', variable: 'age', color: 'black', words: 'hearing people who fall in 45-54 age group'},
  {label: 'hearing: ages 35-44', value: 'hearing: ages 35-44', variable: 'age', color: 'black', words: 'hearing people who fall in 35-44 age group'},
  {label: 'hearing: ages 25-34', value: 'hearing: ages 25-34', variable: 'age', color: 'black', words: 'hearing people who fall in 25-34 age group'},
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
  {label: 'deaf-blind', value: 'deaf-blind', variable: 'disability', color: 'teal', words: 'deafblind people'},
  {label: 'deaf disabled', value: 'deaf disabled', variable: 'disability', color: 'teal', words: 'deafdisabled people'},
  {label: 'deaf with no additional disabilities', value: 'deaf with no additional disabilities', variable: 'disability', color: 'teal', words: 'deaf people with no additional disabilities'},  
  {label: 'hearing blind', value: 'hearing blind', variable: 'disability', color: 'black', words: 'hearing blind people'},
  {label: 'hearing disabled', value: 'hearing disabled', variable: 'disability', color: 'black', words: 'hearing disabled people'},
  {label: 'hearing with no additional disabilities', value: 'hearing with no additional disabilities', variable: 'disability', color: 'black', words: 'hearing people with no additional disabilities'}
]

// For Education Attainment
let eduattain = [
  {label: 'High School', value: 'High School', title: "High School's Diploma or Higher", variable: 'HS diploma'},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college'},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate'},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor'},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master'},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr'},
]
// For Employment Statuses
let emp_data = [
  {label: 'Employed', value: 'Employed', title: "Employment Rate", variable: 'employed'},
  {label: 'Unemployed', value: 'Unemployed', title: "Unemployment Rate", variable: 'unemployed'},
  {label: "Not in Labor", value: "Not in Labor", title: "Not in Labor Force", variable: 'notinLF'}
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
          tabIndex='0'
          aria-labelledby={props}
          aria-checked = 'false'
          />
          <label role="checkbox" aria-checked="false" aria-labelledby={props} tabIndex="0" style = {{fontFamily: 'Roboto', fontSize: '16px', cursor: 'pointer'}}>{props.label}</label>
        </div>
      </components.Option>
    </div>
  );
};

const TimeSeries = ({colors, justcolor, colorfill}) => {
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
  const [HCwidth, setHC_Width] = useState(null)
  //const [searchable, setSearchable] = useState(true)
  const [slice_string, setSliceString] = useState([50,''])
  const [paddingSide, setPaddingSide] = useState(null)
  useEffect(() => {
    if(size[0] < 941 & size[0] > 551){
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      //setSearchable(true)
      setHC_Width(null)
      setPaddingSide(null)
    }else if(size[0] < 551){
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      //setSearchable(false)
      setHC_Width(size[0]/1.2)
      setSliceString([10,'.'])
      setPaddingSide('6px')
    }else{
      setData_SideBar('None')
      setInterface_Side('unset')
      setData_Grid('grid')
      //setSearchable(true)
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

  //Stylize React Selection
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
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      color:'black',
      paddingTop:'3px',
      fontWeight: 700
    }),
  }
  const listoptions = {
    option: (provided, state) => ({
      ...provided,
      margin: 0,
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'transparent',
      color: state.isSelected ? 'black' : '#0B7373',
      fontSize: 16,
      fontFamily: 'Roboto',
      cursor: 'pointer'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#0B7373',
      "&:hover": {
        color: '#0B7373'
      }
    }),
    control: (provided) => ({
      ...provided,
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
      position: 'static',
      overflowX: 'hidden',
      border: '0.5px #0B7373 solid',
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
  const select_attribution = {
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'transparent',
      color: state.isSelected ? 'black' : '#0B7373',
      fontSize: 16,
      fontFamily: 'Roboto',
      cursor: 'pointer'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#0B7373',
      "&:hover": {
        color: '#0B7373'
      }
    }),
    control: (provided) => ({
      ...provided,
      marginTop: -5,
      border: '0.5px #0B7373 solid',
      borderBottom: 'none',
      borderRadius: '20px 20px 0 0',
      background: "#F6F6F7",
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
      border: '0.5px #0B7373 solid',
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
      fontWeight: 700,
      color: '#0B7373',
    })
  }
  const select_attribution1 = {
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
  }
  /*const manybuttonStyle = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#008e8593' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: 'pointer'
    }),
    indicatorSeparator: () => {},
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#008e85',
      "&:hover": {
        color: '#008e85'
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
      border: '0.5px #008e85 solid',
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
          color: '#008e85',
      }
    },
    singleValue:(provided) => ({
      ...provided,
      paddingTop:'3px',
      height:'100%',
      color:'#008e85'
    }),
  }*/

  // Interacting Selections
  const [selected_attributions, setAttributions] = useState('overall')
  const [multiVariable, setMultiVariable] = useState([{label: 'Overall', value: 'Overall', variable: 'overall', variables: ['deaf','hearing']}])
  //const [categories, setCategories] = useState([''])
  const changeList = (e) => {
    setAttributions(e.variable)
    setMultiVariable(e)
    //setCategories(e.variables)
  }

  // Text Description
  const [clickedId1, setClickedId1] = useState('accordion-btn active');
  const [symbol1, setSymbol1] = useState('icon-active');
  const [content1, setContent1] = useState('accordion-content-active');
  const clickAccordion1 = () => {
    clickedId1 === 'accordion-btn active' ? setClickedId1('accordion-btn') : setClickedId1('accordion-btn active');
    symbol1 === 'icon' ? setSymbol1('icon-active') : setSymbol1('icon');
    content1 === 'accordion-content-active' ? setContent1('accordion-content') : setContent1('accordion-content-active');
  }

  // Effect of Attributions under React Selection
  //const [num_col, setNumCol] = useState([0,6])
  //const [bar_col, setBarColor] = useState(['teal', 'black'])
  const [attribute, setAttribution] = useState(['deaf','hearing'])
  //const [words, setWords] = useState(['deaf people','hearing people'])
  const [multi_attribution, setMultiAttribution] = useState([{label: 'deaf', value: 'deaf', variable: 'overall', color: 'teal', words: 'deaf people'},
  {label: 'hearing', value: 'hearing', variable: 'overall', color: 'black', words: 'hearing people'}])

  const changeAttribution_A = (e) => {
    // Select attribution of group
    if(e.map(x => x.value)?.length  > 2){
      setMultiAttribution(e.filter(x => x.value !== attribute[0]));
      //setBarColor(e.filter(x => x.value !== attribute[0]).map(x => x.color))
      setAttribution(e.filter(x => x.value !== attribute[0]).map(x => x.value));
      //setWords(e.filter(x => x.value !== attribute[0]).map(x => x.words));
    }else{
      setMultiAttribution(e);
      //setBarColor(e.map(x => x.color))
      setAttribution(e.map(x => x.value)); 
      //setWords(e.map(x => x.words));
    }
  }

  // Change colors based on hearing status: hearing = black; deaf = teal
  /*useEffect(() => {
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
  }, [bar_col])*/

  // Effect of button groups for time series alone
  //const [button_group_b, setButtonGroup_B] = useState('Labor Force')
  const [type_b, setType_B] = useState('employment')

  const changeButton_B = (e) => {
    if(e.target.name === 'Labor Force'){
      setType_B('employment')
      //setButtonGroup_B('Labor Force')
    }else{
      setType_B('education')
      //setButtonGroup_B('Education Attainment')
    }
  }
  // Effect of button groups
  const [button_group_a, setButtonGroup_a] = useState('Employment Rates')
  const [status_a, setStatus_A] = useState('employed')
  const [variable_a, setVariable_A] = useState('percentage')
  const [limit_a, setLimit_A] = useState([0,100])

  const changeButton_A = (e) => {
    setButtonGroup_a(e.target.name)
    if(e.target.name === 'Employment Rates'){
      setStatus_A('employed')
      setVariable_A('percentage')
      setLimit_A([0,100])
    }else if(e.target.name === 'Earnings'){
      setStatus_A('earning')
      setVariable_A('median_income')
      setLimit_A([0,100000])
    }
  }

  // Math Round
  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

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
  const [eduLevelTitle, setEduLevelTitle] = useState("Bachelor's Degree Attainment")
  const [eduLevel, setEduLevel] = useState("bachelor")
  //const [eduLabel, setEduLabel] = useState("Bachelor's")
  //const [eduA, setEduA] = useState(" a ")
  //const [degree, setDegree] = useState(' degree')
  const [range, setRange] = useState([0,60])
      
  const changeEduLevel = (e) => {
    setEduLevelTitle(e.title)
    setEduLevel(e.variable)
    if(e.label === "Associate's"){
      //setEduA(" an ")
      //setEduLabel(e.label)
      setRange([0,80])
    }else if(e.label === 'Some College'){
      //setEduA(" ")
      //setEduLabel(e.label.toLowerCase())
      setRange([0,90])
    }else if(e.label === 'High School'){
      //setEduA(' a ')
      //setEduLabel(e.label)
      setRange([0,100])
    }else if(e.label === "Bachelor's"){
      //setEduA(' a ')
      //setEduLabel(e.label)
      setRange([0,70])
    }else if(e.label === "Master's"){
      //setEduA(' a ')
      //setEduLabel(e.label)
      setRange([0,30])
    }else{
      //setEduA(' a ')
      //setEduLabel(e.label)
      setRange([0,10]) 
    }
  }

    // Education Attainment Selection
    const [empTitle, setEmpTitle] = useState("Employment Rate")
    const [empStatus, setEmpStatus] = useState("employed")
    //const [eduLabel, setEduLabel] = useState("Bachelor's")
    //const [eduA, setEduA] = useState(" a ")
    //const [degree, setDegree] = useState(' degree')
    const [emprange, setEmpRange] = useState([0,100])
        
    const changEmpStatus = (e) => {
      setEmpTitle(e.title)
      setEmpStatus(e.variable)
      if(e.variable === "employed"){
        //setEduA(" an ")
        //setEduLabel(e.label)
        setEmpRange([0,100])
      }else if(e.variable === 'unemployed'){
        //setEduA(" ")
        //setEduLabel(e.label.toLowerCase())
        setEmpRange([0,15])
      }else{
        //setEduA(' a ')
        //setEduLabel(e.label)
        setEmpRange([0,100])
      }
    }

  // Levels of Education Chart
  let eduyear = {
    title: {
      text: ""
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    xAxis: {
      categories: ["Less than high school","High school diploma/GED","Some college", "Associate's degree","Bachelor's degree","Master's degree","Ph.D., J.D. or M.D."]
    },
    yAxis: {
      min: limit_a[0],
      max: limit_a[1],
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: button_group_a.slice(0,-1)
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          if(variable_a === 'percentage'){
            return this.value+'%'
          }else{
            return '$'+this.value/1000+'K'
          }
        },
      }
    },
    tooltip: {
      shared: false,
      formatter: function(){
        if(variable_a === 'percentage'){
          return this.x+'<br>Employment rate: '+this.y+'%'
        }else{
          return this.x+'<br>Earning: $'+this.y/1000+'K'
        }
      },
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
      connectNulls: false,
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        marker: {
          enabled: false
        },
        dataLabels: {
        enabled: false,
        formatter: function(){
          if(variable_a === 'percentage'){
            return this.y+'%'
          }else{
            return '$'+this.y/1000+'K'
          }
        },
        }
      }
    },
    series: [
    {
      name: 'deaf: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[1],
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === status_a & employment.attribution === 'deaf').map(
      employment => [employment.level,round(employment[variable_a]-employment.margin_errors),
      round(employment[variable_a]+employment.margin_errors)]),
      enableMouseTracking: false,
      showInLegend:false
    },
    {
      name: 'hearing: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[7],
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === status_a & employment.attribution === 'hearing').map(
      employment => [employment.level,round(employment[variable_a]-employment.margin_errors),
      round(employment[variable_a]+employment.margin_errors)]),
      enableMouseTracking: false,
      showInLegend:false
    },
    {
      name: 'deaf',
      type: 'spline',
      color: colorfill[0],
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === status_a & employment.attribution === 'deaf').map(
      employment => [employment.level,employment[variable_a]])
    },
    {
      name: 'hearing',
      type: 'spline',
      color: colorfill[6],
      dashStyle: 'dot',
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === status_a & employment.attribution === 'hearing').map(
      employment => [employment.level,employment[variable_a]])
    }],
    exporting: {
      width: 2000,
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
            enabled: false,
            formatter: function () {
              return this.y + '%';
            },
            }
          }
        },
        title: {
          text: 'National '+button_group_a+' by Levels of Education',
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        caption: {
          text: '...',
          style: {
            fontSize: '10px'
          }
        },
        chart: {
          events: {
            render() {
              const chart = this,
                width = 100;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  10, //y
                  2.37216657881*35, //width
                  35//height
              ).add();
            }
          }
        }
      }
    }
  }

  // Ages of Earnings and Employment Rate Chart
  let empage = {
    title: {
      text: ""
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    yAxis: {
      min: limit_a[0],
      max: limit_a[1],
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: button_group_a.slice(0,-1)
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          if(variable_a === 'percentage'){
            return this.value+'%'
          }else{
            return '$'+this.value/1000+'K'
          }
        },
      }
    },
    tooltip: {
      shared: false,
      formatter: function(){
        if(variable_a === 'percentage'){
          return 'Age: '+this.x+' (in year)<br>Employment rate: '+this.y+'%'
        }else{
          return 'Age: '+this.x+' (in year)<br>Earning: $'+this.y/1000+'K'
        }
      },
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
      connectNulls: false,
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        pointStart: 16,
        marker: {
          enabled: false
        },
        dataLabels: {
        enabled: false,
        formatter: function(){
          if(variable_a === 'percentage'){
            return this.y+'%'
          }else{
            return '$'+this.y/1000+'K'
          }
        },
        }
      }
    },
    series: [
    {
      name: 'deaf: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[1],
      data: employment.filter(employment => employment.type === 'age' &
      employment.status === status_a & employment.attribution === 'deaf').map(
      employment => [employment.level,round(employment[variable_a]-employment.margin_errors),
      round(employment[variable_a]+employment.margin_errors)]),
      enableMouseTracking: false,
      showInLegend:false
    },
    {
      name: 'hearing: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[7],
      data: employment.filter(employment => employment.type === 'age' &
      employment.status === status_a & employment.attribution === 'hearing').map(
      employment => [employment.level,round(employment[variable_a]-employment.margin_errors),
      round(employment[variable_a]+employment.margin_errors)]),
      enableMouseTracking: false,
      showInLegend:false
    },
    {
      name: 'deaf',
      type: 'spline',
      color: colorfill[0],
      data: employment.filter(employment => employment.type === 'age' &
      employment.status === status_a & employment.attribution === 'deaf').map(
      employment => [employment.level,employment[variable_a]]),
    },
    {
      name: 'hearing',
      type: 'spline',
      color: colorfill[6],
      dashStyle: 'dot',
      data: employment.filter(employment => employment.type === 'age' &
      employment.status === status_a & employment.attribution === 'hearing').map(
      employment => [employment.level,employment[variable_a]])
    }],
    exporting: {
      width: 2000,
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
            enabled: false,
            formatter: function () {
              return this.y + '%';
            },
            }
          }
        },
        title: {
          text: 'National '+button_group_a+' by Age',
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        caption: {
          text: '...',
          style: {
            fontSize: '10px'
          }
        },
        chart: {
          events: {
            render() {
              const chart = this,
                width = 100;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  10, //y
                  2.37216657881*35, //width
                  35//height
              ).add();
            }
          }
        }
      }
    }
  }

  // Years of Ed Attain and Emp Rate Chart
  let time_year = {
    chart: {
      width: HCwidth
    },
    title: {
      text: ""
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    xAxis: {
      allowDecimals: false
    },
    yAxis: {
      min: emprange[0],
      max: emprange[1],
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: 'Employment Rate'
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          return this.value+'%'
        },
      }
    },
    tooltip: {
      shared: false,
      formatter: function(){
        return this.series.name+'<br>Year: '+this.x+'<br>'+empTitle+': '+this.y+'%'
      },
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
      connectNulls: false,
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        pointStart: most_recent_year-4,
        marker: {
          enabled: false
        },
        dataLabels: {
        enabled: false,
        formatter: function(){
          return this.y+'%'
        },
        }
      }
    },
    series: [
    {
      name: 'deaf: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[1],
      data: timeseries.filter(timeseries => timeseries.type === 'employment' &
      timeseries.status === empStatus & timeseries.attribution === attribute[0]).map(
      timeseries => [timeseries.year,round(timeseries['percentage']-timeseries.margin_errors),
      round(timeseries['percentage']+timeseries.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false
    },
    {
      name: 'hearing: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[7],
      data: timeseries.filter(timeseries => timeseries.type === 'employment' &
      timeseries.status === empStatus & timeseries.attribution === attribute[1]).map(
      timeseries => [timeseries.year,round(timeseries['percentage']-timeseries.margin_errors),
      round(timeseries['percentage']+timeseries.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false
    },
    {
      name: attribute[0],
      type: 'spline',
      color: colorfill[0],
      data: timeseries.filter(timeseries => timeseries.type === 'employment' &
      timeseries.status === empStatus & timeseries.attribution === attribute[0]).map(
        timeseries => [timeseries.year,timeseries['percentage']]),
    },
    {
      name: attribute[1],
      type: 'spline',
      color: colorfill[6],
      dashStyle: 'dot',
      data: timeseries.filter(timeseries => timeseries.type === 'employment' &
      timeseries.status === empStatus & timeseries.attribution === attribute[1]).map(
        timeseries => [timeseries.year,timeseries['percentage']])
    }],
    exporting: {
      width: 2000,
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
            enabled: false,
            formatter: function () {
              return this.y + '%';
            },
            }
          }
        },
        title: {
          text: 'National Employment Rate by Year',
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        caption: {
          text: '...',
          style: {
            fontSize: '10px'
          }
        },
        chart: {
          events: {
            render() {
              const chart = this,
                width = 100;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  10, //y
                  2.37216657881*35, //width
                  35//height
              ).add();
            }
          }
        }
      }
    }
  }
  let edutime_year = {
    title: {
      text: ""
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    xAxis: {
      allowDecimals: false
    },
    yAxis: {
      min: range[0],
      max: range[1],
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: 'Education Attainment'
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          return this.value+'%'
        },
      }
    },
    tooltip: {
      shared: false,
      formatter: function(){
        return this.series.name+'<br>Year: '+this.x+'<br>Education Attainment: '+this.y+'%'
      },
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
      connectNulls: false,
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        pointStart: most_recent_year-4,
        marker: {
          enabled: false
        },
        dataLabels: {
        enabled: false,
        formatter: function(){
          return this.y+'%'
        },
        }
      }
    },
    series: [
    {
      name: 'deaf: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[1],
      data: timeseries.filter(timeseries => timeseries.type === 'education' &
      timeseries.status === eduLevel & timeseries.attribution === attribute[0]).map(
      timeseries => [timeseries.year,round(timeseries['percentage']-timeseries.margin_errors),
      round(timeseries['percentage']+timeseries.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false
    },
    {
      name: 'hearing: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[7],
      data: timeseries.filter(timeseries => timeseries.type === 'education' &
      timeseries.status === eduLevel & timeseries.attribution === attribute[1]).map(
      timeseries => [timeseries.year,round(timeseries['percentage']-timeseries.margin_errors),
      round(timeseries['percentage']+timeseries.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false
    },
    {
      name: attribute[0],
      type: 'spline',
      color: colorfill[0],
      data: timeseries.filter(timeseries => timeseries.type === 'education' &
      timeseries.status === eduLevel & timeseries.attribution === attribute[0]).map(
        timeseries => [timeseries.year,timeseries['percentage']]),
    },
    {
      name: attribute[1],
      type: 'spline',
      color: colorfill[6],
      dashStyle: 'dot',
      data: timeseries.filter(timeseries => timeseries.type === 'education' &
      timeseries.status === eduLevel & timeseries.attribution === attribute[1]).map(
        timeseries => [timeseries.year,timeseries['percentage']])
    }],
    exporting: {
      width: 2000,
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
            enabled: false,
            formatter: function () {
              return this.y + '%';
            },
            }
          }
        },
        title: {
          text: eduLevelTitle+' by Year in the United States, '+most_recent_year+'-'+(most_recent_year-4),
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        caption: {
          text: '...',
          style: {
            fontSize: '10px'
          }
        },
        chart: {
          events: {
            render() {
              const chart = this,
                width = 100;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  10, //y
                  2.37216657881*35, //width
                  35//height
              ).add();
            }
          }
        }
      }
    }
  }

  return (
      <>
        <div className="body">
          <div className = 'container'>
            <div className = 'main-grid'>
              <div className = 'main-a'>
                <div id = 'title'>
                  Deaf Postsecondary Data from the American Community Survey ({most_recent_year+'-'+(most_recent_year-4)})
                </div>
              </div>
            </div>
            <Tabs aria-label="A set of charts">
              <TabList>
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'Over Time'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'By Age'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
              <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'Levels of Education'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
              </TabList>
              <TabPanel>
                <div className='inside_container'>
                  <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex1}>
                    <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                  </button>
                  <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}}>
                    <div className='data_sidebar_interface'>
                      <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                        <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                      </button>
                      {
                        {
                          employment:<Select styles={customStyles1}
                                      defaultValue={{label: "Employed", value: "Employed"}}
                                      options = {emp_data}
                                      isSearchable = {false}
                                      onChange = {changEmpStatus}
                                      tabIndex={null}
                                    />,
                          education:<Select styles={customStyles1}
                                      defaultValue={{label: "Bachelor's", value: "Bachelor's"}}
                                      options = {eduattain}
                                      isSearchable = {false}
                                      onChange = {changeEduLevel}
                                      tabIndex={null}
                                    />  
                        }[type_b]
                      }
                      <Select 
                      styles={listoptions1}
                      value = {multiVariable}
                      menuIsOpen={true}
                      onChange = {changeList}
                      options = {variables}
                      isSearchable = {false}
                      />
                      <div style={{ padding: 10 }} /> 
                      <Select 
                        styles={select_attribution1}
                        menuIsOpen={true}
                        isMulti={true}
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
                      <div style={{marginBottom:60}}></div>
                    </div>
                  </div>
                  <div className={data_grid}>
                    <div className='a'>
                      <div className = 'title'>
                      {
                        {
                          education: eduLevelTitle.toUpperCase()+' BY YEAR: UNITED STATES, '+most_recent_year+'-'+(most_recent_year-4),
                          employment:empTitle.toUpperCase()+' BY YEAR: UNITED STATES, '+most_recent_year+'-'+(most_recent_year-4)
                        }[type_b]
                      }
                      </div>
                      <ButtonGroup id = 'employment' thewidth = {'30%'} buttons={[
                      "Labor Force", 
                      "Education"]}
                      AfterClick = {changeButton_B}
                      />
                      <div style = {{maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto'}}/>
                      {
                        {
                          employment: <HighchartsReact highcharts={Highcharts} options={time_year}/>,
                          education:  <HighchartsReact highcharts={Highcharts} options={edutime_year}/>
                        }[type_b]
                      }
                      <ContentDowndrop buttonLabel = '' 
                        clickedId = {clickedId1}
                        symbol = {symbol1}
                        content = {content1}
                        background = '#f0f0f0'
                        your_color = '#008e84'
                        textwidth = 'text-contain'
                        onClick = {clickAccordion1}
                        textContent={'...'}
                      />
                    </div>
                    <div className='b' style={{display:interface_side}}>
                    {
                        {
                          employment:<Select styles={customStyles}
                                        defaultValue={{label: "Employed", value: "Employed"}}
                                        options = {emp_data}
                                        isSearchable = {false}
                                        onChange = {changEmpStatus}
                                        tabIndex={null}
                                      />,
                          education: <Select styles={customStyles}
                                        defaultValue={{label: "Bachelor's", value: "Bachelor's"}}
                                        options = {eduattain}
                                        isSearchable = {false}
                                        onChange = {changeEduLevel}
                                        tabIndex={null}
                                      />
                        }[type_b]
                      }
                      <Select 
                      styles={listoptions}
                      value = {multiVariable}
                      menuIsOpen={true}
                      options = {variables}
                      onChange = {changeList}
                      isSearchable = {false}
                      tabIndex={null}/>
                      <div style={{ padding: 10 }} />
                      <Select 
                        styles={select_attribution}
                        value = {multi_attribution}
                        menuIsOpen={true}
                        isMulti={true}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        maxMenuHeight={200}
                        components={{
                          Option
                        }}
                        options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
                        isSearchable = {false}
                        onChange = {changeAttribution_A}
                        tabIndex={null}
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className='inside_container'>
                  <div className='a'>
                    <div className = 'title'>{'NATIONAL '+button_group_a.toUpperCase()+' BY AGE'}</div>
                    <ButtonGroup id = 'employment' thewidth = {'30%'} buttons={[
                      "Employment Rates", 
                      "Earnings"]}
                      AfterClick = {changeButton_A}
                    />
                    <HighchartsReact highcharts={Highcharts} options={empage}/>
                    <ContentDowndrop buttonLabel = '' 
                      clickedId = {clickedId1}
                      symbol = {symbol1}
                      content = {content1}
                      background = '#f0f0f0'
                      your_color = '#008e84'
                      textwidth = 'text-contain'
                      onClick = {clickAccordion1}
                      textContent={'...'}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className='inside_container'>
                  <div className='a'>
                    <div className = 'title'>{'NATIONAL '+button_group_a.toUpperCase()+' BY LEVELS OF EDUCATION'}</div>
                    <ButtonGroup id = 'employment' thewidth = {'30%'} buttons={[
                      "Employment Rates", 
                      "Earnings"]}
                      AfterClick = {changeButton_A}
                    />
                    <HighchartsReact highcharts={Highcharts} options={eduyear}/>
                    <ContentDowndrop buttonLabel = '' 
                      clickedId = {clickedId1}
                      symbol = {symbol1}
                      content = {content1}
                      background = '#f0f0f0'
                      your_color = '#008e84'
                      textwidth = 'text-contain'
                      onClick = {clickAccordion1}
                      textContent={'...'}
                    />
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>
    );
}

export default TimeSeries;