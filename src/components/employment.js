// Need to add ages on type of employment and salary
// And add sample sizes on type of employment too.
// Fix salary range title too.
//Import React and css
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import './dashboard.css';
import thelogo from './logo_export.js'
import citation from './citation.js'

//Data
import most_recent_year from './assets/acs_year.json';
import employment from './assets/employment.json';

//Widgets
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select, { components } from 'react-select';
import ButtonGroup from './buttongroup.js';
import ContentDowndrop from "./content_downdrop";
import Table from './table.js'

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
import HCxrange from 'highcharts/modules/xrange';

// Add pattern in Highcharts
HCPattern(Highcharts);
HCMore(Highcharts);
HC_exporting(Highcharts);
HCxrange(Highcharts);

// General
let thelist = [
  {label: 'United States', value: 'United States'},
  {label: 'Alabama', value: 'Alabama'},
  {label: 'Alaska', value: 'Alaska'},
  {label: 'Arizona', value: 'Arizona'},
  {label: 'Arkansas', value: 'Arkansas'},
  {label: 'California', value: 'California'},
  {label: 'Colorado', value: 'Colorado'},
  {label: 'Connecticut', value: 'Connecticut'},
  {label: 'Delaware', value: 'Delaware'},
  {label: 'District of Columbia', value: 'District of Columbia'},
  {label: 'Florida', value: 'Florida'},
  {label: 'Georgia', value: 'Georgia'},
  {label: 'Hawaii', value: 'Hawaii'},
  {label: 'Idaho', value: 'Idaho'},
  {label: 'Illinois', value: 'Illinois'},
  {label: 'Indiana', value: 'Indiana'},
  {label: 'Iowa', value: 'Iowa'},
  {label: 'Kansas', value: 'Kansas'},
  {label: 'Kentucky', value: 'Kentucky'},
  {label: 'Louisiana', value: 'Louisiana'},
  {label: 'Maine', value: 'Maine'},
  {label: 'Maryland', value: 'Maryland'},
  {label: 'Massachusetts', value: 'Massachusetts'},
  {label: 'Michigan', value: 'Michigan'},
  {label: 'Minnesota', value: 'Minnesota'},
  {label: 'Mississippi', value: 'Mississippi'},
  {label: 'Missouri', value: 'Missouri'},
  {label: 'Montana', value: 'Montana'},
  {label: 'Nebraska', value: 'Nebraska'},
  {label: 'Nevada', value: 'Nevada'},
  {label: 'New Hampshire', value: 'New Hampshire'},
  {label: 'New Jersey', value: 'New Jersey'},
  {label: 'New Mexico', value: 'New Mexico'},
  {label: 'New York', value: 'New York'},
  {label: 'North Carolina', value: 'North Carolina'},
  {label: 'North Dakota', value: 'North Dakota'},
  {label: 'Ohio', value: 'Ohio'},
  {label: 'Oklahoma', value: 'Oklahoma'},
  {label: 'Oregon', value: 'Oregon'},
  {label: 'Pennsylvania', value: 'Pennsylvania'},
  {label: 'Rhode Island', value: 'Rhode Island'},
  {label: 'South Carolina', value: 'South Carolina'},
  {label: 'South Dakota', value: 'South Dakota'},
  {label: 'Tennessee', value: 'Tennessee'},
  {label: 'Texas', value: 'Texas'},
  {label: 'Utah', value: 'Utah'},
  {label: 'Vermont', value: 'Vermont'},
  {label: 'Virginia', value: 'Virginia'},
  {label: 'Washington', value: 'Washington'},
  {label: 'West Virginia', value: 'West Virginia'},
  {label: 'Wisconsin', value: 'Wisconsin'},
  {label: 'Wyoming', value: 'Wyoming'}
]
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

