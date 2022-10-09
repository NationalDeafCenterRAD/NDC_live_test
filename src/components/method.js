import React from "react";
import year from './assets/acs_year.json'
import './dashboard.css'

import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";


const Method = () => {
    return(
    <>
    <div className = 'body'>
      <div className = 'text_contain'>
        <div className = 'title-method'>
            Analytical Method
        </div>
        <div className = 'paragraph-method'>
          The data for this project were taken from the
          Public Use Microdata Sample (PUMS) of the {year} American 
          Community Survey (ACS), conducted
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
          information can be found at <a href='http://www.census.gov/programs-surveys/acs/about.html'>American Community Surveys</a>.
        </div>
        <div className = 'paragraph-method'>
          The sample of interest in these analyses was
          non-institutionalized people between the ages of
          25 and 64. Recall that the U.S. Census collects
          data on functional limitations and not disability
          or identity labels. The disability categories used
          in the ACS ask respondents to report if they have
          any serious difficulty in the following areas:</div> 
        
        <ul>
          <li className = 'listitem1'><span>
            Hearing
          </span></li>
          <li className = 'listitem1'><span>
            Vision
          </span></li>
          <li className = 'listitem1'><span>
            Cognitive ability
          </span></li>
          <li className = 'listitem1'><span>
            Ambulatory ability
          </span></li>
          <li className = 'listitem1'><span>
            Self-care ability
          </span></li>
          <li className = 'listitem1'><span>
            Independent living ability
          </span></li>
        </ul>        
        <div className = 'paragraph-method'>
        Survey respondents who stated that they had 
        “hearing difficulties” were
        used to represent the deaf population in these
        analyses. More than XX,XXX deaf people were
        in the final sample. The comparison group was
        those who did not report having any “hearing
        difficulties,” what we label as hearing people. For
        the most part, the data for the group of hearing
        people are largely comparable to data for the
        general population. But for comparison purposes,
        this analysis focuses on people in the general
        population that did not report any type of “hearing
        difficulties,” which allows for an understanding of
        what employment experiences may be unique to
        the deaf population, and what may not be.
        </div>

        <div className = 'paragraph-method'>
        The descriptive statistics in this report are all corrected 
        by the person-level survey weights provided by the census. 
        When numbers are compared to each other in this report, 
        we used a t-test, with standard errors calculated using 
        provided survey replicate weights, to determine if 
        difference in the numbers were due to statistical noise. These
        statistical tests are purely descriptive in nature,
        and we do not intend to suggest that any of the
        associations described are causal in nature. As
        such, we did not correct for any other variables in
        providing these descriptive statistics.
        </div>

        <div className = 'paragraph-method'>
        The R syntax for all the statistical estimates in the
        paper can be accessed at url.
        </div>
      </div>
    </div>
    </>
    );
}

export default Method