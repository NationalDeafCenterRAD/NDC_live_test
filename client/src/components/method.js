// High level functions
import React, {useState, useEffect, useRef} from "react";
import most_recent_year from './assets/acs_year.json';
import most_recent_year1 from './assets/acs_5_year.json';
import './dashboard.css'

//Widget This faq.js is developed by Tyler Potts who provided "Easy React JS Accordion" tutorial through https://www.youtube.com/watch?v=jwp-cYZbgic
import FAQ from './faq.js'
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

// Data for dashboard
import employment from './assets/employment.json';

//Font Awesomes
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

const Method = () => {
  const population_percentage = employment.filter(e => e.type === 'population' & 
    e.attribution === 'deaf' & e.state === 'United States' & e.variable === 'overall').map(e => e.percentage)[0]

  //SideBar Width
  const [sidebarWidth, setSideBarWidth] = useState('-290px');
  const buttonRef = useRef()
  const sidebarRef = useRef()

  useEffect(() => {
    const outsideDetection = e => {
      if ( buttonRef.current && !buttonRef.current.contains(e.target) &&
           sidebarRef.current && !sidebarRef.current.contains(e.target)){
        setSideBarWidth('-290px')
      }
    }

    document.addEventListener('mousedown', outsideDetection)

    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', outsideDetection)
    }
  }, [sidebarWidth])

  const [items, setItems] = useState([
    {question: 'Why does the National Level data use a 1-year estimate while the State Level data uses 5-year estimates?', 
      answer: 
       <div className = 'paragraph-method'>
       The American Community Survey provides data in 1-year and 5-year estimates. The dashboard uses 1-year estimates for 
       the national-level data to provide the most current employment and education rates. 5-year estimates, which are larger, 
       are used for state-level data to ensure that the sample size is large enough to be representative.
       The {most_recent_year} 1-year ACS sample for deaf people is {
       employment.filter(employment => employment.type === 'employment' & 
         employment.attribution === 'deaf' & 
         employment.state === 'United States' &
         (employment.status === 'unemployed' | employment.status === 'employed' | 
         employment.status === 'notinLF')).map(employment => employment.n).reduce(
         (sum, a) => sum + a, 0).toLocaleString('en-US')} while the {(most_recent_year1-4)+'-'+(most_recent_year1)} 5-year ACS sample is {
       employment.filter(employment => employment.type === 'employment' & 
         employment.attribution === 'deaf' & 
         employment.state !== 'United States' &
         (employment.status === 'unemployed' | employment.status === 'employed' | 
         employment.status === 'notinLF')).map(employment => employment.n).reduce(
         (sum, a) => sum + a, 0).toLocaleString('en-US')
       }. 
       </div>,
      open: false
    },
    {question: 'Why are some of the age ranges 16-64 and other age ranges 25-64?',
      answer:
      <div className = 'paragraph-method'>This dashboard includes employment data for deaf 
      people ages 16-64, commonly considered to be the working-age population, and education data 
      for deaf people ages 25-64, used to calculate educational attainment rates. If you would like 
      to learn more about deaf people younger than 16, 
      check out <a href="https://www.disabilitystatistics.org/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0000EE', fontWeight: 900 }}>Disability Statistics</a>, 
      or the <a href='https://data.census.gov/mdat/#/' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>American Community Survey Table Generator</a>.
      </div>,
      open: false
    },
    {question: 'What is the difference between unemployed and not in the labor force?',
      answer:
      <div className = 'paragraph-method'>The federal government describes people without a 
      job as people who are unemployed or not in the labor force. People who reported being 
      currently, or recently, looking for work, are counted as unemployed. People who are not currently 
      employed, and are not looking for work, are counted as not in the labor force. This latter group may 
      include students, parents, caretakers, or retired people, for example.
      </div>,
      open: false
    },
    {question: 'How are deaf and other disability categories defined?',
      answer:
      <div className = 'paragraph-method'>The American Community Survey (ACS) does not define "deaf" as an identity. Instead, it collects data based on functional 
      abilities by asking, "<b>Is this person deaf or does he/she have serious difficulty hearing?</b>" It categorizes people broadly by disability type, asking about 
      difficulties related to seeing, walking, remembering, dressing, or doing errands. For more information, see <a href='https://www.census.gov/topics/health/disability/guidance/data-collection-acs.html' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>How Disability Data are Collected from The American Community Survey</a>.
      <p/>
      In the Dashboard:<br/>
      We do our best to create categories based on terminology used in the community.
      <ul>
        <li>
          <span><b>deaf</b> – Anyone who is deaf or has serious difficulty hearing.</span>
        </li>
        <li>
          <span><b>deafblind</b> – Anyone who is deaf and blind, or deaf with difficulty seeing.</span>
        </li>
        <li>
          <span><b>deafdisabled</b> – Anyone who is deaf and has any other disability (excluding blindness).</span>
        </li>
        <li>
          <span><b>deaf with no disability</b> – Anyone who is deaf and reports no other disabilities.</span>
        </li>
        <li>
        <span><b>deaf with additional disabilities</b> – Anyone who is deaf and reports one or more additional disabilities.</span>
        </li>
      </ul>
     </div>,
      open: false   
    },
    {question: 'How are the racial categories decided?',
      answer:
      <div className = 'paragraph-method'>This dashboard uses racial and ethnic categories from the American Community Survey (ACS), based on how people identify themselves. 
      <ul>
        <li>
          <span><b>Black</b> or African American and <b>white</b> include those who selected only that race.</span>
        </li>
        <li>
          <span><b>Native American</b> includes American Indian, Alaska Native, or a specific tribe.</span>
        </li>
        <li>
          <span><b>Asian</b> includes Asian and Pacific Islander groups like Chinese, Filipino, Korean, and Native Hawaiian.</span>
        </li>
        <li>
          <span><b>Latine</b> includes people of Hispanic, Latino/a, or Spanish origin (asked separately from race).</span>
        </li>
        <li>
        <span><b>Multiracial</b> includes those who selected two or more races or another race not listed.</span>
        </li>
      </ul>
      <p/>
      More information available at the U.S. Census Bureau: <a href='https://www.census.gov/topics/health/disability/guidance/data-collection-acs.html' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>About the Topic of Race</a>.      
     </div>,
      open: false   
    },
    {question: 'How many deaf people live in the United States?',
     answer:
     <div className = 'paragraph-method'>According to the {most_recent_year}, 
     American Community Survey (ACS), about {population_percentage+'%'} of the U.S. population 
     consider themselves deaf or have serious difficulty hearing. More information at: 
      <ul>
        <li>
          <a href='https://www.disabilitystatistics.org/' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>www.disabilitystatistics.org</a>
        </li>
        <li>
          <a href='https://www.researchondisability.org/ADSC/build-your-own-statistics' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>www.researchondisability.org/ADSC/build-your-own-statistics</a>
        </li>
      </ul>
     <p/>
     The Hearing Loss Association of America estimates that <a href='https://www.hearingloss.org/wp-content/uploads/HLAA_HearingLoss_Facts_Statistics.pdf' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>48 million Americans have some degree of hearing loss</a>.  
    </div>,
     open: false   
    },
    {question: 'How many deaf people use sign language?',
     answer:
     <div className = 'paragraph-method'>The American Community Survey collects information about how 
     well a person speaks English, and allows people to write in the additional languages used in the home. 
     The ACS does not ask about knowledge or use of sign language. For current estimates about sign language use, 
     see <a href='https://academic.oup.com/jdsde/article/28/1/1/6845390?login=false' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Mitchell & Young, (2022)</a>.
     </div>,
     open: false
    },
    {question: 'How many deaf people attend residential schools and mainstream schools?', 
      answer:
       <div className = 'paragraph-method'>The American Community Survey does not collect data 
       about the type of school deaf people attend so we do not know which educational environment 
       people in this sample had attended. For estimates about deaf students in different educational 
       environments, see <a href='https://www.jstor.org/stable/27023781' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Palmer et al., 2020</a>; <a href='https://www.ed.gov/idea-section-618-data-products-static-files' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>IDEA Section 618 Data</a> or <a href='https://sites.ed.gov/idea/osep-fast-facts-educational-environments-school-aged-children-disabilities/' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>OSEP Fast Facts (2022)</a>.
       </div>,
      open: false
    }
  ]);

  const toggleFAQ = index => {
    setItems(items.map((value, i) => {
      if (i === index) {
        value.open = true
      } else {
        value.open = false;
      }
      return value;
    }));
  }

  return(
  <>
    <div className = 'Jonah-body-contain'>
      <div className = 'Jonah-text-contain-about'>
        <div className = 'faq-title'>Data Dashboard FAQs</div>
        <div className = 'faqs'>
          {items.map((value, index)=>{
            return <FAQ value = {value} key = {index} index = {index} toggleFAQ = {toggleFAQ}/>
          })}
        </div>
      </div>
    </div>
  </>
  );
}

export default Method