const Employment = ({colors, justcolor, colorfill}) => {
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
  const [searchable, setSearchable] = useState(true)
  const [slice_string, setSliceString] = useState([50,''])
  const [paddingSide, setPaddingSide] = useState(null)
  useEffect(() => {
    if(size[0] < 900 & size[0] > 550 ){
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      setSearchable(false)
      setHC_Width(size[0]/1.2)
      setSliceString([10,'.'])
      setPaddingSide('10px')
    }else if(size[0] < 551){
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      setSearchable(false)
      setHC_Width(size[0]/1.2)
      setSliceString([5,'.'])
      setPaddingSide('6px')
    }else{
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

  // Create Tab Force Re-Rendering
  const [a_tab, set_A_Tab] = useState(0)

  // Effect of button groups
  const [button_group_a, setButtonGroup_a] = useState('Employment Rate')
  const [status_a, setStatus_A] = useState('employed')
  const [first_desc, setFirstDesc] = useState('employed')
  const changeButton_A = (e) => {
    setButtonGroup_a(e.target.name)
    if(e.target.name === 'Employment Rate'){
      setStatus_A('employed')
      setFirstDesc('employed')
    }else if(e.target.name === 'Unemployment Rate'){
      setStatus_A('unemployed')
      setFirstDesc('unemployed')
    }else if(e.target.name === 'Not in Labor Force'){
      setStatus_A('notinLF')
      setFirstDesc('not in labor force')
    }
  }

  // Effect of button groups for Self-Employed, Business Owner, Full-Time
  const [button_group_selfEmp, setButtonGroup_selfEmp] = useState('Self-Employment')
  const [status_selfEmp, setStatus_selfEmp] = useState('self-employed')
  const [first_desc_selfEmp, setFirstDesc_selfEmp] = useState('self-employed')

  const changeButton_SelfEmp = (e) => {
    setButtonGroup_selfEmp(e.target.name)
    if(e.target.name === 'Self-Employment'){
      setStatus_selfEmp('self-employed')
      setFirstDesc_selfEmp('self-employed')
    }else if(e.target.name === 'Business Ownership'){
      setStatus_selfEmp('business owner')
      setFirstDesc_selfEmp('business owners')
    }else if(e.target.name === 'Working Full-Time'){
      setStatus_selfEmp('full-time')
      setFirstDesc_selfEmp('full-time workers')
    }
  }

  // Interacting Selections
  const [selected_attributions, setAttributions] = useState('overall')
  const [deaf_labels, setDeafLabels] = useState(['deaf people'])
  const [hear_labels, setHearLabels] = useState(['hearing people'])
  const [multiVariable, setMultiVariable] = useState([{label: 'Overall', value: 'Overall', variable: 'overall', variables: [''],
                                                       deaf: ['deaf people'], hearing: ['hearing people']}])
  const [categories, setCategories] = useState([''])
  const [export_height,setExportHeight] = useState('450px')
  const [more_options, setMoreOptions] = useState(' ')
  const [emptitle_by,setEmpTitleBy] = useState('')
  const changeList = (e) => {
    setAttributions(e.variable)
    setMultiVariable(e)
    setCategories(e.variables)
    setDeafLabels(e.deaf)
    setHearLabels(e.hearing)
    if(e.variable === 'overall'){
      setExportHeight('450px')
      setMoreOptions(' ')
      setEmpTitleBy('')
    }else if(e.variable === 'race'){
      setExportHeight('590px')
      setMoreOptions(' Race ')
      setEmpTitleBy(' By Race')
    }else if(e.variable === 'gender'){
      setExportHeight('466px')
      setMoreOptions(' Gender ')
      setEmpTitleBy(' By Gender')
    }else if(e.variable === 'disability'){
      setExportHeight('498px')
      setMoreOptions(' Disability ')
      setEmpTitleBy(' By Disability')
    }else if(e.variable === 'age'){
      setExportHeight('600px')
      setMoreOptions(' Age ')
      setEmpTitleBy(' By Age')
    }
  }

  // Effect of Attributions under React Selection
  const [num_col, setNumCol] = useState([0,6])
  const [bar_col, setBarColor] = useState(['teal', 'black'])
  const [attribute, setAttribution] = useState(['deaf','hearing'])
  const [words, setWords] = useState(['deaf people','hearing people'])
  const [multi_attribution, setMultiAttribution] = useState([{label: 'deaf', value: 'deaf', variable: 'overall', color: 'teal', words: 'deaf people'},
  {label: 'hearing', value: 'hearing', variable: 'overall', color: 'black', words: 'hearing people'}])

  const changeAttribution_A = (e) => {
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
  const [content1, setContent1] = useState('accordion-content-active');
  const clickAccordion1 = () => {
    clickedId1 === 'accordion-btn active' ? setClickedId1('accordion-btn') : setClickedId1('accordion-btn active');
    symbol1 === 'icon' ? setSymbol1('icon-active') : setSymbol1('icon');
    content1 === 'accordion-content-active' ? setContent1('accordion-content') : setContent1('accordion-content-active');
  }

  // State Selection
  const [chosen_state, setChosenState] = useState('United States');
  const [multi_state, setMultiState] = useState([  {label: 'United States', value: 'United States'}])
  const [year, setYear] = useState(most_recent_year);
  const [in_the, setIn_The] = useState(' In the ');

  const changeEmpState = (e) => {
    setChosenState(e.value)
    setMultiState(e)
    if(e.value === 'United States'){
      setIn_The(' In the ')
      setYear(most_recent_year)
    }else{
      setIn_The(' In ')
      setYear((most_recent_year-4)+'-'+(most_recent_year))
    }
  }

  // Effect of Accordion
  // More Options - Sidebar
  const [clickedId, setClickedId] = useState('accordion-btn');
  const [symbol, setSymbol] = useState('icon');
  const [content, setContent] = useState('accordion-content');
  const [chart, setChart] = useState('accordionBtn')
  const [tabindex_acc, setTabIndex_Acc] = useState('-1')
  const clickAccordion = () => {
    clickedId === 'accordion-btn active' ? setClickedId('accordion-btn') : setClickedId('accordion-btn active');
    symbol === 'icon' ? setSymbol('icon-active') : setSymbol('icon');
    content === 'accordion-content-active' ? setContent('accordion-content') : setContent('accordion-content-active');
    if(content === 'accordion-content'){
      setChart('accordionBtnActive')   
      setTabIndex_Acc('0')
    }else{
      setChart('accordionBtn')
      setTabIndex_Acc('-1')
    }
  }

  // Math Round
  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  // Dollar format suggested by one guy in https://stackoverflow.com/questions/5340530/how-to-format-a-dollar
  function formatDollar(num) {
    var p = num.toFixed(2).split(".");
    return ["$", p[0].split("").reverse().reduce(function(acc, num, i) {
        return num + (i && !(i % 3) ? "," : "") + acc;
    }, "."), p[1]].join("");
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
  
  // Size Checker
  const size_checker = function(n){
    if(n < 100){return 'less than 100'}else{return n}
  }

  // Employment Chart
  let employ = {
    chart:{
      type: 'column',
      width: HCwidth,
      height: 330,
      animation: {
        duration: 1000
      },
      /*resetZoomButton: {
        theme: {
          fill: '#f0f0f0',
          stroke: 'silver',
          style: {
            color: '#838383',
            fontFamily: 'Roboto',
            align: 'center',
            fontSize: '16px'
          },
          r: 0,
          states: {
              hover: {
                  fill: '#008e84',
                  stroke: '#008e84',
                  style: {
                      color: 'white'
                  }
              }
          }
        },
        position: {
            //align: 'right' by default
            verticalAlign: 'bottom',
            x: -10,
            y: -40
        }
      }*/
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
      labels: {
        style: {
          fontSize: '16px',
          fontFamily: 'Roboto'
        }
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.type === 'employment' & 
        employment.state === chosen_state &
        (employment.attribution === attribute[0] | employment.attribution === attribute[1]) &
        employment.status === status_a).map(
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
            (employment.filter(employment => (employment.attribution === attribute[0] | 
              employment.attribution === attribute[1]) & 
              employment.status === status_a &  
              employment.type === 'employment' & 
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
        employment.status === status_a &  
        employment.type === 'employment' & 
        employment.state === chosen_state).map(employment => [0,employment.percentage])
    },
    { showInLegend: true,
      name: attribute[1],
      color: colorfill[num_col[1]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[1] & 
        employment.status === status_a & 
        employment.type === 'employment' & 
        employment.state === chosen_state).map(employment => [0,employment.percentage])
    }],
    exporting: {
      width: 2000,
      sourceHeight: '450px',
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        title: {
          text: button_group_a+in_the.toLowerCase()+chosen_state+', '+year,
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        subtitle: {
          text: in_the+chosen_state+', among people ages 16-64, an estimated '+
          employment.filter(employment => employment.attribution === attribute[0] & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => [employment.margin_errors,employment.percentage]).map(
              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
            )+
         words[0]+' are '+first_desc+', compared to '+
          employment.filter(employment => employment.attribution === attribute[1] & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => [employment.margin_errors,employment.percentage]).map(
              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ': ME[1] + '% of ')}
            )+
          words[1]+'.<br><br>In this chart, estimates are based on a sample size of '+
          employment.filter(employment => employment.attribution === attribute[0] & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => employment.n).map(
              function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+' '+
          attribute[0]+' people and '+
          employment.filter(employment => employment.attribution === attribute[1] & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => employment.n).map(
            function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+
          ' '+attribute[1]+
          ' people who participated '+in_the.toLowerCase()+year+
          ' American Community Survey. The margin of errors are '+
          employment.filter(employment => employment.attribution === attribute[0] & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => employment.margin_errors)+
          '% for '+words[0]+' and '+
          employment.filter(employment => employment.attribution === attribute[1] & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => employment.margin_errors)+
          '% for '+words[1]+'.',
          style: {
            fontSize: '11px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: -10
        },
        caption: {
          text: citation,
          style: {
            fontSize: '8.5px'
          },
          y: 20
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
  };
  let employ_variable_only = {
    chart:{
      type: 'column',
      width: HCwidth,
      height: 330,
      animation: {
        duration: 1000
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: categories,
      visible: true,
      title: {
        text: null
      },
      labels: {
        style: {
          fontSize: '16px',
          fontFamily: 'Roboto'
        }
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.type === 'employment' & 
      employment.variable === selected_attributions & employment.state === chosen_state &
      employment.status === status_a).map(
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
              (employment.filter(employment => employment.type === 'employment' & 
              employment.variable === selected_attributions & employment.state === chosen_state &
              employment.status === status_a & employment.percentage === this.y & employment.attribution.includes(this.series.name)).map(
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
      data: employment.filter(employment => employment.type === 'employment' & 
        employment.variable === selected_attributions & employment.state === chosen_state &
        employment.status === status_a & employment.attribution.includes('deaf')).map(
        employment => [employment.index,employment.percentage])
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === 'employment' & 
        employment.variable === selected_attributions & employment.state === chosen_state &
        employment.status === status_a & employment.attribution.includes('hearing')).map(
        employment => [employment.index,employment.percentage])
    }],
    exporting: {
      width: 2000,
      sourceHeight:export_height,
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        title: {
          text: button_group_a+in_the.toLowerCase()+chosen_state+', '+year,
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        subtitle: {
          text: in_the+chosen_state+', among people ages 16-64, an estimated'+
          employment.filter(employment => employment.type === 'employment' & 
            employment.variable === selected_attributions & employment.state === chosen_state &
            employment.status === status_a & employment.attribution.includes('deaf')).map(
              function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
              ' and '+
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              deaf_labels[employment.index] : ' '+ 
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              deaf_labels[employment.index]})+
          ' are '+first_desc+', compared to '+
          employment.filter(employment => employment.type === 'employment' & 
            employment.variable === selected_attributions & employment.state === chosen_state &
            employment.status === status_a & employment.attribution.includes('hearing')).map(
              function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
              ' and '+
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              hear_labels[employment.index] : ' '+
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              hear_labels[employment.index]})+
          '.<br><br>In this chart, estimates are based on a sample size of '+
          size_checker(employment.filter(employment => employment.type === 'employment' & 
            employment.variable === selected_attributions & employment.state === chosen_state &
            employment.status === status_a & employment.attribution.includes('deaf')).map(employment => employment.n).reduce(
              (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
          size_checker(employment.filter(employment => employment.type === 'employment' & 
            employment.variable === selected_attributions & employment.state === chosen_state &
            employment.status === status_a & employment.attribution.includes('hearing')).map(employment => employment.n).reduce(
              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
          ' hearing people who participated '+in_the.toLowerCase()+year+
          ' American Community Survey. The margin of errors are '+
          employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => employment.margin_errors)+
          '% for deaf people and '+
          employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status === status_a & 
            employment.type === 'employment' & 
            employment.state === chosen_state).map(employment => employment.margin_errors)+
          '% for hearing people.',
          style: {
            fontSize: '11px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: -10
        },
        caption: {
          text: citation,
          style: {
            fontSize: '8.5px'
          },
          y: 20
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
  };


  // Type of Employment
  let type_employ = {
    chart:{
      type: 'column',
      width: HCwidth,
      height: 330,
      animation: {
        duration: 1000
      },
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
      labels: {
        style: {
          fontSize: '16px',
          fontFamily: 'Roboto'
        }
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => (employment.attribution === attribute[0]|employment.attribution === attribute[1]) & 
        employment.status === status_selfEmp &  
        employment.type === 'self-employment' & 
        employment.state === 'United States').map(employment => employment.percentage)),
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
            (employment.filter(employment => (employment.attribution === attribute[0] | 
              employment.attribution === attribute[1]) & 
              employment.status === status_selfEmp &  
              employment.type === 'self-employment' & 
              employment.state === 'United States' & employment.attribution.includes(this.series.name)).map(
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
        employment.status === status_selfEmp &  
        employment.type === 'self-employment' & 
        employment.state === 'United States').map(employment => employment.percentage)
    },
    { showInLegend: true,
      name: attribute[1],
      color: colorfill[num_col[1]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[1] & 
        employment.status === status_selfEmp & 
        employment.type === 'self-employment' & 
        employment.state === 'United States').map(employment => employment.percentage)
    }],
    exporting: {
      width: 2000,
      sourceHeight: '450px',
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        title: {
          text: button_group_selfEmp+' in the United States, '+most_recent_year,
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        subtitle: {
          text: 'In the United States, among people ages 16-64, an estimated '+
          employment.filter(employment => employment.attribution === attribute[0] & 
            employment.status === status_selfEmp & 
            employment.type === 'self-employment' & 
            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
            )+
          words[0]+' are '+first_desc_selfEmp+', compared to '+
          employment.filter(employment => employment.attribution === attribute[1] & 
            employment.status === status_selfEmp & 
            employment.type === 'self-employment' & 
            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
            )+
          words[1]+'.<br><br>In this chart, estimates are based on a sample size of '+
          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
            employment.state === 'United States' &
            employment.status === status_selfEmp & 
            employment.attribution === attribute[0]).map(employment => employment.n).reduce(
            (sum, a) => sum + a, 0).toLocaleString('en-US'))+' '+
          words[0]+' people and '+
          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
            employment.state === 'United States' &
            employment.status === status_selfEmp & 
            employment.attribution === attribute[1]).map(employment => employment.n).reduce(
            (sum, a) => sum + a, 0).toLocaleString('en-US'))+' '+
          words[1]+' people who participated in the '+most_recent_year+
          ' American Community Survey. The margin of errors are '+
          employment.filter(employment => employment.attribution === attribute[0] & 
            employment.status === status_selfEmp & 
            employment.type === 'self-employment' & 
            employment.state === 'United States').map(employment => employment.margin_errors)+
          '% for '+words[0]+' and '+
          employment.filter(employment => employment.attribution === attribute[1] & 
            employment.status === status_selfEmp & 
            employment.type === 'self-employment' & 
            employment.state === 'United States').map(employment => employment.margin_errors)+
          '% for '+words[1]+'.',
          style: {
            fontSize: '11px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: -10
        },
        caption: {
          text: citation,
          style: {
            fontSize: '8.5px'
          },
          y: 20
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
  };
  let type_employ_variable_only = {
    chart:{
      type: 'column',
      width: HCwidth,
      height: 330,
      animation: {
        duration: 1000
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: categories,
      visible: true,
      title: {
        text: null
      },
      labels: {
        style: {
          fontSize: '16px',
          fontFamily: 'Roboto'
        }
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.status === status_selfEmp &  
      employment.type === 'self-employment' & 
      employment.state === 'United States' &
      employment.variable === selected_attributions).map(
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
            (employment.filter(employment => employment.status === status_selfEmp &  
            employment.type === 'self-employment' & 
            employment.state === 'United States' &
            employment.variable === selected_attributions &
            employment.percentage === this.y & employment.attribution.includes(this.series.name)).map(
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
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === 'self-employment' & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === status_selfEmp & employment.attribution.includes('deaf')).map(
        employment => employment.percentage)
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.type === 'self-employment' & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === status_selfEmp & employment.attribution.includes('hearing')).map(
        employment => employment.percentage)
    }],
    exporting: {
      width: 2000,
      sourceHeight:export_height,
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        title: {
          text: button_group_selfEmp+' in the United States, '+most_recent_year,
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        subtitle: {
          text: 'In the United States, among people ages 16-64, an estimated'+
          employment.filter(employment => employment.type === 'self-employment' & 
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === status_selfEmp & employment.attribution.includes('deaf')).map(
              function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
              ' and '+
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              deaf_labels[employment.index] : ' '+ 
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              deaf_labels[employment.index]})+
          ' are '+first_desc_selfEmp+', compared to '+
          employment.filter(employment => employment.type === 'self-employment' & 
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === status_selfEmp & employment.attribution.includes('hearing')).map(
              function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
              ' and '+
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              hear_labels[employment.index] : ' '+
              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              hear_labels[employment.index]})+
          '.<br><br>In this chart, estimates are based on a sample size of '+
          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
            employment.state === 'United States' &
            employment.status === status_selfEmp & 
            employment.attribution === 'deaf').map(employment => employment.n).reduce(
            (sum, a) => sum + a, 0).toLocaleString('en-US'))+
          ' deaf people and '+
          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
            employment.state === 'United States' &
            employment.status === status_selfEmp & 
            employment.attribution === 'hearing').map(employment => employment.n))+
          ' hearing people who participated in the '+most_recent_year+
          ' American Community Survey. The margin of errors are '+
          employment.filter(employment => employment.attribution === attribute[0] & 
            employment.status === status_selfEmp & 
            employment.type === 'self-employment' & 
            employment.state === 'United States').map(employment => employment.margin_errors)+
          '% for deaf people and '+
          employment.filter(employment => employment.attribution === attribute[1] & 
            employment.status === status_selfEmp & 
            employment.type === 'self-employment' & 
            employment.state === 'United States').map(employment => employment.margin_errors)+
          '% for hearing people.',
          style: {
            fontSize: '11px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: -10
        },
        caption: {
          text: citation,
          style: {
            fontSize: '8.5px'
          },
          y: 20
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
  };

  let salary_range = {
    chart:{
      type: 'column',
      width: HCwidth,
      height: 330,
      animation: {
        duration: 1000
      },
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
      labels: {
        style: {
          fontSize: '16px',
          fontFamily: 'Roboto'
        }
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => (employment.attribution === attribute[0]|employment.attribution === attribute[1]) & 
        employment.status === 'earning' &  
        employment.type === 'salary-range' & 
        employment.state === 'United States').map(employment => employment.median_income)),
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          return '$'+this.value/1000+'K'
        }
      }
    },
    tooltip: {
      formatter: function(){
        return this.series.name+'<br><b>$'+
          this.y/1000+'K</b></br>'
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
        formatter: function(){
          if(
            (employment.filter(employment => (employment.attribution === attribute[0]|employment.attribution === attribute[1]) & 
            employment.status === 'earning' &  
            employment.type === 'salary-range' & 
            employment.state === 'United States' & 
            employment.attribution.includes(this.series.name)).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.01)
          ){
            return '\u26a0$'+this.y/1000+'K'
          }else{
            return '$'+this.y/1000+'K'
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
        employment.status === 'earning' &  
        employment.type === 'salary-range' & 
        employment.state === 'United States').map(employment => employment.median_income)
    },
    { showInLegend: true,
      name: attribute[1],
      color: colorfill[num_col[1]],
      borderColor: colorfill[num_col[0]],
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === attribute[1] & 
        employment.status === 'earning' &  
        employment.type === 'salary-range' & 
        employment.state === 'United States').map(employment => employment.median_income)
    }],
    exporting: {
      width: 2000,
      sourceHeight: '450px',
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        title: {
          text: 'Median Salary in the United States, '+most_recent_year,
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        subtitle: {
          text: 'Based on the median annual earning report, in the United States, among people ages 16-64,'+
          employment.filter(employment => employment.status === 'earning' &  
            employment.type === 'salary-range' & 
            employment.state === 'United States' &  
            employment.attribution === attribute[0]).map(
              function(employment){return (
              ' '+words[0]+' who are working full-time earn $'+
              +employment.median_income/1000 + 'K')})+
          ', compared to '+
          employment.filter(employment => employment.status === 'earning' &  
            employment.type === 'salary-range' & 
            employment.state === 'United States' &  
            employment.attribution === attribute[1]).map(
              function(employment){return (
                ' '+words[1]+' earn $'+
                +employment.median_income/1000 + 'K.')})+
                '<br><br>In this chart, estimates are based on a sample size of '+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === 'salary-range' & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[0]).map(employment => employment.n).map(
                    function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+' '+
                words[0]+' people and '+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === 'salary-range' & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[1]).map(employment => employment.n).map(
                  function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+
                ' '+words[1]+
                ' people who participated in the '+most_recent_year+
                ' American Community Survey. The margin of errors are '+
                formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                  employment.type === 'salary-range' & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[0]).map(employment => employment.margin_errors)))+
                ' for '+words[0]+' and '+
                formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                  employment.type === 'salary-range' & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[1]).map(employment => employment.margin_errors)))+
                ' for '+words[1]+'.',
          style: {
            fontSize: '11px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: -10
        },
        caption: {
          text: citation,
          style: {
            fontSize: '8.5px'
          },
          y: 20
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
  };
  let salary_variable_only = {
    chart:{
      type: 'column',
      width: HCwidth,
      height: 330,
      animation: {
        duration: 1000
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: categories,
      visible: true,
      title: {
        text: null
      },
      labels: {
        style: {
          fontSize: '16px',
          fontFamily: 'Roboto'
        }
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => 
        employment.status === 'earning' &  
        employment.type === 'salary-range' & 
        employment.state === 'United States' & 
        employment.variable === selected_attributions).map(employment => employment.median_income)),
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          return '$'+this.value/1000+'K'
        }
      }
    },
    tooltip: {
      formatter: function(){
        if(this.x === 'blind' & 'deaf' === this.series.name){
          return '<br/> deafblind: $'+
            this.y/1000 +'K';
        }else if(this.x === 'disabled' & 'deaf' === this.series.name){
          return '<br/> deafdisabled: $'+
            this.y/1000 +'K';
        }else if(this.x === 'no additional disabilities'){
          return '<br/>'+this.series.name+' with '+this.x+': $'+
            this.y/1000 +'K';
        }else{
          return '<br/>'+ this.series.name+' '+this.x+
            ': $'+this.y/1000 +'K';
        }
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
        formatter: function(){
          if(
            (employment.filter( 
              employment =>employment.status === 'earning' &  
              employment.type === 'salary-range' & 
              employment.state === 'United States' & 
              employment.variable === selected_attributions &
              employment.attribution.includes(this.series.name)).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.001)
          ){
            return '\u26a0$'+this.y/1000+'K'
          }else{
            return '$'+this.y/1000+'K'
          }
        },
        }
      }
    },
    series: [{
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      borderWidth: 1,
      data: employment.filter(employment => employment.status === 'earning' &  
        employment.type === 'salary-range' & 
        employment.state === 'United States' & 
        employment.variable === selected_attributions & 
        employment.attribution.includes('deaf')).map(
        employment => employment.median_income)
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      data: employment.filter(employment => employment.status === 'earning' &  
        employment.type === 'salary-range' & 
        employment.state === 'United States' & 
        employment.variable === selected_attributions & 
        employment.attribution.includes('hearing')).map(
        employment => employment.median_income)
    }],
    exporting: {
      width: 2000,
      sourceHeight:export_height,
      buttons: {
        contextButton: {
          text: 'Download',
          symbol: 'download'
        }
      },
      chartOptions: { // specific options for the exported image
        title: {
          text: 'Median Salary in the United States, '+most_recent_year,
          align: 'left',
          style: {
            color: '#787878',
            fontWeight: 700,
            fontFamily: 'Roboto',
            marginRight: 20
          }
        },
        subtitle: {
          text: 'Based on the median annual earning report, in the United States, among people ages 16-64,'+
          employment.filter(employment => employment.status === 'earning' &  
            employment.type === 'salary-range' & 
            employment.state === 'United States' &  
            employment.variable === selected_attributions &
            employment.attribution.includes('deaf')).map(
              function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
              ' and '+
              deaf_labels[employment.index]+
              ' $'+employment.median_income/1000 + 'K': 
              employment.index === 0 ?
              ' '+deaf_labels[employment.index] +' who are working full-time earn $'+
              +employment.median_income/1000 + 'K':
              ' '+deaf_labels[employment.index]+
              ' $'+employment.median_income/1000 + 'K'})+
          ', compared to '+
          employment.filter(employment => employment.status === 'earning' &  
            employment.type === 'salary-range' & 
            employment.state === 'United States' &  
            employment.variable === selected_attributions &
            employment.attribution.includes('hearing')).map(
              function(employment,index){ return (index !== 0 && hear_labels[hear_labels.length - 1] === hear_labels[employment.index]) ? 
              ' and '+
              hear_labels[employment.index]+
              ' $'+employment.median_income/1000 + 'K.': 
              employment.index === 0 ?
              ' '+hear_labels[employment.index] +' earn $'+
              +employment.median_income/1000 + 'K':
              ' '+hear_labels[employment.index]+
              ' $'+employment.median_income/1000 + 'K'})+
              '<br><br>In this chart, estimates are based on a sample size of '+
              size_checker(employment.filter(employment => employment.status === 'earning' &  
                employment.type === 'salary-range' & 
                employment.state === 'United States' &  
                employment.attribution === 'deaf').map(employment => employment.n).reduce(
                  (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
              size_checker(employment.filter(employment => employment.status === 'earning' &  
                employment.type === 'salary-range' & 
                employment.state === 'United States' &  
                employment.attribution === 'hearing').map(employment => employment.n).reduce(
                  (sum, a) => sum + a, 0)).toLocaleString('en-US')+
              ' hearing people who participated in the '+most_recent_year+
              ' American Community Survey. The margin of errors are '+
              formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                employment.type === 'salary-range' & 
                employment.state === 'United States' &  
                employment.attribution === 'deaf').map(employment => employment.margin_errors)))+
              ' for deaf people and '+
              formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                employment.type === 'salary-range' & 
                employment.state === 'United States' &  
                employment.attribution === 'hearing').map(employment => employment.margin_errors)))+
              ' for hearing people.<br><br>',
          style: {
            fontSize: '11px'
          },
          verticalAlign: 'bottom',
          align: 'left',
          y: -10
        },
        caption: {
          text: citation,
          style: {
            fontSize: '8.5px'
          },
          y: 20
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
  };

  useLayoutEffect(() => {
    if(chosen_state !== 'United States' & a_tab !== 0){
      setYear(most_recent_year)
    }else if(chosen_state !== 'United States' & a_tab === 0){
      setYear((most_recent_year-4)+'-'+(most_recent_year))
    }
  },[year,chosen_state,a_tab])
  

  // Look at UX/UI table for guidelines: https://www.mockplus.com/blog/post/table-ui-design-examples
  //Write HTML d scripts
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
          </div>
          <Tabs aria-label="A set of charts" onSelect={tabIndex => set_A_Tab(tabIndex)}>
            <TabList>
            <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'Employment Rate'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'Median Income'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'Type of Employment'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'Occupational Fields'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            </TabList>
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
                    <Select styles={customStyles1}
                    value = {multi_state}
                    options = {thelist}
                    isSearchable = {searchable}
                    onChange = {changeEmpState}
                    />  
                    <Select 
                    styles={listoptions1}
                    value = {multiVariable}
                    menuIsOpen={true}
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
                        styles={select_attribution1}
                        menuIsOpen={true}
                        isMulti={true}
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
                  <div className = 'title'>{button_group_a.toUpperCase()+emptitle_by.toUpperCase()+': '+chosen_state.toUpperCase()}</div>
                    <ButtonGroup id = 'employment' thewidth = {'26%'} buttons={[
                      "Employment Rate", 
                      "Unemployment Rate", 
                      "Not in Labor Force"]}
                      AfterClick = {changeButton_A}/>
                    {
                      {
                        accordionBtn: <HighchartsReact highcharts={Highcharts} options={employ_variable_only}/>,
                        accordionBtnActive: <HighchartsReact highcharts={Highcharts} options={employ}/>
                      }[chart]
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
                          accordionBtn: Math.max(...employment.filter(employment => employment.type === 'employment' & 
                            employment.variable === selected_attributions & employment.state === chosen_state &
                            employment.status === status_a).map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                            )),
                          accordionBtnActive: Math.max(...employment.filter(employment => (employment.attribution === attribute[0] | 
                            employment.attribution === attribute[1]) & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                            ))
                        }[chart]
                      }
                      textContent={
                        {
                        accordionBtn:
                          in_the+chosen_state+', among people ages 16-64, an estimated'+
                          employment.filter(employment => employment.type === 'employment' & 
                            employment.variable === selected_attributions & employment.state === chosen_state &
                            employment.status === status_a & employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              deaf_labels[employment.index] : ' '+ 
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              deaf_labels[employment.index]})+
                          ' are '+first_desc+', compared to '+
                          employment.filter(employment => employment.type === 'employment' & 
                            employment.variable === selected_attributions & employment.state === chosen_state &
                            employment.status === status_a & employment.attribution.includes('hearing')).map(
                              function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              hear_labels[employment.index] : ' '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              hear_labels[employment.index]})+
                          '.',
                        accordionBtnActive: 
                          in_the+chosen_state+', among people ages 16-64, an estimated '+
                          employment.filter(employment => employment.attribution === attribute[0] & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                            )+
                          words[0]+' are '+first_desc+', compared to '+
                          employment.filter(employment => employment.attribution === attribute[1] & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                            )+
                          words[1]+'.'
                        }[chart]  
                      }
                      textContent1={
                        {
                        accordionBtn: 
                          'In this chart, estimates are based on a sample size of '+
                          size_checker(employment.filter(employment => employment.type === 'employment' & 
                            employment.variable === selected_attributions & employment.state === chosen_state &
                            employment.status === status_a & employment.attribution.includes('deaf')).map(employment => employment.n).reduce(
                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
                          size_checker(employment.filter(employment => employment.type === 'employment' & 
                            employment.variable === selected_attributions & employment.state === chosen_state &
                            employment.status === status_a & employment.attribution.includes('hearing')).map(employment => employment.n).reduce(
                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                          ' hearing people who participated '+in_the.toLowerCase()+year+
                          ' American Community Survey. The margin of errors are '+
                          employment.filter(employment => employment.attribution === 'deaf' & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => employment.margin_errors)+
                          '% for deaf people and '+
                          employment.filter(employment => employment.attribution === 'hearing' & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => employment.margin_errors)+
                          '% for hearing people.',
                        accordionBtnActive: 
                          'In this chart, estimates are based on a sample size of '+
                          employment.filter(employment => employment.attribution === attribute[0] & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => employment.n).map(
                              function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+' '+
                          attribute[0]+' people and '+
                          employment.filter(employment => employment.attribution === attribute[1] & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => employment.n).map(
                            function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+
                          ' '+attribute[1]+
                          ' people who participated '+in_the.toLowerCase()+year+
                          ' American Community Survey. The margin of errors are '+
                          employment.filter(employment => employment.attribution === attribute[0] & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => employment.margin_errors)+
                          '% for '+words[0]+' and '+
                          employment.filter(employment => employment.attribution === attribute[1] & 
                            employment.status === status_a & 
                            employment.type === 'employment' & 
                            employment.state === chosen_state).map(employment => employment.margin_errors)+
                          '% for '+words[1]+'.'
                        }[chart]  
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
                      styles={customStyles}
                      value = {multi_state}
                      options = {thelist}
                      isSearchable = {searchable}
                      onChange = {changeEmpState}
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
                      styles={listoptions}
                      value = {multiVariable}
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
                        styles={select_attribution}
                        value = {multi_attribution}
                        tabIndex = {tabindex_acc}
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
                    styles={listoptions1}
                    value = {multiVariable}
                    menuIsOpen={true}
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
                        styles={select_attribution1}
                        menuIsOpen={true}
                        isMulti={true}
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
                  <div className = 'title'>{'MEDIAN SALARY'+emptitle_by.toUpperCase()+': UNITED STATES'}</div>
                    {
                      {
                        accordionBtn: <HighchartsReact highcharts={Highcharts} options={salary_variable_only}/>,
                        accordionBtnActive: <HighchartsReact highcharts={Highcharts} options={salary_range}/>
                      }[chart]
                    }
                    <ContentDowndrop buttonLabel = '' 
                      clickedId = {clickedId1}
                      symbol = {symbol1}
                      content = {content1}
                      background = '#ffffff'
                      your_color = '#008e84'
                      textwidth = 'text-contain'
                      onClick = {clickAccordion1}
                      textContent={
                        {
                        accordionBtn:
                          'Based on the median annual earning report, in the United States, among people ages 16-64,'+
                          employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.variable === selected_attributions &
                            employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                              ' and '+
                              deaf_labels[employment.index]+
                              ' $'+employment.median_income/1000 + 'K': 
                              employment.index === 0 ?
                              ' '+deaf_labels[employment.index] +' who are working full-time earn $'+
                              +employment.median_income/1000 + 'K':
                              ' '+deaf_labels[employment.index]+
                              ' $'+employment.median_income/1000 + 'K'})+
                          ', compared to '+
                          employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.variable === selected_attributions &
                            employment.attribution.includes('hearing')).map(
                              function(employment,index){ return (index !== 0 && hear_labels[hear_labels.length - 1] === hear_labels[employment.index]) ? 
                              ' and '+
                              hear_labels[employment.index]+
                              ' $'+employment.median_income/1000 + 'K.': 
                              employment.index === 0 ?
                              ' '+hear_labels[employment.index] +' earn $'+
                              +employment.median_income/1000 + 'K':
                              ' '+hear_labels[employment.index]+
                              ' $'+employment.median_income/1000 + 'K'}),
                        accordionBtnActive: 
                          'Based on the median annual earning report, in the United States, among people ages 16-64,'+
                          employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === attribute[0]).map(
                              function(employment){return (
                              ' '+words[0]+' who are working full-time earn $'+
                              +employment.median_income/1000 + 'K')})+
                          ', compared to '+
                          employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === attribute[1]).map(
                              function(employment){return (
                                ' '+words[1]+' earn $'+
                                +employment.median_income/1000 + 'K.')})
                        }[chart]  
                      }
                      textContent1={
                        {
                        accordionBtn: 
                          'In this chart, estimates are based on a sample size of '+
                          size_checker(employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === 'deaf').map(employment => employment.n).reduce(
                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
                          size_checker(employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === 'hearing').map(employment => employment.n).reduce(
                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                          ' hearing people who participated in the '+most_recent_year+
                          ' American Community Survey. The margin of errors are '+
                          formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === 'deaf').map(employment => employment.margin_errors)))+
                          ' for deaf people and '+
                          formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === 'hearing').map(employment => employment.margin_errors)))+
                          ' for hearing people.',
                        accordionBtnActive: 
                          'In this chart, estimates are based on a sample size of '+
                          employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === attribute[0]).map(employment => employment.n).map(
                              function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+' '+
                          words[0]+' people and '+
                          employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === attribute[1]).map(employment => employment.n).map(
                            function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+
                          ' '+words[1]+
                          ' people who participated in the '+most_recent_year+
                          ' American Community Survey. The margin of errors are '+
                          formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === attribute[0]).map(employment => employment.margin_errors)))+
                          ' for '+words[0]+' and '+
                          formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                            employment.type === 'salary-range' & 
                            employment.state === 'United States' &  
                            employment.attribution === attribute[1]).map(employment => employment.margin_errors)))+
                          ' for '+words[1]+'.'
                        }[chart]  
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
                        styles={select_attribution}
                        value = {multi_attribution}
                        tabIndex = {tabindex_acc}
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
                  all information in exported chart.
                </p>
                <p className='aria-text'>Beginning of Interactive Chart</p>
                <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex1}>
                  <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                </button>
                <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}}>
                  <div className='data_sidebar_interface'>
                    <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                      <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                    </button>
                    <Select 
                    styles={listoptions1}
                    value = {multiVariable}
                    menuIsOpen={true}
                    onChange = {changeList}
                    options = {variables}
                    isSearchable = {false}
                    />
                    <div style={{ padding: 10 }} /> 
                    <ContentDowndrop buttonLabel = 'More Options'
                      clickedId = {clickedId}
                      symbol = {symbol}
                      content = {content}
                      background = 'transparent'
                      your_color = 'white'
                      textwidth = 'text-contain1'
                      onClick = {clickAccordion}
                      textContent={
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
                      }
                    />
                    <div style={{marginBottom:60}}></div>
                  </div>
                </div>
                <div className={data_grid}>
                  <div className='a'>
                  <div className = 'title'>{button_group_selfEmp.toUpperCase()+': UNITED STATES'}</div>
                    <ButtonGroup id = 'employment' thewidth = {'26%'} buttons={[
                      "Self-Employment", 
                      "Business Ownership", 
                      "Working Full-Time"]}
                      AfterClick = {changeButton_SelfEmp}/>
                    {
                      {
                        accordionBtn: <HighchartsReact highcharts={Highcharts} options={type_employ_variable_only}/>,
                        accordionBtnActive: <HighchartsReact highcharts={Highcharts} options={type_employ}/>
                      }[chart]
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
                          accordionBtn: Math.max(...employment.filter(employment => employment.type === 'self-employment' & 
                            employment.variable === selected_attributions & employment.state === 'United States' &
                            employment.status === status_selfEmp).map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                            )),
                          accordionBtnActive: Math.max(...employment.filter(employment => (employment.attribution === attribute[0] | 
                            employment.attribution === attribute[1]) & 
                            employment.status === status_selfEmp & 
                            employment.type === 'self-employment' & 
                            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
                            ))
                        }[chart]
                      }
                      textContent={
                        {
                        accordionBtn:
                          'In the United States, among people ages 16-64, an estimated'+
                          employment.filter(employment => employment.type === 'self-employment' & 
                            employment.variable === selected_attributions & employment.state === 'United States' &
                            employment.status === status_selfEmp & employment.attribution.includes('deaf')).map(
                              function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              deaf_labels[employment.index] : ' '+ 
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              deaf_labels[employment.index]})+
                          ' are '+first_desc_selfEmp+', compared to '+
                          employment.filter(employment => employment.type === 'self-employment' & 
                            employment.variable === selected_attributions & employment.state === 'United States' &
                            employment.status === status_selfEmp & employment.attribution.includes('hearing')).map(
                              function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
                              ' and '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              hear_labels[employment.index] : ' '+
                              (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                              hear_labels[employment.index]})+
                          '.',
                        accordionBtnActive: 
                          'In the United States, among people ages 16-64, an estimated '+
                          employment.filter(employment => employment.attribution === attribute[0] & 
                            employment.status === status_selfEmp & 
                            employment.type === 'self-employment' & 
                            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                            )+
                          words[0]+' are '+first_desc_selfEmp+', compared to '+
                          employment.filter(employment => employment.attribution === attribute[1] & 
                            employment.status === status_selfEmp & 
                            employment.type === 'self-employment' & 
                            employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                              function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                            )+
                          words[1]+'.'
                        }[chart]  
                      }
                      textContent1={
                        {
                        accordionBtn: 
                          'In this chart, estimates are based on a sample size of '+
                          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
                            employment.variable === selected_attributions & employment.state === 'United States' &
                            employment.status === status_selfEmp & 
                            employment.attribution.includes('deaf')).map(employment => employment.n).reduce(
                            (sum, a) => sum + a, 0).toLocaleString('en-US'))+
                          ' deaf people and '+
                          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
                            employment.variable === selected_attributions & employment.state === 'United States' &
                            employment.status === status_selfEmp & 
                            employment.attribution.includes('hearing')).map(employment => employment.n).reduce(
                            (sum, a) => sum + a, 0).toLocaleString('en-US'))+
                          ' hearing people who participated in the '+most_recent_year+
                          ' American Community Survey. The margin of errors are '+
                          employment.filter(employment => employment.attribution === 'deaf' & 
                            employment.status === status_selfEmp & 
                            employment.type === 'self-employment' & 
                            employment.state === 'United States').map(employment => employment.margin_errors)+
                          '% for deaf people and '+
                          employment.filter(employment => employment.attribution === 'hearing' & 
                            employment.status === status_selfEmp & 
                            employment.type === 'self-employment' & 
                            employment.state === 'United States').map(employment => employment.margin_errors)+
                          '% for hearing people.',
                        accordionBtnActive: 
                          'In this chart, estimates are based on a sample size of '+
                          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
                            employment.state === 'United States' &
                            employment.status === status_selfEmp & 
                            employment.attribution === attribute[0]).map(employment => employment.n).reduce(
                            (sum, a) => sum + a, 0).toLocaleString('en-US'))+' '+
                          words[0]+' people and '+
                          size_checker(employment.filter(employment => employment.type === 'self-employment' & 
                            employment.state === 'United States' &
                            employment.status === status_selfEmp & 
                            employment.attribution === attribute[1]).map(employment => employment.n).reduce(
                              (sum, a) => sum + a, 0).toLocaleString('en-US'))+' '+
                          words[1]+' people who participated in the '+most_recent_year+
                          ' American Community Survey. The margin of errors are '+
                          employment.filter(employment => employment.attribution === attribute[0] & 
                            employment.status === status_selfEmp & 
                            employment.type === 'self-employment' & 
                            employment.state === 'United States').map(employment => employment.margin_errors)+
                          '% for '+words[0]+' and '+
                          employment.filter(employment => employment.attribution === attribute[1] & 
                            employment.status === status_selfEmp & 
                            employment.type === 'self-employment' & 
                            employment.state === 'United States').map(employment => employment.margin_errors)+
                          '% for '+words[1]+'.'
                        }[chart]  
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
                      including all information in exported chart in the employment rate content.
                    </p>
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
                    <div style={{ padding: 10 }} />
                    <ContentDowndrop buttonLabel = 'More Options' 
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
                        styles={select_attribution}
                        value = {multi_attribution}
                        tabIndex = {tabindex_acc}
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
                <div style = {{height: '500px', overflow: 'scroll'}}>
                  <Table/>
                </div>
                <div className = 'last-row'/>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Employment;