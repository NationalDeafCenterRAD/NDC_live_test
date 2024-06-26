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
    {question: 'How many deaf people live in the United States?',
     answer:
     <div className = 'paragraph-method'>According to the {most_recent_year}, 
     American Community Survey (ACS), about {population_percentage+'%'} of the U.S. population 
     consider themselves deaf or have serious difficulty hearing. More information at: 
      <ul>
        <li>
          <a href='https://www.disabilitystatistics.org/' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>www.disabilitystatistics.org</a>
        </li>
        <li>
          <a href='https://www.researchondisability.org/ADSC/build-your-own-statistics' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>www.researchondisability.org/ADSC/build-your-own-statistics</a>
        </li>
      </ul>
     <p/>
     The Hearing Loss Association of America estimates that <a href='https://www.hearingloss.org/wp-content/uploads/HLAA_HearingLoss_Facts_Statistics.pdf' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>48 million Americans have some degree of hearing loss</a>.  
    </div>,
     open: false   
    },
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
    {question: 'How many deaf people attend residential schools and mainstream schools?', 
     answer:
      <div className = 'paragraph-method'>The American Community Survey does not collect data 
      about the type of school deaf people attend so we do not know which educational environment 
      people in this sample had attended. For estimates about deaf students in different educational 
      environments, see <a href='https://www.jstor.org/stable/27023781' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Palmer et al., 2020</a>; <a href='https://www2.ed.gov/programs/osepidea/618-data/state-level-data-files/index.html' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>IDEA Section 618 Data</a> or <a href='https://sites.ed.gov/idea/osep-fast-facts-educational-environments-school-aged-children-disabilities/' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>OSEP Fast Facts (2022)</a>.
      </div>,
     open: false
    },
    {question: 'How many deaf people use sign language?',
     answer:
     <div className = 'paragraph-method'>The American Community Survey collects information about how 
     well a person speaks English, and allows people to write in the additional languages used in the home. 
     The ACS does not ask about knowledge or use of sign language. For current estimates about sign language use, 
     see <a href='https://academic.oup.com/jdsde/article/28/1/1/6845390?login=false' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Mitchell & Young, (2022)</a>.
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
    {question: 'Why are some of the age ranges 16-64 and other age ranges 25-64?',
     answer:
     <div className = 'paragraph-method'>This dashboard includes employment data for deaf 
     people ages 16-64, commonly considered to be the working-age population, and education data 
     for deaf people ages 25-64, used to calculate educational attainment rates. If you would like 
     to learn more about deaf people younger than 16, 
     check out <a href='https://www.disabilitystatistics.org/' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Disability Statistics</a>, 
     or the <a href='https://data.census.gov/mdat/#/' style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>American Community Survey Table Generator</a>.
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
  <>
    <div className = 'Jonah-body-contain'>
      <div className = 'Jonah-text-contain-about'>
        <div className = 'faq-title'>Data Dashboard FAQs</div>
        <div className = 'faqs'>
          {items.map((value, index)=>{
            return <FAQ value = {value} index = {index} toggleFAQ = {toggleFAQ}/>
          })}
        </div>
      </div>
    </div>
  </>
  );
}

export default Method