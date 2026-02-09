import '../assets/styles/emp_chart_text.css';
import acs_five_year from '../data/acs_5_year.json';
import acs_one_year from '../data/acs_year.json';
import employment from '../data/employment.json';
import { useCitation } from "../components/citation";

// Font Families
import "@fontsource/roboto-slab";
import "@fontsource/roboto";


const AboutData = () => {
  return(
    <div className = 'aboutdata-background'>
      <div className = 'aboutdata-body'>
        <div className = 'width-of-textchart'>
          <p className = 'aboutdata-title'>About Dashboard</p>
          <div className = 'text-for-chart' id = 'this-one-is-for-extracting-text-only'>
            Data is from the American Community Survey, an annual survey conducted by 
            the U.S. Census Bureau. Survey respondents who stated that they were deaf, 
            or had serious difficulty hearing, were used to represent the deaf population in 
            these analyses. The {acs_one_year} sample 
            included {
              employment.filter(employment => employment.type === 'employment' & 
              employment.attribution === 'deaf' & 
              employment.state === 'United States' &
              (employment.status === 'unemployed' | employment.status === 'employed' | 
              employment.status === 'notinLF')).map(employment => employment.n).reduce(
              (sum, a) => sum + a, 0).toLocaleString('en-US')
            } deaf people, and the 5-year sample ({(acs_five_year-4)+'-'+(acs_five_year)}) 
            used for state-level data 
            included {
              employment.filter(employment => employment.type === 'employment' & 
              employment.attribution === 'deaf' & 
              employment.state !== 'United States' &
              (employment.status === 'unemployed' | employment.status === 'employed' | 
              employment.status === 'notinLF')).map(employment => employment.n).reduce(
              (sum, a) => sum + a, 0).toLocaleString('en-US')
            } deaf people.
          </div>
          <p className = 'aboutdata-title'>Recommended Citation</p>
          <div className = 'text-for-chart' id = 'for-citation'>
            {useCitation[0]}<b><a href = 'https://dashboard.nationaldeafcenter.org' style = {{textDecoration: 'none', color: '#0000EE'}}>{useCitation[1]}</a></b>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutData;
