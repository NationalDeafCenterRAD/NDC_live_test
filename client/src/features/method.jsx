// High level functions
import {useState, useEffect, useRef} from "react";
import most_recent_year from '../data/acs_year.json';
import most_recent_year1 from '../data/acs_5_year.json';
import '../assets/styles/dashboard.css'

//Widget This faq.jsx is developed by Tyler Potts who provided "Easy React JS Accordion" tutorial through https://www.youtube.com/watch?v=jwp-cYZbgic
import FAQ from '../components/faq.jsx'
//import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

// Data for dashboard
import employment from '../data/employment.json';

//Font Awesomes
//import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

const Method = () => {
  const formatShort = (n) => {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
    if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  }

  const population_percentage = employment.filter(e => e.type === 'population' & 
    e.attribution === 'deaf' & e.state === 'United States' & e.variable === 'overall').map(e => e.percentage)[0]
  const population_estimator = formatShort(employment.filter(e => e.type === 'population' & 
    e.attribution === 'deaf' & e.state === 'United States' & e.variable === 'overall').map(e => e.n)[0])

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
    {question: 'How are deaf and other disability categories decided?',
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
      <div className = 'paragraph-method'>This dashboard uses racial and ethnic categories from the American Community Survey (ACS), 
      based on how individuals self-identify. We recognize that these categories may not fully align with how members of deaf communities 
      understand, experience, or wish to describe their racial or ethnic identities.
      <ul>
        <li>
          <span><b>Black</b> or African American and <b>white</b> include those who selected only that race.</span>
        </li>
        <li>
          <span><b>Native American</b> includes American Indian, Alaska Native, or a specific tribe.</span>
        </li>
        <li>
          <span><b>Asian</b> includes Asian and Pacific Islander groups such as Chinese, Filipino, Korean, and Native Hawaiian.</span>
        </li>
        <li>
          <span><b>Latine</b> includes people of Hispanic, Latino/a, or Spanish origin, which is collected separately  from race in the ACS.</span>
        </li>
        <li>
        <span><b>Multiracial</b> includes those who selected two or more races or another race not listed.</span>
        </li>
      </ul>
      <p/>
      As federal data collection and reporting practices evolve, we will continue to review how race and ethnicity are represented in the dashboard to 
      more accurately reflect the communities and cultures included in the data.
      <p/>
      More information available from the U.S. Census Bureau: <a href='https://www.census.gov/topics/population/race.html' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>About the Topic of Race</a>.      
     </div>,
      open: false   
    },
    {question: 'Why does the dashboard only include male and female gender categories?',
      answer:
      <div className = 'paragraph-method'>The data used in this dashboard come primarily from the American Community 
      Survey (ACS), which currently collects sex information using only two categories: male and female. 
      We acknowledge that these categories do not capture the full range of gender experiences within deaf communities. 
      Discussions are underway at the federal level to expand data collection to include Sexual Orientation and Gender Identity 
      questions, which would allow for more complete representation in the future. As data sources change, the dashboard will be 
      updated accordingly.
     </div>,
      open: false  
    },
    {question: 'Why does the National Level data use a 1-year estimate while the State Level data uses 5-year estimates?', 
      answer: 
       <div className = 'paragraph-method'>
       State data report numbers are sourced from the American Community Survey (ACS) 5-year estimates, which provide a more precise 
       representation by using a larger sample size. The national-level data used in the dashboard rely on ACS 1-year estimates to offer 
       the most current employment and education rates. Therefore, you will notice small differences. For example, the deaf bachelor's or 
       higher attainment rate is {
       employment.filter(e => e.type === 'education' & 
         e.attribution === 'deaf' & 
         e.state === 'United States' & e.status === 'bachelor').map(e => e.percentage)+'%'} for {most_recent_year} (national level tab) 
       but it averages {
       employment.filter(e => e.type === 'education' & 
        e.attribution === 'deaf' & 
        e.state === 'US' & e.status === 'bachelor').map(e => e.percentage)+'%'} from {(most_recent_year1-4)+'-'+(most_recent_year1)} (state level tab). 
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
      check out <a href="https://www.disabilitystatistics.org/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0000EE', fontWeight: 900 }}>Disability Statistics</a>, <a href='http://www.researchondisability.org/ADSC/build-your-own-statistics' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Center for Research on Disability</a>, 
      or <a href='https://data.census.gov/mdat/' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>American Community Survey Table Generator</a>.
      </div>,
      open: false
    },
    {question: 'How many deaf people live in the United States?',
     answer:
     <div className = 'paragraph-method'>According to the {most_recent_year} American 
     Community Survey (ACS), about {population_percentage+'%'} of the U.S. population or {population_estimator} people
     consider themselves deaf or have serious difficulty hearing (all ages). More information at: 
      <ul>
        <li>
          <a href='https://www.disabilitystatistics.org/' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Disability Statistics</a>
        </li>
        <li>
          <a href='https://www.researchondisability.org/ADSC/build-your-own-statistics' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>Center for Research on Disability</a>
        </li>
        <li><a href='https://data.census.gov/mdat/' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>American Community Survey Table Generator</a></li>
      </ul>
     <p/>
     The Hearing Loss Association of America estimates that <a href='https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1106004' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>48 million Americans have some degree of hearing loss</a>. 
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
    },
    {question: 'Why is the 2020 data point missing from the trend?',
      answer:
      <div className = 'paragraph-method'>In each trend on the NDC dashboard, 2020 data point is missing
      because the response rate in that year was 71.2%, unusually low due to the COVID-19 pandemic. At
      that time, policies aimed at slowing the spread of coronavirus (such as community-level stay-at-home orders)
      resulted in organizations adjusting their operations, which in turn complicated the ACS data collection.
      <p/>
      Even with the Census Bureau applying mitigation measures to address collection disruptions and modifying 
      the weighting adjustments, their assessment concluded that the estimates did not meet their criteria 
      (as per the Census Bureau's Statistical Quality Standards). For example, in the 2020 ACS 1-Y data, the 
      people with higher education, higher incomes, and who lived in single-family housing units were 
      overrepresented. If you want to learn more about this, 
      see <a href='https://www.census.gov/content/dam/Census/library/working-papers/2021/acs/2021_CensusBureau_01.pdf' target = '_blank' rel="noreferrer noopener" style = {{textDecoration:'none',color:'#0000EE',fontWeight:900}}>ACS Research and Evaluation Report Memorandum Series #ACS21-RER-04</a>.
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