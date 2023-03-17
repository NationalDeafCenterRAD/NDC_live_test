// High level functions
import React, {useState, useEffect, useLayoutEffect, useRef} from "react";
import most_recent_year from './assets/acs_year.json';
import most_recent_year1 from './assets/acs_5_year.json';
import './dashboard.css'

//Widget This faq.js is developed by Tyler Potts who provided "Easy React JS Accordion" tutorial through https://www.youtube.com/watch?v=jwp-cYZbgic
import FAQ from './faq.js'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';

// Data
import employment from './assets/employment.json';

//Font Awesomes
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

/*The data for this project were taken from the Public Use Microdata Sample (PUMS) of the 2021 American Community Survey (ACS), conducted by the United States census. The PUMS provides a confidential subset of the ACS for the public to analyze. 
The ACS is a legally mandated questionnaire sent to a random sample of addresses of homes and group quarters in the US. The questionnaire includes questions about both housing units and their individual occupants. The PUMS dataset includes survey 
weights, designed to produce estimates that generalize to US people, along with a set of replicate weights used to estimate sampling error. These weights account for the complex probability sample design as well as for non-response. 
Although the census bureau goes to great lengths to minimize non-sampling error, it is impossible to fully eliminate, so estimates should be interpreted with care. More information can be found at American Community Surveys.

The sample of interest in these analyses was non-institutionalized people between the ages of 25 and 64. Recall that the U.S. Census collects data on functional limitations and not disability or identity labels. The disability categories used in 
the ACS ask respondents to report if they have any serious difficulty in the following areas:

Hearing
Vision
Cognitive ability
Ambulatory ability
Self-care ability
Independent living ability

Survey respondents who stated that they had “hearing difficulties” were used to represent the deaf population in these analyses. More than XX,XXX deaf people were in the final sample. The comparison group was those who did not report having any 
“hearing difficulties,” what we label as hearing people. For the most part, the data for the group of hearing people are largely comparable to data for the general population. But for comparison purposes, this analysis focuses on people in the 
general population that did not report any type of “hearing difficulties,” which allows for an understanding of what employment experiences may be unique to the deaf population, and what may not be.

The descriptive statistics in this report are all corrected by the person-level survey weights provided by the census. When numbers are compared to each other in this report, we used a t-test, with standard errors calculated using provided survey 
replicate weights, to determine if difference in the numbers were due to statistical noise. These statistical tests are purely descriptive in nature, and we do not intend to suggest that any of the associations described are causal in nature. 
As such, we did not correct for any other variables in providing these descriptive statistics.
The R syntax for all the statistical estimates in the paper can be accessed at url.*/


const Method = () => {
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
  const [paddingSide, setPaddingSide] = useState(null)
  useEffect(() => {
    if(size[0] < 900 & size[0] > 550 ){
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      setPaddingSide('10px')
    }else if(size[0] < 551){
      setData_SideBar('grid')
      setInterface_Side('None')
      setData_Grid('ungrid')
      setPaddingSide('6px')
    }else{
      setData_SideBar('None')
      setInterface_Side('unset')
      setData_Grid('grid')
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

  const [items, setItems] = useState([
    {question: 'What kind of data did we use?', 
     answer: 
      <div className = 'paragraph-method'>The data for this project were taken from the
      Public Use Microdata Sample (PUMS) of the {most_recent_year} and {(most_recent_year1-4)+'-'+most_recent_year}
      American Community Survey (ACS), conducted
      by the United States census. The PUMS provides
      a confidential subset of the ACS for the public
      to analyze. The ACS is a legally mandated questionnaire 
      sent to a random sample of addresses
      of homes and group quarters in the US. The
      questionnaire includes questions about both
      housing units and their individual occupants. The
      PUMS dataset includes survey weights, designed
      to produce estimates that generalize to US people, 
      along with a set of replicate weights used to
      estimate sampling error. These weights account
      for the complex probability sample design as well
      as for non-response. Although the census bureau
      goes to great lengths to minimize non-sampling
      error, it is impossible to fully eliminate, so
      estimates should be interpreted with care. More
      information can be found at <a href='http://www.census.gov/programs-surveys/acs/about.html' style = {{textDecoration:'none',color:'#008e84',fontWeight:900}}>American Community Surveys</a>.
      </div>,
     open: false
    },
    {question: 'How large is the American Community Survey data?', 
     answer:
      <div className = 'paragraph-method'>The American Community Survey data has sent household surveys to approximately 3.5 million addresses per year.
      There are more than 20,000 variables in this data. These analyses translate these data into data dashboard. 
      The {most_recent_year} sample included {
      employment.filter(employment => employment.type === 'employment' & 
        employment.attribution === 'deaf' & 
        employment.state === 'United States' &
        (employment.status === 'unemployed' | employment.status === 'employed' | 
        employment.status === 'notinLF')).map(employment => employment.n).reduce(
        (sum, a) => sum + a, 0).toLocaleString('en-US')} deaf people, and the 5-year sample ({(most_recent_year1-4)+'-'+(most_recent_year1)}) used for state-level data  
      included {
      employment.filter(employment => employment.type === 'employment' & 
        employment.attribution === 'deaf' & 
        employment.state !== 'United States' &
        (employment.status === 'unemployed' | employment.status === 'employed' | 
        employment.status === 'notinLF')).map(employment => employment.n).reduce(
        (sum, a) => sum + a, 0).toLocaleString('en-US')
      } deaf people. 
      </div>,
     open: false
    },
    {question: 'How do we define the deaf population?',
     answer:
     <div className = 'paragraph-method'>Recall that the U.S. Census Bureau collects data on functional limitations and not disability or identity labels.
     The respondents who stated that they had "serious difficulty hearing" were used to represent the deaf population in these analyses.
     </div>,
    open: false

  }
  ])

  const toggleFAQ = index => {
    setItems(items.map((value, i) => {
      if (i === index) {
        value.open = !value.open
      } else {
        value.open = false;
      }
      return value;
    }))
  }

  return(
  <div className = 'body'>
    <div className = 'container'>
      <div className = 'main-grid'>
        <div className = 'main-a'>
          <div id = 'title'>
            Deaf Postsecondary Data from the American Community Survey
          </div>
        </div>  
      </div>
      <Tabs aria-label="A set of charts">
        <TabList>
          <Tab style={{paddingLeft:paddingSide, paddingRight: paddingSide}}>{'FAQs'}</Tab>
        </TabList>
        <TabPanel>
          <div className='inside_container'>
            <p className='aria-text'>Left Content</p>
            <p className='aria-text'>
              This content contains a list of common questions to ask.
            </p>
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
                <div className = 'title'>{'FREQUENTLY ASKED QUESTIONS'}</div>
                <div className = 'faqs'>
                  {items.map((value, index)=>{
                    return <FAQ value = {value} index = {index} toggleFAQ = {toggleFAQ}/>
                  })}
                </div>
              </div>
              <div className='b' style={{display:interface_side}}>
                <p className='aria-text'>Right Content</p>
                <p className='aria-text'>
                  This content consists of one selection that sends you to different sections (i.e., General section, Employment section)
                </p>
              </div>
            </div>
        </div>
      </TabPanel>
    </Tabs>
    </div>
  </div>
  );
}

export default Method