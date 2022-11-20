// High level functions
import React, {useState} from "react";
import most_recent_year from './assets/acs_year.json';
import most_recent_year1 from './assets/acs_5_year.json';
import './dashboard.css'

//Widget This faq.js is developed by Tyler Potts who provided "Easy React JS Accordion" tutorial through https://www.youtube.com/watch?v=jwp-cYZbgic
import FAQ from './faq.js'

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
      <div className = 'head_faq'>FAQs</div>
      <div className = 'full_faq'>Frequently asked questions</div>
      <div className = 'faq_remark'>Any questions? We're here to help.</div>
      <div className = 'faqs'>
        {items.map((value, index)=>{
          return <FAQ value = {value} index = {index} toggleFAQ = {toggleFAQ}/>
        })}
      </div>
    </div>
  </div>
  );
}

export default Method