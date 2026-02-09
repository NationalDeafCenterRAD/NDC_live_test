//Import React, CSS, logo, and global level citation
import { 
  useState, useRef, useEffect, 
  useLayoutEffect 
} from "react";
import '../../assets/styles/dashboard.css';
import { 
  national_options, variables, 
  inside_chart_options, attributions,
  state_options, state_inside_chart_options, 
  edulist, geographics
} from "../../components/dashboard/list.jsx";
import thelogo from "../../assets/images/NDC_logo_color_horizontal-black-text.png"
import { useCitation } from '../../components/citation.jsx';
import { useHighChart } from "../../components/dashboard/highcharts.jsx";

//Data
import acs_one_year from '../../data/acs_year.json';
import acs_five_year from '../../data/acs_5_year.json';
import raw_employment from '../../data/employment.json';

//Widgets
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select, { components as Components } from 'react-select';
import Table from '../../components/dashboard/table.jsx'

/*Icons and fonts*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import warning_sign from '../../assets/images/warning_sign.svg';

//Charts
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import "highcharts/modules/exporting";
import "highcharts/modules/accessibility";
import "highcharts-pattern-fill";
import 'highcharts/highcharts-more';

// Persistent shareable link
import { useSearchParams } from 'react-router-dom';

// Standard definition of exporting charts
const exportURL = /*process.env.REACT_APP_BACKEND_URL*/ 'https://export.highcharts.com/';
const fallbackToExportServer = false;
const useHTML = true;

// Filter BIPOC out as NDC requests
const employment = raw_employment.filter(employment => employment.attribution !== 'deaf BIPOC' && employment.attribution !== 'hearing BIPOC');

//Stylize selections in More Option Selection
const Option = (props) => {
  return (
    <div>
      <Components.Option {...props}>
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
      </Components.Option>
    </div>
  );
};

