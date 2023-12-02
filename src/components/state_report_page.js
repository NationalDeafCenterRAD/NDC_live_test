// React
import React, {useState, useLayoutEffect, useRef } from 'react';

//Data
import acs_five_year from './assets/acs_5_year.json';

//Widgets
import Select from 'react-select';
import { Link } from 'react-router-dom';

//Icons and fonts
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';

// Import multiple PDFs
function importAll(r) {
  let files = {};
   r.keys().forEach((item, index) => { files[item.replace('./', '')] = r(item); });
  return files
 }
 const PDFs = importAll(require.context('./assets/Reports', false, /\.pdf$/));


let geographics_wo_US = [
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

const year = (acs_five_year-4)+'-'+(acs_five_year)

const StateReport = ({colors, justcolor, colorfill, navmenu}) => {
  // Screen Size Responsive Effects
  const [searchable, setSearchable] = useState(true)

  const [data_sidebar, setData_SideBar] = useState('None')
  const [interface_side, setInterface_Side] = useState('unset')
  const [data_grid, setData_Grid] = useState('grid')

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

  // Stylize selection styles
  const chart_side_style = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? '#0d7777' : state.isFocused ? '#ECEDF0' : 'white',
      color: state.isSelected ? 'white': 'black',
      cursor: state.isDisabled ? 'default' : 'pointer',
      fontWeight: state.isDisabled ? 900 : 300
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

  // Functions for "Report" tab
  const [report_state, setReportState] = useState('State...');
  const [when_you_select, setWhenYouSelect] = useState('Before')
  const [report_multi_state, setReportMultiState] = useState([  {label: 'State...', value: 'State...'}])
  const [reportPDF, setReportPDF] = useState('NDC_Texas_report.pdf')
  const changeReportGeoState = (e) => {
    setReportState(e.variable)
    setReportMultiState(e)
    setReportPDF('NDC_'+e.variable+'_report.pdf')
    setWhenYouSelect('After')
  }

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
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [textaccordion_is, setTextAccordionIs] = useState('accordion-is-open');
  const textButton = () => {
    textaccordion_is === 'accordion-is-open' ? setTextAccordionIs('accordion-is') : setTextAccordionIs('accordion-is-open');
  }

  return(
    <>
      <div className="body">
        <div className = 'container'>
          <div className = 'main-grid'>
            <div className = 'main-a'>
              <div id = 'title'>
                Deaf Postsecondary Data from the American Community Survey ({year})
              </div>
              <Link to='/' reloadDocument className = 'aria_report_button' aria-label = 'Return to Data Dashboard'>
                <div id = 'Jonah-report-generator-text'>
                  <FontAwesome className='iconSecondButton' name = 'bar-chart' style = {{fontSize: '20px'}}/> &nbsp; Dashboard
                </div> 
              </Link> 
            </div>  
            <div className = 'main-b'/>                
          </div>
          <div className='inside_container-border-radius-all-rounds' style={{minHeight: '500px'}}>
            <p className='aria-text'>Left Content</p>
            <p className='aria-text'>
              This content contains 51 reports and you can select the state to generate a report.
            </p>
            <p className='aria-text'>Beginning of State Report Generator</p>
            {
              {
              'Before' : 
              <>
                <div className={data_grid}>
                  <div className='a'>
                    <div className = 'state_title'>
                      <div className = 'text-to-button'>
                        {'STATE REPORT'}
                      </div>
                      <Link to='/' reloadDocument className = 'report_button' aria-label = 'Return to Data Dashboard' aria-hidden = 'true'>
                        <FontAwesome className='iconSecondButton' name = 'bar-chart' style = {{fontSize: '20px'}}/> &nbsp; Dashboard
                      </Link>
                    </div>
                    <div style={{display:data_sidebar}} aria-hidden = 'true'>
                      <div className = 'state_title' style = {{border: 'none', textAlign: 'center'}}>To generate a report, select your state:</div>
                    </div>
                    <div className = 'that-is-my-form-container' style={{display:data_sidebar}}>
                      <Select 
                          styles={chart_side_style}
                          isSearchable = {false}
                          tabIndex={null}
                          value = {report_multi_state}
                          options = {geographics_wo_US.filter(geographics_wo_US => geographics_wo_US.label !== 'District of Columbia')}
                          onChange = {changeReportGeoState}
                      />
                    </div>
                    <svg height = '29vw' viewBox="-1.9 0.45 5 4" style= {{display: 'block', maxHeight:'310px', minHeight:'200px', marginRight: 'auto', marginLeft: 'auto'}}>
                      <path fill = '#414042' d = 'M -0.8 0.7 L -0.8 4.2 L -0.7 4.2 L -0.7 0.8 L 1.3 0.8 L 1.3 1.5 L 1.9 1.5 L 1.9 4.1 L -0.8 4.1 L -0.8 4.2 L 2 4.2 L 2 1.4 L 1.4 1.4 L 1.4 0.7 Z M 1.35 0.8 L 1.95 1.5 L 2 1.4 L 1.4 0.7 Z M -0.5 1.7 L 1.7 1.7 L 1.7 1.8 L -0.5 1.8 Z M -0.5 2 L 1.7 2 L 1.7 2.1 L -0.5 2.1 Z M -0.5 2.4 L 0.5 2.4 L 0.5 2.3 L -0.5 2.3 Z M -0.5 2.6 L 0.5 2.6 L 0.5 2.7 L -0.5 2.7 Z M -0.5 3 L 0.5 3 L 0.5 2.9 L -0.5 2.9 Z M -0.5 3.3 L 1.7 3.3 L 1.7 3.2 L -0.5 3.2 Z M -0.5 3.6 L 1.7 3.6 L 1.7 3.5 L -0.5 3.5 Z M 0.7 3 L 1.1 3 L 1.1 2.3 L 0.7 2.3 Z'/>
                      <path fill = '#00A79D' d = 'M 1.65 3 L 1.25 3 L 1.25 2.5 L 1.65 2.5 Z'/>
                    </svg>
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
                              Download, read, and share state reports about postsecondary outcomes of deaf people in your state. 
                              This important information may benefit people and organizations in each state as strategies are identified 
                              and put in place for systemic changes to better postsecondary outcomes for deaf people.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='b' style={{display:interface_side}}>
                    <p className='aria-text'>Right Content</p>
                    <p className='aria-text'>
                      This content consists of one selection option that affect report.
                    </p>
                    <form style = {{width: '300px'}}>
                      <label id="aria-label1" className = 'aria-focus' htmlFor="aria-input1"/>
                      <div style = {{marginBottom: '10px'}}/>
                      <p className = 'state_title' style = {{border: 'none'}}>To generate a report, select your state:</p>
                      <Select 
                      aria-labelledby="aria-label1"
                      //ariaLiveMessages={{
                      //  onFocus,
                      //}}
                      inputId="aria-input1"
                      name="aria-live"
                      styles={chart_side_style}
                      isSearchable = {searchable}
                      tabIndex={null}
                      value = {report_multi_state}
                      options = {geographics_wo_US.filter(geographics_wo_US => geographics_wo_US.label !== 'District of Columbia')}
                      onChange = {changeReportGeoState}
                      />
                    </form>
                    <div style={{ padding: 10 }}/>
                  </div>
              </div>
              </>,
              'After':
                <>
                  <button className = 'data_sidebar_button' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex1} aria-hidden = 'true'>
                    <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                  </button>
                  <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                    <div className='data_sidebar_interface'>
                      <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                        <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
                      </button>
                      <div style={{marginTop:'10px'}}/>
                      <div style = {{marginBottom: '22px'}}/>
                      <p id = 'report_state_title'>To generate a report, select your state:</p>
                      <Select 
                        styles={chart_side_style}
                        isSearchable = {false}
                        tabIndex={null}
                        value = {report_multi_state}
                        options = {geographics_wo_US.filter(geographics_wo_US => geographics_wo_US.label !== 'District of Columbia')}
                        onChange = {changeReportGeoState}
                      />
                    </div>
                  </div>
                  <div className={data_grid}>
                    <div className='a'>
                      <div className = 'state_title'>
                        <div className = 'text-to-button'>
                          {report_state.toUpperCase()+' STATE REPORT'}
                        </div>
                        <Link to='/' reloadDocument className = 'report_button' aria-label = 'Return to Data Dashboard' aria-hidden = 'true'>
                          <FontAwesome className='iconSecondButton' name = 'bar-chart' style = {{fontSize: '20px'}}/> &nbsp; Dashboard
                        </Link>
                      </div>
                      <object data={PDFs[reportPDF]} type="application/pdf" frameborder="0" width="100%" height="400px" style={{ marginLeft: 'auto', marginRight: 'auto', width: '100%' }} aria-label = 'PDF Viewer'>
                        <div style = {{textAlign: 'center'}}>
                          <svg height = '29vw' viewBox="-1.9 0.45 5 4" style= {{maxHeight:'250px', minHeight:'150px'}}>
                            <path fill = '#828282' d = 'M -0.8 0.7 L -0.8 3.1 L -0.7 3 L -0.7 0.8 L 1.3 0.8 L 1.3 1.5 L 1.9 1.5 L 1.9 2.7 L 1.7 2.9 L 1.5 2.7 L 1.3 2.9 L 1.1 2.7 L 0.9 2.9 L 0.7 2.7 L 0.5 2.9 L 0.3 2.7 L 0.1 2.9 L -0.1 2.7 L -0.3 2.9 L -0.5 2.7 L -0.7 2.9 L -0.8 2.9 L -0.8 3 L -0.7 3 L -0.5 2.8 L -0.3 3 L -0.1 2.8 L 0.1 3 L 0.3 2.8 L 0.5 3 L 0.7 2.8 L 0.9 3 L 1.1 2.8 L 1.3 3 L 1.5 2.8 L 1.7 3 L 1.9 2.8 L 2 2.7 L 2 1.4 L 1.4 1.4 L 1.4 0.7 Z M 1.35 0.8 L 1.95 1.5 L 2 1.4 L 1.4 0.7 Z M -0.8 3.2 L -0.8 4.2 L 2 4.2 L 2 4.1 L -0.7 4.1 L -0.7 3.2 L -0.5 3 L -0.3 3.2 L -0.1 3 L 0.1 3.2 L 0.3 3 L 0.5 3.2 L 0.7 3 L 0.9 3.2 L 1.1 3 L 1.3 3.2 L 1.5 3 L 1.7 3.2 L 1.9 3 L 1.9 4.2 L 2 4.2 L 2 2.8 L 1.9 2.9 L 1.7 3.1 L 1.5 2.9 L 1.3 3.1 L 1.1 2.9 L 0.9 3.1 L 0.7 2.9 L 0.5 3.1 L 0.3 2.9 L 0.1 3.1 L -0.1 2.9 L -0.3 3.1 L -0.5 2.9 L -0.7 3.1 Z M -0.5 1.7 L 1.7 1.7 L 1.7 1.8 L -0.5 1.8 Z M -0.5 2 L 1.7 2 L 1.7 2.1 L -0.5 2.1 Z M -0.5 2.4 L 0.5 2.4 L 0.5 2.3 L -0.5 2.3 Z M -0.5 3.6 L 1.7 3.6 L 1.7 3.5 L -0.5 3.5 Z M 0.7 2.6 L 0.9 2.8 L 1.1 2.6 L 1.1 2.3 L 0.7 2.3 Z' />
                            <path fill = '#e05a43' d = 'M 1.65 2.75 L 1.5 2.6 L 1.3 2.8 L 1.25 2.75 L 1.25 2.5 L 1.65 2.5 Z'/>
                          </svg>
                        </div>
                      </object>
                      <div id = 'Report-Jonah-text-contain'>
                        <div className = 'Jonah-thep'>If you are unable to fully access the report, your browser may not support PDFs.</div>
                        <div className = 'Jonah-thep'><b>Download here instead: <a href={PDFs[reportPDF]} style = {{textDecoration: 'none', color: '#0d7777'}}>{report_state} Report</a></b></div> 
                      </div>
                    </div>
                    <div className='b' style={{display:interface_side}}>
                      <p className='aria-text'>Right Content</p>
                      <p className='aria-text'>
                        This content consists of one selection option that affect report.
                      </p>
                      <form>
                        <label id="aria-label1" className = 'aria-focus' htmlFor="aria-input1"/>
                        <div style = {{marginBottom: '10px'}}/>
                        <p className = 'state_title' style = {{border: 'none'}}>To generate a report, select your state:</p>
                        <Select 
                        aria-labelledby="aria-label1"
                        //ariaLiveMessages={{
                        //  onFocus,
                        //}}
                        inputId="aria-input1"
                        name="aria-live"
                        styles={chart_side_style}
                        isSearchable = {searchable}
                        tabIndex={null}
                        value = {report_multi_state}
                        options = {geographics_wo_US.filter(geographics_wo_US => geographics_wo_US.label !== 'District of Columbia')}
                        onChange = {changeReportGeoState}
                        />
                      </form>
                      <div style={{ padding: 10 }}/>
                    </div>
                  </div>
                </>
            }[when_you_select]
          }
          </div>
        </div>
      </div>
    </>
  )
}

export default StateReport