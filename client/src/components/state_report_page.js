// React
import React, {useState} from 'react';

//Widgets
import Select from 'react-select';

// CSS
import './dashboard.css';

//Icons and fonts
import 'font-awesome/css/font-awesome.min.css';
import 'font-awesome/css/font-awesome.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
//import FontAwesome from 'react-fontawesome';

// Import United States map
import USmap from './assets/usmap.json'

// Import multiple PDFs
function importAll(r) {
  let files = {};
   r.keys().forEach((item) => { files[item.replace('./', '')] = r(item); });
  return files
 }
 const PDFs = importAll(require.context('./assets/Reports', false, /\.pdf$/));

const StateReport = ({colors, justcolor, colorfill, navmenu}) => {
  // Functions for "Report" tab
  const [report_multi_state, setReportMultiState] = useState([  {label: 'Select a state to read...', value: 'Select a state to read...'}])
  const changeReportGeoState = (e) => {
    setReportMultiState(e)
    window.open(PDFs['NDC_'+e.variable+'_report.pdf'])
  }

  // React selection
  const chart_side_style = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#0d7777' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: state.isDisabled ? 'default' : 'pointer',
      fontWeight: state.isDisabled ? 900 : 300,
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

  let state_reports = [
    {label: 'Alabama', value: 'Alabama', variable: 'Alabama'},
    {label: 'Alaska', value: 'Alaska', variable: 'Alaska'},
    {label: 'Arizona', value: 'Arizona', variable: 'Arizona'},
    {label: 'Arkansas', value: 'Arkansas', variable: 'Arkansas'},
    {label: 'California', value: 'California', variable: 'California'},
    {label: 'Colorado', value: 'Colorado', variable: 'Colorado'},
    {label: 'Connecticut', value: 'Connecticut', variable: 'Connecticut'},
    {label: 'Delaware', value: 'Delaware', variable: 'Delaware'},
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

  // US functions
  const [stateLabel, setStateLabel] = useState('');
  const [hiddenBox, setHiddenBox] = useState(0);
  const textforStateAppear = (e) => {
    setStateLabel(e);
    setHiddenBox(1)
  };
  const textforStateDisappear = () => {
    setHiddenBox(0);
  };

  const [positions, setPositions] = useState([0,0]);
  function textHover(event){
    setPositions([event.clientY-15+'px',event.clientX-45+'px'])
  };

  const itemPDF = USmap.filter(e => e.id !== 'DC');

  return(
    <>
      <div className = 'container'>
          <div className='a' id = 'pdf-a'>
            <div className = 'state_title' id = 'textCenter' style = {{marginBottom: '30px'}}>
              <div className = 'aboutdata-title' id = 'textWrap'>
                State Reports: Postsecondary Achievement of Deaf People 
              </div>
            </div>
            <div id = 'stateSelect'>
              <Select 
                isSearchable = {false}
                tabIndex={null}
                value = {report_multi_state}
                options = {state_reports}
                onChange = {changeReportGeoState}
                styles = {chart_side_style}
              />
            </div>
            <p className='aria-text'>Here is the interactive U.S. map for users to select and choose the state report.</p>
            <div className='us-map-container' onMouseMove={textHover}>
              <svg width="100%" height="100%" className = 'us-map-svg' viewBox='0 0 930 590' xmlns="http://www.w3.org/2000/svg">
                {itemPDF.map((value)=>{
                  return (
                    <a href = {PDFs['NDC_'+value.label+'_report.pdf']} 
                       type="application/pdf" title={value.label}
                       media="print" 
                       target = '_blank' rel="noreferrer noopener" className = 'pdf-block' 
                       onMouseEnter = {() => textforStateAppear(value.id)} onMouseLeave={textforStateDisappear}
                       tabIndex={-1} key={value.id}>
                      <path d={value.shape}/>
                    </a>
                  )
                })}
              </svg>
              <div id="hoveringText" style={{top: positions[0], left:positions[1], opacity: hiddenBox}}>{stateLabel}</div>
            </div>
            <div className = 'Jonah-text-contain' style = {{marginBottom: '20px', marginTop: '20px'}}>
              <div className = 'Jonah-thep'>
                Download, read, and share state reports about postsecondary 
                outcomes of deaf people in your state. This important information may 
                benefit people and organizations in each state as strategies are identified 
                and put in place for systemic changes to better postsecondary outcomes for deaf people.
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

export default StateReport