const Dashboard = ({colorfill}) => {
  // Generate unique urls
  const [searchParams, setSearchParams] = useSearchParams();

  // Round up function
  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }
  // This function prevents users from seeing true number if sample size is too small.
  const size_checker = function(n){
    if(n < 100){return 'less than 100'}else{return n}
  }

  // Stylize selection styles
  const chart_side_style = {
    option: (provided, state) => ({
      ...provided,
      background: state.data?.isTitle ? 'white' : state.isSelected ? '#0d7777' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.data?.isTitle ? 'black' : state.isSelected ? 'white': 'black',
      cursor: state.data?.isTitle ? 'default' : state.isDisabled ? 'default' : 'pointer',
      fontWeight: state.data?.isTitle ? 900 : state.isDisabled ? 900 : 300,
      paddingLeft: state.data?.isTitle ? '10px' : '30px',
      pointerEvents: state.data?.isTitle ? 'none' : 'auto'
    }),
    indicatorSeparator: () => {},
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#0d7777',
      "&:hover": {
        color: '#0d7777'
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
      border: '0.5px #0d7777 solid',
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
          color: '#0d7777',
          fontWeight: 700,
      }
    },
    singleValue:(provided) => ({
      ...provided,
      height:'100%',
      color:'#0d7777',
      paddingTop:'3px',
      fontWeight: 700,
    }),
  }
  const second_side_style = {
    option: (provided, state) => ({
      ...provided,
      margin: 0,
      cursor: nationDisabled ? 'not-allowed' : 'pointer',
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected & nationDisabled ? 'transparent' 
      : state.isSelected & !nationDisabled ? '#0d7777' 
      : state.isFocused ? '#ECEDF0' 
      : 'transparent',
      color: nationDisabled ? '#bfbfbf' :
        state.isSelected ? 'white'  : 
        '#0d7777',
      fontSize: 16,
      fontFamily: 'Roboto',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      cursor: 'pointer',
      color: nationDisabled ? '#bfbfbf' :'#0d7777',
      "&:hover": {
        color: '#0d7777'
      }
    }),
    control: (provided) => ({
      ...provided,
      cursor: 'pointer',
      border: '0.5px #0d7777 solid',
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
      border:  '0.5px #0d7777 solid',
      margin:0,
      zIndex: 0,
      padding: 0,
      background: "#F6F6F7",
      borderRadius: '0 0 20px 20px',
      color: '#0d7777',
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
      color: nationDisabled ? '#bfbfbf' : '#0d7777',
    })
  }
  const third_side_style = {
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? 900: 100,
      background: state.isSelected & second_nationDisabled ? 'transparent' 
                : state.isSelected & !second_nationDisabled ? '#0d7777' 
                : state.isFocused ? '#ECEDF0' 
                : 'transparent',
      color: second_nationDisabled ? '#bfbfbf':
      state.isSelected ? 'white' : '#0d7777',
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
  const buttons_under_title = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#0d7777' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white':'#0d7777',
      cursor: 'pointer'
    }),
    indicatorSeparator: () => {},
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#0d7777',
      "&:hover": {
        color: '#0d7777'
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
      border: '0.5px #0d7777 solid',
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
          color: '#0d7777',
      }
    },
    singleValue:(provided) => ({
      ...provided,
      paddingTop:'3px',
      height:'100%',
      color:'#0d7777'
    }),
  }

  // Screen Size Responsive Effects
  const [HCwidth, setHC_Width] = useState(null)
  const [paddingSide, setPaddingSide] = useState('10px')
  const [slice_string, setSliceString] = useState([20,''])
  const [searchable, setSearchable] = useState(true)

  const [data_sidebar, setData_SideBar] = useState('None')
  const [interface_side, setInterface_Side] = useState('unset')
  const [data_grid, setData_Grid] = useState('grid')
  const [downloadText, setDownloadText] = useState('Download')

  useLayoutEffect(() => {
    function updateSize() {
      setPaddingSide(round(3+10*Math.pow(1.01, -650+window.innerWidth)/(1+Math.pow(1.01, -650+window.innerWidth)),2)+'px');
      setSliceString([round(20-12*Math.pow(1.01, 500-window.innerWidth)/(1+Math.pow(1.01, 500-window.innerWidth)),2),'']);
      if(window.innerWidth < 800){
        setHC_Width(window.innerWidth/1.2)
        setInterface_Side('None')
        setData_SideBar('grid')
        setData_Grid('ungrid')
        setSearchable(false)
        setDownloadText('')
      }else if(window.innerWidth < 1200){
        setHC_Width(null)
        setInterface_Side('unset')
        setData_SideBar('None')
        setData_Grid('grid')
        setSearchable(true)
        setDownloadText('')
      }else{
        setHC_Width(null)
        setInterface_Side('unset')
        setData_SideBar('None')
        setData_Grid('grid')
        setSearchable(true)
        setDownloadText('Download')
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  //Screen Screen Responsive Effect: Mobile Size SideBar Open-Close function
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

  // Dropdown text content under Highchart's plots
  const strAccordion = searchParams.get('groups') || 'closed,deaf,hearing';
  const arrayAccordion = strAccordion.split(',');
  const [accordion_is, setAccordionIs] = useState(arrayAccordion[0] === 'closed' ? 'accordion-is' : 'accordion-is-open');
  const [textaccordion_is, setTextAccordionIs] = useState('accordion-is-open');
  const clickButton = () => {
    if(accordion_is === 'accordion-is-open'){
      setAccordionIs('accordion-is');
      searchParams.delete('groups');
    }else{
      setAccordionIs('accordion-is-open');
      searchParams.set('groups',('opened,'+arrayAccordion.slice(1,3)).toString());
    }
    setSearchParams(
      searchParams
    );
  }
  const textButton = () => {
    if(textaccordion_is === 'accordion-is-open') {
      setTextAccordionIs('accordion-is');
    }else{
      setTextAccordionIs('accordion-is-open')
    }
  }

  // Use DOWNLOAD REPORT to trigger tab to Report tab
  const parseIntAndCancelNull = (n) =>  {
    if(n === null){
      return(0);
    }else{
      return(parseInt(n));
    }
  }
  const reportTrigger = parseIntAndCancelNull(searchParams.get("tab"));

  const changeTabNumber = index => {
    searchParams.delete('groups');
    searchParams.delete('states');
    setAccordionIs('accordion-is');
    searchParams.set('tab', index);
    if(index === 2){
      searchParams.delete('attr');
      searchParams.delete('main');
      searchParams.delete('status');
    }else{
      searchParams.set('attr','overall');
      searchParams.set('main','Education Attainment');
      searchParams.set('status',"Bachelor's");
      searchParams.set('chart_type', 'column');
    }
    setSearchParams(
      searchParams
    );

    setSecondDisabled(false);
    setNationDisabled(false);
    setNationSelectDisplay('unset')
    setNationalTitle("Bachelor's Degree Attainment or Higher")
    setTitleBy('')
    setNationDescript(" have completed a bachelor's degree or higher")
    setNationalSchema({label: 'Education Attainment', value: 'Education Attainment', variable: 'education', title: "Bachelor's Degree Attainment or Higher", title_by:'', disabled: false, second_disabled: false, display: 'unset', 
      set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education',
      chartype: 'column', metrics: 'percentage', categories: '', accordion: 'nothing', scope: ''
    })
    setGroupInsideChart('education')

    setDeafLabels(['deaf people'])
    setHearLabels(['hearing people'])

    setInsideChartSchema({label: "Bachelor's", value: "Bachelor's"})
    setInsideChartStatus('bachelor')
    setInsideChartType('education')
    setMetrics('percentage')
    setCategories([''])
    setSentence('')

    setAge('25-64')
    setScope('')
    setSecondSchema([{label: 'Overall', value: 'Overall'}])
    setMoreOptions(' ')
  };

  // Chart Option Change Function - first selection options
  const maintitle = searchParams.get('main') || 'Education Attainment';
  const statusCateg = searchParams.get('status') || national_options.filter(e => e.value === maintitle).map(e => e.set_for_chart)[0].map(e => e.value)[0];
  const selectedAttributions = searchParams.get('attr') || 'overall';
  const chartType = searchParams.get('chart_type') || 'column';

  const [nationSelectDisplay, setNationSelectDisplay] = useState(national_options.filter(e => e.value === maintitle).map(e => e.display)[0]);
  const [title_by, setTitleBy] = useState(national_options.filter(e => e.value === maintitle).map(e => e.title_by)[0]);
  const [nationalSchema, setNationalSchema] = useState(national_options.filter(e => e.value === maintitle));
  const [groupInsideChart, setGroupInsideChart] = useState(national_options.filter(e => e.value === maintitle).map(e => e.variable)[0]);
  const [scope, setScope] = useState(national_options.filter(e => e.value === maintitle).map(e => e.scope)[0])

  const [metrics, setMetrics] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.metrics)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.metrics)[0]);
  const [nationalTitle, setNationalTitle] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.title)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.title)[0]);
  const [nationDescript, setNationDescript] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.description)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.description)[0]);
  const [nationDisabled,setNationDisabled] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.disabled)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.disabled)[0]);
  const [second_nationDisabled,setSecondDisabled] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.second_disabled)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.second_disabled)[0]);
  const [insidechartType, setInsideChartType] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.type)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.type)[0]);
  const [insidechartStatus, setInsideChartStatus] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.variable)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.subvariable)[0]);
  const [sentence, setSentence] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.sentence)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.sentence)[0]);
  const [limit_age, setAge] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.age)[0] ||
    national_options.filter(e => e.value === maintitle).map(e => e.age)[0]);
  const [inside_chart_schema, setInsideChartSchema] = useState(inside_chart_options.filter(e => e.value === statusCateg));
  const [title_color,setTitleColor] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.second_disabled)[0] === true ? '#bfbfbf' : '#0d7777');

  const [categories, setCategories] = useState(variables.filter(e => e.variable === selectedAttributions && e.age === limit_age).map(e => e.variables)[0]);
  const [deaf_labels, setDeafLabels] = useState(variables.filter(e => e.variable === selectedAttributions).map(e => e.deaf)[0]);
  const [hear_labels, setHearLabels] = useState(variables.filter(e => e.variable === selectedAttributions).map(e => e.hearing)[0]);
  const [secondSchema, setSecondSchema] = useState(variables.filter(e => e.variable === selectedAttributions))
  const [more_options, setMoreOptions] = useState(variables.filter(e => e.variable === selectedAttributions).map(e => e.more_options)[0]);

  const changeSection = (e) => {
    if(e.second_disabled === true){
      setTitleColor('#bfbfbf')
    }else{
      setTitleColor('#0d7777')
    }
    searchParams.set('main', e.value);
    searchParams.set('attr','overall');
    searchParams.set('chart_type', e.chartype);

    if(e.set_for_chart[0].value === 'Nothing'){
      searchParams.delete('status');
    }else{
      searchParams.set('status',e.set_for_chart[0].value);
    }
    setSearchParams(
      searchParams
    );

    setSecondDisabled(e.second_disabled);
    setNationDisabled(e.disabled);
    setNationSelectDisplay(e.display)
    setNationalTitle(e.title)
    setTitleBy(e.title_by)
    setNationDescript(e.description)
    setNationalSchema(e)
    setGroupInsideChart(e.variable)

    setDeafLabels(['deaf people'])
    setHearLabels(['hearing people'])

    setInsideChartSchema(e.set_for_chart)
    setInsideChartStatus(e.subvariable)
    setInsideChartType(e.type)
    setMetrics(e.metrics)
    setCategories([''])
    setSentence(e.sentence)

    setAge(e.age)
    setScope(e.scope)
    setSecondSchema([{label: 'Overall', value: 'Overall'}])
    setMoreOptions(' ')
    if(e.accordion !== 'nothing'){
      setAccordionIs(e.accordion)
    }
  }

  // Change Information in Chart using second selection options
  const changeList = (e) => {
    searchParams.set('attr',e.variable);
    
    setSearchParams(
      searchParams
    );

    setSecondSchema(e)
    setCategories(e.variables)
    setDeafLabels(e.deaf)
    setHearLabels(e.hearing)
    setMoreOptions(e.more_options)
    setTitleBy(e.title_by)
  }

  // Change Information inside Chart using Inside Chart Option - third selection options
  const changeInsideChart = (e) => {
    searchParams.set('status',e.value);
    searchParams.set('chart_type', e.chartype);
    
    setSearchParams(
      searchParams
    );

    setInsideChartSchema(e)
    setInsideChartType(e.type)
    setNationalTitle(e.title)
    setMetrics(e.metrics)
    setNationDisabled(e.disabled);
    setSecondDisabled(e.disabled);
    setNationDescript(e.description)
    setSentence(e.sentence)
    setAge(e.age)

    if(e.variable === 'all'){
      setTitleBy('')
      setInsideChartStatus('overall');
      searchParams.set('attr','overall');
      setSecondSchema({label: 'Overall', value: 'Overall'})
      setCategories([''])
      setDeafLabels(['deaf people'])
      setHearLabels(['hearing people'])
      setMoreOptions(' ')
    }else{
      setInsideChartStatus(e.variable)
    }

    setSearchParams(
      searchParams
    );
  }

  // Change geographic locations - first selection options on top of Highcharts plots in "State" tab
  const states_choice = searchParams.get('states') ? searchParams.get('states').split(',') : ['US','Texas'];
  const [chosen_state_a, setChosenStateA] = useState(states_choice[0]);
  const [state_label_a, setLabel_StateA] = useState(geographics.filter(e => e.variable === states_choice[0]).map(e => e.value)[0]);
  const [multi_state_a, setMultiStateA] = useState(geographics.filter(e => e.variable === states_choice[0]));
  const [year, setYear] = useState(acs_one_year);
  const [in_the_a, setIn_TheA] = useState(states_choice[0] === 'US' | states_choice[0] === 'District of Columbia' ? ' In the ' : ' In ');;

  const changeGeoStateA = (e) => {
    searchParams.set('states',e.variable+','+states_choice[1]);
    setChosenStateA(e.variable)
    setLabel_StateA(e.value)
    setMultiStateA(e)
    if(e.value === 'United States' | e.value === 'District of Columbia'){
      setIn_TheA(' In the ')
    }else{
      setIn_TheA(' In ')
    }
    setSearchParams(
      searchParams
    );
  }

  // Change geographic locations - second selection options on top of Highcharts plots in "State" tab
  const [chosen_state_b, setChosenStateB] = useState(states_choice[1]);
  const [state_label_b, setLabel_StateB] = useState(geographics.filter(e => e.variable === states_choice[1]).map(e => e.value)[0]);
  const [multi_state_b, setMultiStateB] = useState(geographics.filter(e => e.variable === states_choice[1]));
  const [in_the_b, setIn_TheB] = useState(states_choice[1] === 'US' | states_choice[1] === 'District of Columbia' ? ' In the ' : ' In ');

  const changeGeoStateB = (e) => {
    searchParams.set('states',states_choice[0]+','+e.variable);
    setChosenStateB(e.variable)
    setLabel_StateB(e.value)
    setMultiStateB(e)
    if(e.value === 'United States' | e.value === 'District of Columbia'){
      setIn_TheB(' In the ')
    }else{
      setIn_TheB(' In ')
    }
    setSearchParams(
      searchParams
    );
  }

  // Change information inside "More Option" interface when interacting
  const [num_col, setNumCol] = useState(
    attributions.filter(e => e.value === arrayAccordion[1] | e.value === arrayAccordion[2]).map(x => x.color)[0] === 'black' ?
      attributions.filter(e => e.value === arrayAccordion[1] | e.value === arrayAccordion[2]).map(x => x.color)[1] === 'black' ?
        [6,8] 
      : 
        [6,0] 
    :
      attributions.filter(e => e.value === arrayAccordion[1] | e.value === arrayAccordion[2]).map(x => x.color)[1] === 'black' ?
        [0,6] 
      : 
        [0,2]
  )
  const [attribute, setAttribution] = useState(arrayAccordion.slice(1,3));
  const [words, setWords] = useState(attributions.filter(e => e.value === arrayAccordion[1] | e.value === arrayAccordion[2]).map(e => e.words))
  const [multi_attribution, setMultiAttribution] = useState(attributions.filter(e => e.value === arrayAccordion[1] | e.value === arrayAccordion[2]))

  const changeAttribution = (e) => {
    // Select attribution of group
    if(e.map(x => x.value)?.length  > 2){
      searchParams.set('groups',(arrayAccordion[0]+','+e.filter(x => x.value !== attribute[0]).map(x => x.value)).toString());
      setMultiAttribution(e.filter(x => x.value !== attribute[0]));
      setAttribution(e.filter(x => x.value !== attribute[0]).map(x => x.value));
      setWords(e.filter(x => x.value !== attribute[0]).map(x => x.words));
    }else{
      if(e.map(x => x.value)?.length  === 2){
        searchParams.set('groups',(arrayAccordion[0]+','+arrayAccordion[1]+','+e.filter(x => x.value !== attribute[0]).map(x => x.value)).toString());
      }else{
        searchParams.set('groups',(arrayAccordion[0]+','+e.map(x => x.value)).toString());
      }
      setMultiAttribution(e);
      setAttribution(e.map(x => x.value));  
      setWords(e.map(x => x.words));      
    }
    setSearchParams(
      searchParams
    );

    if(e.map(x => x.color).length > 2){
      if(e.map(x => x.color)[1] === 'black'){
        if(e.map(x => x.color)[2] === 'black'){
          setNumCol([6,8])
        }else{
          setNumCol([6,0])
        }
      }else{
        if(e.map(x => x.color)[2] === 'black'){
          setNumCol([0,6])
        }else{
          setNumCol([0,2])
        }
      }
    }else{
      if(e.map(x => x.color)[0] === 'black'){
        if(e.map(x => x.color)[1] === 'black'){
          setNumCol([6,8])
        }else{
          setNumCol([6,0])
        }
      }else{
        if(e.map(x => x.color)[1] === 'black'){
          setNumCol([0,6])
        }else{
          setNumCol([0,2])
        }
      }
    }
  }

  // Reset charts if switching to either nation level or state level
  useEffect(() => {
    if(reportTrigger === 1 | reportTrigger === 3){
      setYear((acs_five_year-4)+'-'+(acs_five_year))
    }else{
      setYear(acs_one_year)
    }
  },[reportTrigger]);

  // Warnings for state level
  const [state_warning_sty,setStateWarningSty] = useState('not-warning')
  
  useEffect(()=>{
    if(
      (Math.max(...employment.filter(employment => employment.type === insidechartType & 
        employment.variable === selectedAttributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
        employment.status === insidechartStatus).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
        )) > 0.3 & accordion_is === 'accordion-is' & chartType === 'column') |
      (Math.max(...employment.filter(employment => (employment.attribution === attribute[0] | 
        employment.attribution === attribute[1]) & 
        employment.status === insidechartStatus & 
        employment.type === insidechartType & 
        (employment.state === chosen_state_a | employment.state === chosen_state_b)).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
        )) > 0.3 & accordion_is === 'accordion-is' & chartType === 'column')  |
      (Math.max(...employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
        employment.status === 'phd/dr' & employment.type === 'education' & 
        (employment.state === chosen_state_a | employment.state === chosen_state_b)).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
        )) > 0.3 & chartType === 'all') |
      (Math.min(...employment.filter(employment => employment.type === insidechartType & 
        employment.variable === selectedAttributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
        employment.status === insidechartStatus).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(ME[1])}
        )) === 0 & accordion_is === 'accordion-is' & chartType === 'column') |
      (Math.min(...employment.filter(employment => (employment.attribution === attribute[0] | 
        employment.attribution === attribute[1]) & 
        employment.status === insidechartStatus & 
        employment.type === insidechartType & 
        (employment.state === chosen_state_a | employment.state === chosen_state_b)).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(ME[1])}
        )) === 0 & accordion_is === 'accordion-is' & chartType === 'column')  |
      (Math.min(...employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
        employment.status === 'phd/dr' & employment.type === 'education' & 
        (employment.state === chosen_state_a | employment.state === chosen_state_b)).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(ME[1])}
        )) === 0 & chartType === 'all')
    ){
      setStateWarningSty('shown-warning')
    }else{
      setStateWarningSty('not-warning')
    }
  },[insidechartType,insidechartStatus,attribute, accordion_is, chartType, chosen_state_a, chosen_state_b, selectedAttributions])

  // Get percentage needed for bottom text box
  let [add_stop, setStop] = useState(0);

  const wordCounter = x => {
    if(x.trim().split(/\s+/gi).length/20 > 2){
      setStop((Math.trunc(x.trim().split(/\s+/gi).length/20)-2)*0.03)
    }else{
      setStop(0)
    }
  }

  useEffect(() => {
    if(reportTrigger === 1 & chartType === 'all'){
      wordCounter(
        in_the_b+state_label_b+', among people aged 16-64'+
        (employment.filter(employment => employment.type === insidechartType & 
          employment.variable === selectedAttributions & employment.state === chosen_state_b &
          employment.status !== 'no HS diploma' & employment?.attribution?.includes('deaf') &
          employment.percentage !== 0).length === 0 ? ", the sample size is not sufficient to accurately report the deaf education attainment" :
        ', an estimated'+
        employment.filter(employment => employment.attribution === 'deaf' & 
          employment.status !== 'no HS diploma' &  
          employment.type === 'education' & 
          employment.state === chosen_state_b).map(
          function(employment, index){ return index === 0 ? 
          ' and '+
          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
          (employment.percentage === 0 ? 'N/A of deaf people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
          edulist[index] :
          ' '+employment.percentage+'% '+edulist[index]}).reverse()+
        ', compared to '+
        employment.filter(employment => employment.attribution === 'hearing' & 
          employment.status !== 'no HS diploma' & 
          employment.type === 'education' & 
          employment.state === chosen_state_b).map(
          function(employment, index){ return index === 0 ? 
          ' and '+
          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
          (employment.percentage === 0 ? 'N/A of hearing people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
          edulist[index] :
          ' '+employment.percentage+'% '+edulist[index]}).reverse())+useCitation[2]
      )
    }else if(reportTrigger === 1){
      wordCounter(
        {
          'accordion-is':
            {
              percentage: 
              employment.filter(employment => employment.type === insidechartType & 
                employment.variable === selectedAttributions & employment.state === chosen_state_b &
                employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                employment.percentage !== 0).length === 0 ?
              in_the_b+state_label_b+", among people aged 16-64, the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript :
              in_the_b+state_label_b+', among people aged 16-64, an estimated'+
              employment.filter(employment => employment.type === insidechartType & 
                employment.variable === selectedAttributions & employment.state === chosen_state_b &
                employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                employment.percentage !== 0).map(
                function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                ' and '+
                (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                deaf_labels[employment.index] : ' '+ 
                (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                deaf_labels[employment.index]}).reverse()+
              nationDescript+', compared to '+
              employment.filter(employment => employment.type === insidechartType & 
                employment.variable === selectedAttributions & employment.state === chosen_state_b &
                employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                employment.percentage !== 0).map(
                function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ?
                ' and '+
                (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                hear_labels[employment.index] : ' '+
                (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                hear_labels[employment.index]}).reverse(),
              median_income: ''
            }[metrics],
          'accordion-is-open':
            {
              percentage:
              in_the_b+state_label_b+', among people aged 16-64, an estimated '+
                employment.filter(employment => employment.attribution === attribute[0] & 
                  employment.status === insidechartStatus &  
                  employment.type === insidechartType & 
                  employment.state === chosen_state_b).map(employment => [employment.margin_errors,employment.percentage]).map(
                    function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                  )
                  +
                words[0]+nationDescript+', compared to '+
                employment.filter(employment => employment.attribution === attribute[1] & 
                  employment.status === insidechartStatus &  
                  employment.type === insidechartType & 
                  employment.state === chosen_state_b).map(employment => [employment.margin_errors,employment.percentage]).map(
                    function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                  )+
                words[1],
              median_income: '.'
            }[metrics]
        }[accordion_is]+' '+useCitation[2]
      )
    }else{
      wordCounter(
        {
        'accordion-is':
            {
              percentage: 
                'In the United States, among people aged 25-64'+scope+', an estimated'+
                employment.filter(employment => employment.type === insidechartType & 
                  employment.variable === selectedAttributions & employment.state === 'United States' &
                  employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                  employment.percentage !== 0).map(
                  function(employment,index,row){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index] && row.length > 1) ? 
                  ' and '+
                  (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                  deaf_labels[employment.index] : ' '+ 
                  (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                  deaf_labels[employment.index]})+
                nationDescript+', compared to '+
                employment.filter(employment => employment.type === insidechartType & 
                  employment.variable === selectedAttributions & employment.state === 'United States' &
                  employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                  employment.percentage !== 0).map(
                  function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
                  ' and '+
                  (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                  hear_labels[employment.index] : ' '+
                  (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                  hear_labels[employment.index]}),
              median_income:
                'In the United States, among people aged 16-64 who are working full time,'+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.variable === selectedAttributions &
                  employment?.attribution?.includes('deaf') &
                  employment.median_income !== 0).map(
                    function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                    ' and '+
                    deaf_labels[employment.index]+
                    ' $'+Math.round(employment.median_income/1000) + 'K': 
                    index === 0 ?
                    ' '+deaf_labels[employment.index] +` have a ${insidechartType === 'mean-salary-range' ? 'mean' : 'median'} annual income of $`+
                    +Math.round(employment.median_income/1000) + 'K':
                    ' '+deaf_labels[employment.index]+
                    ' $'+Math.round(employment.median_income/1000) + 'K'})+
                ', compared to '+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.variable === selectedAttributions &
                  employment?.attribution?.includes('hearing') &
                  employment.median_income !== 0).map(
                    function(employment,index){ return (index !== 0 && hear_labels[hear_labels.length - 1] === hear_labels[employment.index]) ? 
                    ' and '+
                    hear_labels[employment.index]+
                    ' $'+Math.round(employment.median_income/1000) + 'K': 
                    index === 0 ?
                    ' '+hear_labels[employment.index] +'  at $'+
                    +Math.round(employment.median_income/1000) + 'K':
                    ' '+hear_labels[employment.index]+
                    ' $'+Math.round(employment.median_income/1000) + 'K'})
          }[metrics],
        'accordion-is-open':
            {
              percentage:
                'In the United States, among people aged 25-64'+scope+', an estimated '+
                employment.filter(employment => employment.attribution === attribute[0] & 
                  employment.status === insidechartStatus &  
                  employment.type === insidechartType & 
                  employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                    function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                  )
                  +
                words[0]+nationDescript+', compared to '+
                employment.filter(employment => employment.attribution === attribute[1] & 
                  employment.status === insidechartStatus &  
                  employment.type === insidechartType & 
                  employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                    function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                  )+
                words[1],
              median_income:
                'In the United States, among people aged 16-64 who are working full time,'+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[0]).map(
                    function(employment){return (
                    ' '+words[0]+` have a ${insidechartType === 'mean-salary-range' ? 'mean' : 'median'} annual income of $`+
                    +Math.round(employment.median_income/1000) + 'K')})+
                ', compared to '+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[1]).map(
                    function(employment){return (
                      ' '+words[1]+'  at $'+
                      +Math.round(employment.median_income/1000) + 'K')})
          }[metrics]
        }[accordion_is]+' '+useCitation[2]
      )
    }
  },[accordion_is,attribute,deaf_labels,hear_labels,
    insidechartStatus,insidechartType,metrics,nationDescript,
    scope,selectedAttributions,words,reportTrigger,
    chartType,chosen_state_b, in_the_b, state_label_b]
  )

  // Highchart's plots
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

  // Rest of charts
  const plot = useHighChart({
    attributions: accordion_is === 'accordion-is-open' ? attribute : null,
    variable: selectedAttributions,
    status: insidechartStatus,
    type: insidechartType,
    openAccordion: accordion_is === 'accordion-is-open' || false,
    chartType: chartType,
    colorfill,
    maintitle,
    sentence,
    limitAge: limit_age,
    scope,
    nationDescript,
    deafLabels: deaf_labels,
    hearLabels: hear_labels
  });

  // State Charts
  let state_a = {
    chart:{
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
      categories: {
        'accordion-is':
          categories.map(word => word.charAt(0).toUpperCase()+word.substring(1)),
        'accordion-is-open':
          ['']
      }[accordion_is],
      type: 'category',
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
      max: {
        'accordion-is':
          1+Math.max(...employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selectedAttributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
            employment.status === insidechartStatus).map(
            employment => employment[metrics])),
        'accordion-is-open':
          1+Math.max(...employment.filter(employment => employment.type === insidechartType & 
            (employment.state === chosen_state_a | employment.state === chosen_state_b) &
            (employment.attribution === attribute[0] | employment.attribution === attribute[1]) &
            employment.status === insidechartStatus).map(
            employment => employment[metrics]))
      }[accordion_is],
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          if(metrics === 'percentage'){
            return this.value+'%'
          }else{
            return '$'+Math.round(this.value/1000)+'K'
          }
        }
      }
    },
    tooltip: {
      formatter: function () {
        if(metrics === 'percentage'){
          return this.y+'%'
        }else{
          return '$'+Math.round(this.y/1000)+'K'
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
      }
    },
    series: [{
      name: {
        'accordion-is':
          'deaf',
        'accordion-is-open':
          attribute[0]
      }[accordion_is],
      color: {
        'accordion-is': colorfill[0],
        'accordion-is-open': colorfill[num_col[0]]
      }[accordion_is],
      borderColor: {
        'accordion-is': colorfill[0],
        'accordion-is-open': colorfill[num_col[0]]
      }[accordion_is],
      type: 'column',
      borderWidth: 1,
      data: {
        'accordion-is':
          employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selectedAttributions & employment.state === chosen_state_a &
            employment.status === insidechartStatus & employment?.attribution?.includes('deaf')).map(
            employment => [employment.index,employment[metrics]]),
        'accordion-is-open':
            employment.filter(employment => employment.type === insidechartType & 
              employment.state === chosen_state_a &
              employment.status === insidechartStatus & employment.attribution === attribute[0]).map(
              employment => employment[metrics])
        }[accordion_is],
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selectedAttributions & employment.state === chosen_state_a &
              employment.status === insidechartStatus & employment[metrics] === this.y & employment?.attribution?.includes(this.series.name)).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return '\u26a0'+this.y + '%'
              }else{
                return '\u26a0 $'+Math.round(this.y/1000)+'K'
              }
            }
          }else{
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return this.y + '%';
              }else{
                return '$'+Math.round(this.y/1000)+'K'
              }
            }
          }
        }
      },
      enableMouseTracking: true,
      showInLegend: true
    },
    { 
      name: {
        'accordion-is':
          'hearing',
        'accordion-is-open':
          attribute[1]
      }[accordion_is],
      color: {
        'accordion-is': colorfill[6],
        'accordion-is-open': colorfill[num_col[1]]
      }[accordion_is],
      borderColor: colorfill[6],
      type: 'column',
      borderWidth: 1,
      data: {
        'accordion-is':
          employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selectedAttributions & employment.state === chosen_state_a &
            employment.status === insidechartStatus & employment?.attribution?.includes('hearing')).map(
            employment => [employment.index,employment[metrics]]),
        'accordion-is-open':
          employment.filter(employment => employment.type === insidechartType & 
            employment.state === chosen_state_a &
            employment.status === insidechartStatus & employment.attribution === attribute[1]).map(
            employment => employment[metrics])
      }[accordion_is],
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selectedAttributions & employment.state === chosen_state_a &
              employment.status === insidechartStatus & employment[metrics] === this.y & employment?.attribution?.includes(this.series.name)).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return '\u26a0'+this.y + '%'
              }else{
                return '\u26a0 $'+Math.round(this.y/1000)+'K'
              }
            }
          }else{
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return this.y + '%';
              }else{
                return '$'+Math.round(this.y/1000)+'K'
              }
            }
          }
        }
      },
      enableMouseTracking: true,
      showInLegend: true
    }],
    exporting: {
      enabled:false
    }
  };
  let state_all_a = {
    chart:{
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
      type: 'category',
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
      max: 100,
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          return this.value+'%'
        }
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
    },
    series: [{
      showInLegend: true,
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      type: 'column',
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'deaf' & 
        employment.status !== 'no HS diploma' &  
        employment.type === 'education' & 
        employment.state === chosen_state_a).map(employment => employment.percentage).reverse(),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status !== 'no HS diploma' &  
            employment.type === 'education' & 
            employment.state === chosen_state_a &
            employment.percentage === this.y).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            if(this.y === 0){
              return ''
            }else{
              return '\u26a0'+this.y + '%'
            }
          }else{
            if(this.y === 0){
              return ''
            }else{
              return this.y + '%';
            }
          }
        },
      }
    },
    { showInLegend: true,
      name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      type: 'column',
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'hearing' & 
        employment.status !== 'no HS diploma' & 
        employment.type === 'education' & 
        employment.state === chosen_state_a).map(employment => employment.percentage).reverse(),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status !== 'no HS diploma' &  
            employment.type === 'education' & 
            employment.state === chosen_state_a &
            employment.percentage === this.y).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            if(this.y === 0){
              return ''
            }else{
              return '\u26a0'+this.y + '%'
            }
          }else{
            if(this.y === 0){
              return ''
            }else{
              return this.y + '%';
            }
          }
        },
      }
    }],
    exporting: {
      enabled: false
    }
  };

  let state_b = {
    chart:{
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
      categories: {
        'accordion-is':
          categories.map(word => word.charAt(0).toUpperCase()+word.substring(1)),
        'accordion-is-open':
          ['']
      }[accordion_is],
      type: 'category',
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
      max: {
        'accordion-is':
          1+Math.max(...employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selectedAttributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
            employment.status === insidechartStatus).map(
            employment => employment[metrics])),
        'accordion-is-open':
          1+Math.max(...employment.filter(employment => employment.type === insidechartType & 
            (employment.state === chosen_state_a | employment.state === chosen_state_b) &
            (employment.attribution === attribute[0] | employment.attribution === attribute[1]) &
            employment.status === insidechartStatus).map(
            employment => employment[metrics]))
      }[accordion_is],
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          if(metrics === 'percentage'){
            return this.value+'%'
          }else{
            return '$'+Math.round(this.value/1000)+'K'
          }
        }
      }
    },
    tooltip: {
      formatter: function () {
        if(metrics === 'percentage'){
          return this.y+'%'
        }else{
          return '$'+Math.round(this.y/1000)+'K'
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
      }
    },
    series: [{
      name: {
        'accordion-is':
          'deaf',
        'accordion-is-open':
          attribute[0]
      }[accordion_is],
      color: {
        'accordion-is': colorfill[0],
        'accordion-is-open': colorfill[num_col[0]]
      }[accordion_is],
      borderColor: {
        'accordion-is': colorfill[0],
        'accordion-is-open': colorfill[num_col[0]]
      }[accordion_is],
      type: 'column',
      borderWidth: 1,
      data: {
        'accordion-is':
          employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selectedAttributions & employment.state === chosen_state_b &
            employment.status === insidechartStatus & employment?.attribution?.includes('deaf')).map(
            employment => [employment.index,employment[metrics]]),
        'accordion-is-open':
            employment.filter(employment => employment.type === insidechartType & 
              employment.state === chosen_state_b &
              employment.status === insidechartStatus & employment.attribution === attribute[0]).map(
              employment => employment[metrics])
        }[accordion_is],
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selectedAttributions & employment.state === chosen_state_b &
              employment.status === insidechartStatus & employment[metrics] === this.y & employment?.attribution?.includes(this.series.name)).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return '\u26a0'+this.y + '%'
              }else{
                return '\u26a0 $'+Math.round(this.y/1000)+'K'
              }
            }
          }else{
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return this.y + '%';
              }else{
                return '$'+Math.round(this.y/1000)+'K'
              }
            }
          }
        }
      },
      enableMouseTracking: true,
      showInLegend: true
    },
    { 
      name: {
        'accordion-is':
          'hearing',
        'accordion-is-open':
          attribute[1]
      }[accordion_is],
      color: {
        'accordion-is': colorfill[6],
        'accordion-is-open': colorfill[num_col[1]]
      }[accordion_is],
      borderColor: colorfill[6],
      type: 'column',
      borderWidth: 1,
      data: {
        'accordion-is':
          employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selectedAttributions & employment.state === chosen_state_b &
            employment.status === insidechartStatus & employment?.attribution?.includes('hearing')).map(
            employment => [employment.index,employment[metrics]]),
        'accordion-is-open':
          employment.filter(employment => employment.type === insidechartType & 
            employment.state === chosen_state_b &
            employment.status === insidechartStatus & employment.attribution === attribute[1]).map(
            employment => employment[metrics])
      }[accordion_is],
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selectedAttributions & employment.state === chosen_state_b &
              employment.status === insidechartStatus & employment[metrics] === this.y & employment?.attribution?.includes(this.series.name)).map(
              function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return '\u26a0'+this.y + '%'
              }else{
                return '\u26a0 $'+Math.round(this.y/1000)+'K'
              }
            }
          }else{
            if(this.y === 0){
              return ''
            }else{
              if(metrics === 'percentage'){
                return this.y + '%';
              }else{
                return '$'+Math.round(this.y/1000)+'K'
              }
            }
          }
        }
      },
      enableMouseTracking: true,
      showInLegend: true
    }],
    exporting: {
      allowHTML: true,
      url: exportURL,
      fallbackToExportServer: fallbackToExportServer,
      error: (options, error) => {
        console.log('Export error:', error);
        // Optional: User-friendly message
        // alert('Export failed. Please try again or contact support.');
      },
      sourceWidth: 1200,
      sourceHeight: 600,
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
          text: maintitle,
          align: 'left',
          x: 25,
          y: 60,
          margin:50,
          widthadjust: -200,
          style: {
            color: '#070707',
            fontSize: '40px',
            fontFamily: 'Roboto slab',
            marginRight: 20
          }
        },
        caption: {
          text: {
            'accordion-is': nationalTitle+title_by+' '+in_the_b.toLowerCase()+state_label_b,
            'accordion-is-open': nationalTitle+' '+in_the_b.toLowerCase()+state_label_b
          }[accordion_is],
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto',
            marginRight: 20,
            fontWeight: 700,
            color: '#565C5B'
          },
          verticalAlign: 'top',
          align: 'left',
          y: 85,
          x: 25
        },
        subtitle: {
          useHTML: useHTML,
          text: 
            '<p>'+{
              column:
                {
                  'accordion-is':
                  {
                    percentage: 
                    employment.filter(employment => employment.type === insidechartType & 
                      employment.variable === selectedAttributions & employment.state === chosen_state_b &
                      employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                      employment.percentage !== 0).length === 0 ?
                    in_the_b+state_label_b+', among people aged '+limit_age+
                    ", the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript :
                    in_the_b+state_label_b+', among people aged '+limit_age+', an estimated'+
                    employment.filter(employment => employment.type === insidechartType & 
                      employment.variable === selectedAttributions & employment.state === chosen_state_b &
                      employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                      employment.percentage !== 0).map(
                      function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                      ' and '+
                      (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                      deaf_labels[employment.index] : ' '+ 
                      (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                      deaf_labels[employment.index]}).reverse()+
                    nationDescript+', compared to '+
                    employment.filter(employment => employment.type === insidechartType & 
                      employment.variable === selectedAttributions & employment.state === chosen_state_b &
                      employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                      employment.percentage !== 0).map(
                      function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ?
                      ' and '+
                      (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                      hear_labels[employment.index] : ' '+
                      (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                      hear_labels[employment.index]}).reverse(),
                    median_income: ''
                  }[metrics],
                  'accordion-is-open':
                    {
                      percentage:
                      in_the_b+state_label_b+', among people aged '+limit_age+', an estimated '+
                        employment.filter(employment => employment.attribution === attribute[0] & 
                          employment.status === insidechartStatus &  
                          employment.type === insidechartType & 
                          employment.state === chosen_state_b).map(employment => [employment.margin_errors,employment.percentage]).map(
                            function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                          )
                          +
                        words[0]+nationDescript+', compared to '+
                        employment.filter(employment => employment.attribution === attribute[1] & 
                          employment.status === insidechartStatus &  
                          employment.type === insidechartType & 
                          employment.state === chosen_state_b).map(employment => [employment.margin_errors,employment.percentage]).map(
                            function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                          )+
                        words[1],
                      median_income: '.'
                    }[metrics]
                }[accordion_is],
              spline: 
                '',                
              
              popular: 
                '',
              
              all: 
                ''
            }[chartType]+' '+useCitation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,

          x: 0,
          y: 0,
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto slab',
            paddingTop: '40px',
            color: '#565C5B',
          },
          widthadjust: -220
        }, 
        chart: {         
          inverted: false,
          backgroundColor: {
            linearGradient: [0, 0, 0, 600],
            stops:
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.8-add_stop, 'rgb(255,255,255)'],
                [0.8-add_stop, 'rgb(243, 243, 243)']
              ]      
          },
          plotBackgroundColor: '#ffffff',
          events: {
            render() {
              const chart = this,
                width = 190;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  30, //y
                  2.37216657881*70, //width
                  70//height
              ).add();
            }
          }
        }
      },
      buttons: {
          contextButton: {
            text: downloadText,
            symbol: 'download',
            menuItems: ["downloadPNG"]
          }
      }
    }
  };
  let state_all_b = {
    chart:{
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
      type: 'category',
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
      max: 100,
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          return this.value+'%'
        }
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
    },
    series: [{
      showInLegend: true,
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      type: 'column',
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'deaf' & 
        employment.status !== 'no HS diploma' &  
        employment.type === 'education' & 
        employment.state === chosen_state_b).map(employment => employment.percentage).reverse(),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status !== 'no HS diploma' &  
            employment.type === 'education' & 
            employment.state === chosen_state_b &
            employment.percentage === this.y).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            return '\u26a0'+this.y + '%'
          }else{
            return this.y + '%';
          }
        },
      }
    },
    { showInLegend: true,
      name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      type: 'column',
      borderWidth: 1,
      data: employment.filter(employment => employment.attribution === 'hearing' & 
        employment.status !== 'no HS diploma' & 
        employment.type === 'education' & 
        employment.state === chosen_state_b).map(employment => employment.percentage).reverse(),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status !== 'no HS diploma' &  
            employment.type === 'education' & 
            employment.state === chosen_state_b &
            employment.percentage === this.y).map(
            function(employment){return (((employment.margin_errors/100)/1.962937))})/(this.y/100) > 0.3)
          ){
            return '\u26a0'+this.y + '%'
          }else{
            return this.y + '%';
          }
        },
      }
    }],
    exporting: {
      allowHTML: true,
      url: exportURL,
      fallbackToExportServer: fallbackToExportServer,
      error: (options, error) => {
        console.log('Export error:', error);
        // Optional: User-friendly message
        // alert('Export failed. Please try again or contact support.');
      },
      sourceWidth: 1200,
      sourceHeight: 600,
      buttons: {
          contextButton: {
            text: downloadText,
            symbol: 'download',
            menuItems: ["downloadPNG"]
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
          text: 'Education Attainment',
          align: 'left',
          x: 25,
          y: 60,
          margin:50,
          widthadjust: -200,
          style: {
            color: '#070707',
            fontSize: '40px',
            fontFamily: 'Roboto slab',
            marginRight: 20
          }
        },
        caption: {
          text: nationalTitle+title_by+' '+in_the_b.toLowerCase()+state_label_b+'('+(acs_five_year-4)+'-'+acs_five_year+')',
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto',
            marginRight: 20,
            fontWeight: 700,
            color: '#565C5B'
          },
          verticalAlign: 'top',
          align: 'left',
          y: 85,
          x: 25
        },
        subtitle: {
          useHTML: useHTML,
          text: 
            '<p>'+in_the_b+state_label_b+', among people aged '+limit_age+
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selectedAttributions & employment.state === chosen_state_b &
              employment.status !== 'no HS diploma' & employment?.attribution?.includes('deaf') &
              employment.percentage !== 0).length === 0 ? ", the sample size is not sufficient to accurately report the deaf education attainment" :
            ', an estimated'+
            employment.filter(employment => employment.attribution === 'deaf' & 
              employment.status !== 'no HS diploma' &  
              employment.type === 'education' & 
              employment.state === chosen_state_b).map(
              function(employment, index){ return index === 0 ? 
              ' and '+
              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
              (employment.percentage === 0 ? 'N/A of deaf people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
              edulist[index] :
              ' '+employment.percentage+'% '+edulist[index]}).reverse()+
            ', compared to '+
            employment.filter(employment => employment.attribution === 'hearing' & 
              employment.status !== 'no HS diploma' & 
              employment.type === 'education' & 
              employment.state === chosen_state_b).map(
              function(employment, index){ return index === 0 ? 
              ' and '+
              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
              edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
              (employment.percentage === 0 ? 'N/A of hearing people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
              edulist[index] :
              ' '+employment.percentage+'% '+edulist[index]}).reverse())+' '+useCitation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,

          x: 0,
          y: 0,
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto slab',
            paddingTop: '40px',
            color: '#565C5B',
          },
          widthadjust: -220
        },
        chart: {
          inverted: false,          
          backgroundColor: {
            linearGradient: [0, 0, 0, 600],
            stops:
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.8-add_stop, 'rgb(255,255,255)'],
                [0.8-add_stop, 'rgb(243, 243, 243)']
              ]      
          },
          plotBackgroundColor: '#ffffff',
          events: {
            render() {
              const chart = this,
                width = 190;
                chart.renderer.image(thelogo,
                  chart.plotLeft + chart.plotSizeX - width, //x
                  30, //y
                  2.37216657881*70, //width
                  70//height
              ).add();
            }
          }
        }
      }
    }
  };

  return ( 
    <>
      <div className = 'container'>
        <div className = 'main-grid'>
          <div className = 'main-b'/>                
        </div>
        <Tabs onSelect={changeTabNumber} selectedIndex={reportTrigger}>
          <TabList aria-label="Tabs of National Level, State Level, and Occupational Fields">
            <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}} aria-label='National Level Interactive Chart'>{'National Level'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}} aria-label='State Level Interactive Charts'>{'State Level'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
            <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}} aria-label='Occupational Fields Interactive Table'>{'Occupational Fields'.slice(0,slice_string[0]).trim()+slice_string[1]}</Tab>
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
                <FontAwesomeIcon icon={faCaretLeft} className = 'icon_style' style={{transform: icon_rotate}}/>
              </button>
              <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                <div className='data_sidebar_interface'>
                  <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                    <FontAwesomeIcon icon={faCaretLeft} className = 'icon_style' style={{transform: icon_rotate}}/>
                  </button>
                  <div style={{marginTop:'10px'}}/>
                  <Select 
                    styles={chart_side_style}
                    value = {nationalSchema}
                    options = {national_options}
                    isSearchable = {searchable}
                    onChange = {changeSection}
                    tabIndex={null}
                  />
                  <div style = {{marginBottom: '22px'}}/>
                  <div style = {{display: nationSelectDisplay}}>
                    <Select
                      styles={chart_side_style}
                      value = {inside_chart_schema}
                      options = {inside_chart_options.filter(x => x.group === groupInsideChart)}
                      isSearchable = {false}
                      onChange = {changeInsideChart}
                      tabIndex={null}
                    /> 
                  </div>
                  <div style = {{marginBottom: '22px'}}/>
                  <Select 
                    styles={second_side_style}
                    value = {secondSchema}
                    menuIsOpen={true}
                    isDisabled={nationDisabled}
                    onChange = {changeList}
                    options = {variables.filter(x => x.age === limit_age)}
                    isSearchable = {false}
                  />
                  <div style = {{marginBottom: '22px'}}/>
                  <div className = 'content-for-accordion'>
                    <div className = {accordion_is}>
                      <div className = 'mobile-accordion-title'>
                        {'More'+more_options+'Options'}
                        <div className = 'mobile-circle-symbol'  onClick = {clickButton}>
                          <div className="mobile-before-cross"/>
                          <div className="mobile-after-cross"/>
                        </div>
                      </div>
                      <div className = 'accordion-content'>
                        <div style = {{marginBottom: '22px'}}/>
                        <Select 
                        styles={third_side_style}
                        menuIsOpen={true}
                        isMulti={true}
                        isDisabled={second_nationDisabled}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        isClearable={false}
                        components={{
                          Option
                        }}
                        onChange = {changeAttribution}
                        value = {multi_attribution}
                        options = {attributions.filter(attributions => attributions.variable === selectedAttributions)}
                        isSearchable = {false}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 10 }} /> 
                  <div style={{marginBottom:60}}/>
                </div>
              </div>
              <div className={data_grid}>
                <div className='a'>
                  {
                    {
                      'accordion-is': <div className = 'state_title'>{nationalTitle.toUpperCase()+title_by.toUpperCase()+': UNITED STATES '}</div>,
                      'accordion-is-open': <div className = 'state_title'>{nationalTitle.toUpperCase()+': UNITED STATES '}</div>
                    }[accordion_is]
                  }
                  <HighchartsReact highcharts={Highcharts} options={plot.chart}/>
                  <div className = 'content-for-accordion'>
                    <div className = {textaccordion_is}>
                      <div className = 'accordion-title'>
                        <div className = 'circle-symbol'  onClick = {textButton}>
                          <div className="before-cross"/>
                          <div className="after-cross"/>
                        </div>
                      </div>
                      <div className = 'accordion-content'>
                        <div className = 'Jonah-text-contain'>
                          <div className = 'Jonah-thep'>
                            {plot.content}
                          </div>
                          <div style = {{marginBottom: '12px'}}/>
                          <div className = 'Jonah-thep'>
                            {plot.sample}
                          </div>
                          <div className = {plot.warning ? 'shown-warning' : 'not-warning'}>
                            <button className = 'sample-warning'>
                              <img src = {warning_sign} alt = '<Warning Sign>'></img>
                            </button>
                            <div className = 'sample-comment'>Interpret data with caution. Estimates may be unstable due to small sample size or other factors.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='b' style={{display:interface_side}}>
                  <p className='aria-text'>Right Content</p>
                  <p className='aria-text'>
                    This content consists of several selection options that affect charts.
                  </p>
                  <p className='aria-text'>
                    When one of these options is selected, this will also affect a chart, title, description, and other selection options 
                    including all information in exported chart.
                  </p>
                  <form>
                    <label id="aria-label1" className = 'aria-focus' htmlFor="aria-input1"/>
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
                      styles={chart_side_style}
                      value = {nationalSchema}
                      options = {national_options}
                      isSearchable = {searchable}
                      onChange = {changeSection}
                      tabIndex={null}
                    />
                  </form>
                  <div style = {{display: nationSelectDisplay}}>
                    <form>
                      <div style = {{marginBottom: '12px'}}/>
                      <label id="aria-label" className = 'aria-focus' htmlFor="aria-input"/>
                      <div style={{ padding: 10 }}/>
                      <Select
                        aria-labelledby="aria-label"
                        inputId="aria-input"
                        name="aria-live"
                        styles={chart_side_style}
                        value = {inside_chart_schema}
                        options = {inside_chart_options.filter(x => x.group === groupInsideChart)}
                        isSearchable = {false}
                        onChange = {changeInsideChart}
                        tabIndex={null}
                      /> 
                    </form>
                  </div>
                  <form>
                    <div style = {{marginBottom: '12px'}}/>
                    <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input"/>
                    <div style={{ padding: 10 }}/>
                    <Select 
                      aria-labelledby="aria-label"
                      inputId="aria-example-input"
                      name="aria-live-color"
                      //ariaLiveMessages={{
                      //  onFocus,
                      //}}
                      styles={second_side_style}
                      value = {secondSchema}
                      isDisabled={nationDisabled}
                      menuIsOpen={true}
                      //openMenuOnFocus={true}
                      options = {variables.filter(x => x.age === limit_age)}
                      onChange = {changeList}
                      isSearchable = {false}
                      tabIndex={null}
                    />
                  </form>
                  <div style = {{marginBottom: '22px'}}/>
                  <div className = 'content-for-accordion'>
                    <div className = {accordion_is}>
                      <div className = 'accordion-title' style = {{color: title_color}}>
                        {'More'+more_options+'Options'}
                        <div className = 'circle-symbol'  onClick = {clickButton} style = {{border: '2px solid '+title_color}}>
                          <div className="before-cross" style = {{background: title_color}}/>
                          <div className="after-cross" style = {{background: title_color}}/>
                        </div>
                      </div>
                      <div className = 'accordion-content'>
                        <form>
                          <div style = {{marginBottom: '22px'}}/>
                          <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input"/>
                          <Select 
                          styles={third_side_style}
                          menuIsOpen={true}
                          isMulti={true}
                          isDisabled={second_nationDisabled}
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          isClearable={false}
                          components={{
                            Option
                          }}
                          onChange = {changeAttribution}
                          value = {multi_attribution}
                          options = {attributions.filter(attributions => attributions.variable === selectedAttributions)}
                          isSearchable = {false}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 10 }}/> 
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
                <FontAwesomeIcon icon={faCaretLeft} className = 'icon_style' style={{transform: icon_rotate}}/>
              </button>
              <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                <div className='data_sidebar_interface'>
                  <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                    <FontAwesomeIcon icon={faCaretLeft} className = 'icon_style' style={{transform: icon_rotate}}/>
                  </button>
                  <div style={{marginTop:'10px'}}/>
                  <Select 
                    styles={chart_side_style}
                    value = {nationalSchema}
                    options = {state_options}
                    isSearchable = {searchable}
                    onChange = {changeSection}
                    tabIndex={null}
                  />
                  <div style = {{marginBottom: '22px'}}/>
                  <div style = {{display: nationSelectDisplay}}>
                    <Select
                      aria-labelledby="aria-label"
                      inputId="aria-input"
                      name="aria-live"
                      styles={chart_side_style}
                      value = {inside_chart_schema}
                      options = {state_inside_chart_options.filter(x => x.group === groupInsideChart)}
                      isSearchable = {false}
                      onChange = {changeInsideChart}
                      tabIndex={null}
                    /> 
                  </div>
                  <div style = {{marginBottom: '22px'}}/>
                  <Select 
                    styles={second_side_style}
                    value = {secondSchema}
                    menuIsOpen={true}
                    isDisabled={nationDisabled}
                    onChange = {changeList}
                    options = {variables.filter(x => x.age === limit_age)}
                    isSearchable = {false}
                  />
                  <div style = {{marginBottom: '22px'}}/>
                  <div className = 'content-for-accordion'>
                    <div className = {accordion_is}>
                      <div className = 'mobile-accordion-title'>
                        {'More'+more_options+'Options'}
                        <div className = 'mobile-circle-symbol'  onClick = {clickButton}>
                          <div className="mobile-before-cross"/>
                          <div className="mobile-after-cross"/>
                        </div>
                      </div>
                      <div className = 'accordion-content'>
                        <div style = {{marginBottom: '22px'}}/>
                        <Select 
                        styles={third_side_style}
                        menuIsOpen={true}
                        isMulti={true}
                        isDisabled={second_nationDisabled}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        isClearable={false}
                        components={{
                          Option
                        }}
                        onChange = {changeAttribution}
                        value = {multi_attribution}
                        options = {attributions.filter(attributions => attributions.variable === selectedAttributions)}
                        isSearchable = {false}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 10 }} /> 
                  <div style={{marginBottom:60}}/>
                </div>
              </div>
              <div className={data_grid}>
                <div className='a'>
                  <div style = {{display: nationSelectDisplay}}>
                    {
                      {
                        'accordion-is': 
                          <div className = 'state_title'>
                            <div className = 'text-to-button'>{nationalTitle.toUpperCase()+title_by.toUpperCase()+': '+state_label_a.toUpperCase()+' AND '+state_label_b.toUpperCase()}</div>
                          </div>,
                        'accordion-is-open': 
                          <div className = 'state_title'>
                            <div className='text-to-button'>{nationalTitle.toUpperCase()+': '+state_label_a.toUpperCase()+' AND '+state_label_b.toUpperCase()}</div>
                          </div>
                      }[accordion_is]
                    }
                  </div>
                  <div className = 'state_grid'>
                    <div className='state_a'>
                      <div style = {{maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto'}}>
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
                          styles={buttons_under_title}
                          value = {multi_state_a}
                          options = {geographics}
                          isSearchable = {searchable}
                          onChange = {changeGeoStateA}
                          tabIndex={null}
                          /> 
                        </form>
                      </div>
                      {
                        {
                          column: <HighchartsReact highcharts={Highcharts} options={state_a}/>,
                          all:    <HighchartsReact highcharts={Highcharts} options={state_all_a}/>
                        }[chartType]
                      }
                    </div>
                    <div className='state_b'>
                      <div style = {{maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto'}}>
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
                          styles={buttons_under_title}
                          value = {multi_state_b}
                          options = {geographics}
                          isSearchable = {searchable}
                          onChange = {changeGeoStateB}
                          tabIndex={null}
                          /> 
                        </form>
                      </div>
                      {
                        {
                          column: <HighchartsReact highcharts={Highcharts} options={state_b}/>,
                          all:    <HighchartsReact highcharts={Highcharts} options={state_all_b}/>
                        }[chartType]
                      }
                    </div>
                    <div className = 'state_c'>
                      <div className = 'content-for-accordion'>
                        <div className = {textaccordion_is}>
                          <div className = 'accordion-title'>
                            <div className = 'circle-symbol'  onClick = {textButton}>
                              <div className="before-cross"/>
                              <div className="after-cross"/>
                            </div>
                          </div>
                          <div className = 'accordion-content'>
                              <div className = 'Jonah-text-contain'>
                                <div className = 'Jonah-thep'>
                                  {
                                    {
                                      column:
                                        {
                                          'accordion-is':
                                            in_the_a+state_label_a+', among people aged '+limit_age+
                                            (employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selectedAttributions & employment.state === chosen_state_a &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).length === 0 ? ", the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript : 
                                              ', an estimated'+
                                            employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selectedAttributions & employment.state === chosen_state_a &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).map(
                                              function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                                              ' and '+
                                              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                              deaf_labels[employment.index] : ' '+ 
                                              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                              deaf_labels[employment.index]}).reverse()+
                                            nationDescript+', compared to '+
                                            (employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selectedAttributions & employment.state === chosen_state_a &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                                              employment.percentage !== 0).length === 0 ? ' N/A of ' : '')+
                                            employment.filter(employment => employment.type === insidechartType & 
                                            employment.variable === selectedAttributions & employment.state === chosen_state_a &
                                            employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                                            employment.percentage !== 0).map(
                                            function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                                            ' and '+
                                            (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                            hear_labels[employment.index] : ' '+
                                            (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                            hear_labels[employment.index]}).reverse())+
                                            (employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selectedAttributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).length === 0 ? ". This issue is also present "+in_the_b.toLowerCase()+state_label_b+'.' : 
                                            employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selectedAttributions & employment.state === chosen_state_b &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).length === 0 ?
                                            '. While '+in_the_b.toLowerCase()+state_label_b+', among people aged '+limit_age+
                                            ", the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript :
                                            '. While '+in_the_b.toLowerCase()+state_label_b+', among people aged '+limit_age+', an estimated'+
                                            employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selectedAttributions & employment.state === chosen_state_b &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).map(
                                              function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                                              ' and '+
                                              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                              deaf_labels[employment.index] : ' '+ 
                                              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                              deaf_labels[employment.index]}).reverse()+
                                            nationDescript+', compared to '+
                                            employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selectedAttributions & employment.state === chosen_state_b &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                                              employment.percentage !== 0).map(
                                              function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ?
                                              ' and '+
                                              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                              hear_labels[employment.index] : ' '+
                                              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                              hear_labels[employment.index]}).reverse()+'.'),                                      
                                          'accordion-is-open':
                                            in_the_a+state_label_a+', among people aged '+limit_age+', an estimated '+
                                            employment.filter(employment => employment.attribution === attribute[0] & 
                                              employment.status === insidechartStatus &  
                                              employment.type === insidechartType & 
                                              employment.state === chosen_state_a).map(employment => [employment.margin_errors,employment.percentage]).map(
                                                function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                              )
                                              +
                                            words[0]+nationDescript+', compared to '+
                                            employment.filter(employment => employment.attribution === attribute[1] & 
                                              employment.status === insidechartStatus &  
                                              employment.type === insidechartType & 
                                              employment.state === chosen_state_a).map(employment => [employment.margin_errors,employment.percentage]).map(
                                                function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                              )+words[1]+
                                            '. While '+in_the_b.toLowerCase()+state_label_b+', among people aged '+limit_age+', an estimated '+
                                            employment.filter(employment => employment.attribution === attribute[0] & 
                                              employment.status === insidechartStatus &  
                                              employment.type === insidechartType & 
                                              employment.state === chosen_state_b).map(employment => [employment.margin_errors,employment.percentage]).map(
                                                function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                              )+
                                            words[0]+nationDescript+', compared to '+
                                            employment.filter(employment => employment.attribution === attribute[1] & 
                                              employment.status === insidechartStatus &  
                                              employment.type === insidechartType & 
                                              employment.state === chosen_state_b).map(employment => [employment.margin_errors,employment.percentage]).map(
                                                function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                              )+
                                            words[1]+'.'
                                        }[accordion_is],
                                      all: 
                                      in_the_a+state_label_a+', among people aged '+limit_age+
                                      (employment.filter(employment => employment.type === insidechartType & 
                                        employment.variable === selectedAttributions & employment.state === chosen_state_a &
                                        employment.status !== 'no HS diploma' & employment?.attribution?.includes('deaf') &
                                        employment.percentage !== 0).length === 0 ? ", the sample size is not sufficient to accurately report the deaf education attainment" :
                                      ', an estimated'+
                                        employment.filter(employment => employment.attribution === 'deaf' & 
                                          employment.status !== 'no HS diploma' &  
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_a).map(
                                          function(employment, index){ return index === 0 ? 
                                          ' and '+
                                          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                          (employment.percentage === 0 ? 'N/A of deaf people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
                                          edulist[index] :
                                          ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                                        ', compared to '+
                                        employment.filter(employment => employment.attribution === 'hearing' & 
                                          employment.status !== 'no HS diploma' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_a).map(
                                          function(employment, index){ return index === 0 ? 
                                          ' and '+
                                          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                          (employment.percentage === 0 ? 'N/A of hearing people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
                                          edulist[index] :
                                          ' '+employment.percentage+'% '+edulist[index]}).reverse())+
                                        (employment.filter(employment => employment.type === insidechartType & 
                                          employment.variable === selectedAttributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
                                          employment.status !== 'no HS diploma' & employment?.attribution?.includes('deaf') &
                                          employment.percentage !== 0).length === 0 ? ". This issue is also present "+in_the_b.toLowerCase()+state_label_b : 
                                        employment.filter(employment => employment.type === insidechartType & 
                                          employment.variable === selectedAttributions & employment.state === chosen_state_b &
                                          employment.status !== 'no HS diploma' & employment?.attribution?.includes('deaf') &
                                          employment.percentage !== 0).length === 0 ?
                                        '. While '+in_the_b.toLowerCase()+state_label_b+", the sample size is not sufficient to accurately report the deaf education attainment" : 
                                        '. While '+in_the_b.toLowerCase()+state_label_b+', among people aged '+limit_age+', an estimated'+
                                        employment.filter(employment => employment.attribution === 'deaf' & 
                                          employment.status !== 'no HS diploma' &  
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_b).map(
                                          function(employment, index){ return index === 0 ? 
                                          ' and '+
                                          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                          (employment.percentage === 0 ? 'N/A of deaf people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people have completed ' : employment.percentage + '% of deaf people have completed ')+
                                          edulist[index] :
                                          ' '+employment.percentage+'% '+edulist[index]}).reverse()+
                                        ', compared to '+
                                        employment.filter(employment => employment.attribution === 'hearing' & 
                                          employment.status !== 'no HS diploma' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_b).map(
                                          function(employment, index){ return index === 0 ? 
                                          ' and '+
                                          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                          (employment.percentage === 0 ? 'N/A of hearing people have completed ' :((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
                                          edulist[index] :
                                          ' '+employment.percentage+'% '+edulist[index]}).reverse()+'.')
                                    }[chartType]
                                  }
                                </div>
                                <div style = {{marginBottom: '12px'}}/>
                                <div className = 'Jonah-thep'>
                                  { 
                                    {
                                      column:
                                      {
                                        'accordion-is':
                                          'In this chart, estimates are based on a sample size of '+
                                          size_checker(employment.filter(employment => employment.type === insidechartType & 
                                            employment.variable === selectedAttributions & employment.state === chosen_state_a &
                                            employment.status === insidechartStatus).map(employment => employment.n).reduce(
                                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                          ' people'+in_the_a.toLowerCase()+state_label_a+' and '+
                                          size_checker(employment.filter(employment => employment.type === insidechartType & 
                                            employment.variable === selectedAttributions & employment.state === chosen_state_b &
                                            employment.status === insidechartStatus).map(employment => employment.n).reduce(
                                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                          ' people'+in_the_b.toLowerCase()+state_label_b+' who participated '+
                                          'in the American Community Survey '+year+'.'+in_the_a+state_label_a+', the margin of errors are '+
                                          employment.filter(employment => employment.attribution === 'deaf' & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_a).map(employment => employment.margin_errors)+
                                          '% for deaf people and '+
                                          employment.filter(employment => employment.attribution === 'hearing' & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_a).map(employment => employment.margin_errors)+
                                          '% for hearing people while'+
                                          in_the_b.toLowerCase()+state_label_b+', the margin of errors are '+
                                          employment.filter(employment => employment.attribution === 'deaf' & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_b).map(employment => employment.margin_errors)+
                                          '% for deaf people and '+
                                          employment.filter(employment => employment.attribution === 'hearing' & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_b).map(employment => employment.margin_errors)+
                                          '% for hearing people.',
                                        'accordion-is-open':
                                          'In this chart, estimates are based on a sample size of '+
                                          size_checker(employment.filter(employment => employment.type === insidechartType & 
                                          (employment.attribution === attribute[0] | employment.attribution === attribute[1]) & 
                                          employment.state === chosen_state_a &
                                          employment.status === insidechartStatus).map(employment => employment.n).reduce(
                                            (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                          ' people'+in_the_a.toLowerCase()+state_label_a+
                                          ' and '+size_checker(employment.filter(employment => employment.type === insidechartType & 
                                            (employment.attribution === attribute[0] | employment.attribution === attribute[1]) & 
                                            employment.state === chosen_state_b &
                                            employment.status === insidechartStatus).map(employment => employment.n).reduce(
                                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                          ' people'+in_the_b.toLowerCase()+state_label_b+' who participated '+
                                          'in the American Community Survey '+year+'.'+in_the_a+state_label_a+', the margin of errors are '+
                                          employment.filter(employment => employment.attribution === attribute[0] & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_a).map(employment => employment.margin_errors)+
                                          '% for '+words[0]+' and '+
                                          employment.filter(employment => employment.attribution === attribute[1] & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_a).map(employment => employment.margin_errors)+
                                          '% for '+words[1]+' while'+in_the_b.toLowerCase()+chosen_state_b+', the margin of errors are '+
                                          employment.filter(employment => employment.attribution === attribute[0] & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_b).map(employment => employment.margin_errors)+
                                          '% for '+words[0]+' and '+
                                          employment.filter(employment => employment.attribution === attribute[1] & 
                                            employment.status === insidechartStatus & 
                                            employment.type === insidechartType & 
                                            employment.state === chosen_state_b).map(employment => employment.margin_errors)+
                                          '% for '+words[1]+'.'
                                      }[accordion_is],
                                      all:
                                        'In this chart, estimates are based on a sample size of '+
                                        size_checker(employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
                                        employment.status === 'no HS diploma' & employment.type === 'education' & 
                                          employment.state === chosen_state_a).map(employment => employment.n).reduce(
                                            (sum, a) => sum + a, 0)).toLocaleString('en-US')+' people '+in_the_a.toLowerCase()+state_label_a+' and '+
                                        size_checker(employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
                                        employment.status === 'no HS diploma' & employment.type === 'education' & 
                                          employment.state === chosen_state_b).map(employment => employment.n).reduce(
                                            (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                        ' people '+in_the_b+state_label_b+' who participated in the American Community Survey '+year+
                                        '. '+in_the_a+state_label_a+', the margin of errors are between '+
                                        employment.filter(employment => employment.attribution === 'deaf' & 
                                          employment.status === 'phd/dr' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_a).map(
                                          employment => employment.margin_errors)+
                                        '% and '+
                                        employment.filter(employment => employment.attribution === 'deaf' & 
                                          employment.status === 'HS diploma' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_a).map(
                                          employment => employment.margin_errors)+
                                        '% for deaf people and between '+
                                        employment.filter(employment => employment.attribution === 'hearing' & 
                                          employment.status === 'phd/dr' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_a).map(employment => employment.margin_errors)+
                                        '% and '+
                                        employment.filter(employment => employment.attribution === 'hearing' & 
                                          employment.status === 'HS diploma' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_a).map(employment => employment.margin_errors)+
                                        '% for hearing people while '+in_the_b.toLowerCase()+state_label_b+', the margin of errors are between '+
                                        employment.filter(employment => employment.attribution === 'deaf' & 
                                          employment.status === 'phd/dr' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_b).map(
                                          employment => employment.margin_errors)+
                                        '% and '+
                                        employment.filter(employment => employment.attribution === 'deaf' & 
                                          employment.status === 'HS diploma' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_b).map(
                                          employment => employment.margin_errors)+
                                        '% for deaf people and between '+
                                        employment.filter(employment => employment.attribution === 'hearing' & 
                                          employment.status === 'phd/dr' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_b).map(employment => employment.margin_errors)+
                                        '% and '+
                                        employment.filter(employment => employment.attribution === 'hearing' & 
                                          employment.status === 'HS diploma' & 
                                          employment.type === 'education' & 
                                          employment.state === chosen_state_b).map(employment => employment.margin_errors)+'.'
                                    }[chartType]
                                  }
                                </div>
                                <div className = {state_warning_sty}>
                                  <button className = 'sample-warning'>
                                    <img src = {warning_sign} alt = '<Warning Sign>'></img>
                                  </button>
                                  <div className = 'sample-comment'>Interpret data with caution. Estimates may be unstable due to small sample size or other factors.</div>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='b' style={{display:interface_side}}>
                  <p className='aria-text'>Right Content</p>
                  <p className='aria-text'>
                    This content consists of several selection options that affect charts.
                  </p>
                  <p className='aria-text'>
                    When one of these options is selected, this will also affect a chart, title, description, and other selection options 
                    including all information in exported chart.
                  </p>
                  <form>
                    <label id="aria-label1" className = 'aria-focus' htmlFor="aria-input1"/>
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
                      styles={chart_side_style}
                      value = {nationalSchema}
                      options = {state_options}
                      isSearchable = {searchable}
                      onChange = {changeSection}
                      tabIndex={null}
                    />
                  </form>
                  <div style = {{display: nationSelectDisplay}}>
                    <div style = {{marginBottom: '30px'}}/>
                    <form>
                      <div style = {{marginBottom: '12px'}}/>
                      <label id="aria-label" className = 'aria-focus' htmlFor="aria-input"/>
                      <div style = {{marginBottom: '10px'}}/>
                      <Select
                      aria-labelledby="aria-label"
                      inputId="aria-input"
                      name="aria-live"
                      styles={chart_side_style}
                      value = {inside_chart_schema}
                      options = {state_inside_chart_options.filter(x => x.group === groupInsideChart)}
                      isSearchable = {false}
                        onChange = {changeInsideChart}
                        tabIndex={null}
                      /> 
                    </form>
                  </div>
                  <form>
                    <div style = {{marginBottom: '12px'}}/>
                    <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input"/>
                    <div style={{ padding: 10 }}/>
                    <Select 
                      aria-labelledby="aria-label"
                      inputId="aria-example-input"
                      name="aria-live-color"
                      //ariaLiveMessages={{
                      //  onFocus,
                      //}}
                      styles={second_side_style}
                      value = {secondSchema}
                      isDisabled={nationDisabled}
                      menuIsOpen={true}
                      //openMenuOnFocus={true}
                      options = {variables.filter(x => x.age === limit_age)}
                      onChange = {changeList}
                      isSearchable = {false}
                      tabIndex={null}
                    />
                  </form>
                  <div style = {{marginBottom: '22px'}}/>
                  <div className = 'content-for-accordion'>
                    <div className = {accordion_is}>
                      <div className = 'accordion-title' style = {{color: title_color}}>
                        {'More'+more_options+'Options'}
                        <div className = 'circle-symbol'  onClick = {clickButton} style = {{border: '2px solid '+title_color}}>
                          <div className="before-cross" style = {{background: title_color}}/>
                          <div className="after-cross" style = {{background: title_color}}/>
                        </div>
                      </div>
                      <div className = 'accordion-content'>
                        <form>
                          <div style = {{marginBottom: '22px'}}/>
                          <label id="aria-label" className = 'aria-focus' htmlFor="aria-example-input"/>
                          <Select 
                          styles={third_side_style}
                          menuIsOpen={true}
                          isMulti={true}
                          isDisabled={second_nationDisabled}
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          isClearable={false}
                          components={{
                            Option
                          }}
                          onChange = {changeAttribution}
                          value = {multi_attribution}
                          options = {attributions.filter(attributions => attributions.variable === selectedAttributions)}
                          isSearchable = {false}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 10 }}/>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='inside_container'>
              <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex1} aria-hidden = 'true'>
                <FontAwesomeIcon icon={faCaretLeft} className = 'icon_style' style={{transform: icon_rotate}}/>
              </button>
              <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                <div className='data_sidebar_interface'>
                  <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                    <FontAwesomeIcon icon={faCaretLeft} className = 'icon_style' style={{transform: icon_rotate}}/>
                  </button>
                  <div style={{marginTop:'10px'}}/>
                  <div className = 'Jonah-text-contain-with-background'>
                    <div className = 'Jonah-thep'>
                      This table estimates the percentage of deaf and hearing people by occupation, 
                      the percentage of people who have a bachelor’s degree or higher in each occupation, 
                      and the median earnings for each occupation.
                    </div>
                    <div className = 'Jonah-thep'>
                      <i>Click on the word “deaf” in the columns to arrange the chart in ascending 
                        or descending order.
                      </i> 
                    </div>
                  </div>
                </div>
              </div>
              <div className={data_grid}>
                <div className='a'>
                  <div className = 'state_title'>{"BACHELOR'S DEGREE ATTAINMENT AND MEDIAN EARNING: UNITED STATES"}</div>
                  <div style = {{height: '500px', overflow: 'scroll'}}>
                    <Table/>
                  </div>
                  <div className = 'last-row'/>
                </div>
                <div className='b' style={{display:interface_side}}>
                  <div style={{ padding: 10 }}/>
                  <div className = 'Jonah-text-contain'>
                    <div className = 'Jonah-thep'>
                      This table estimates the percentage of deaf and hearing people by occupation, 
                      the percentage of people who have a bachelor’s degree or higher in each occupation, 
                      and the median earnings for each occupation.
                    </div>
                    <div className = 'Jonah-thep'>
                      <i>Click on the word “deaf” in the columns to arrange the chart in ascending 
                        or descending order.
                      </i> 
                    </div>
                    <div style={{ padding: 10 }}/>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;