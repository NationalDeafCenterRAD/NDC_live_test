//Import React, CSS, logo, and global level citation
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import './dashboard.css';
import thelogo from './logo_export.js'
import citation from './citation.js'

//Data
import acs_one_year from './assets/acs_year.json';
import acs_five_year from './assets/acs_5_year.json';
import employment from './assets/employment.json';
import timeseries from './assets/timeseries.json';

//Widgets
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select, { components } from 'react-select';
import Table from './table.js';

/*Icons and fonts*/
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';
import warning_sign from './images/warning_sign.svg';

//Charts
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offlineExporting from 'highcharts/modules/offline-exporting';
import HC_accessible from "highcharts/modules/accessibility";
import HCMore from 'highcharts/highcharts-more';

// Persistent shareable link
import { useSearchParams } from 'react-router-dom';

// Extensive Version of Highcharts
HC_exporting(Highcharts);          //exporting function
HC_offlineExporting(Highcharts);   // Offline on Highcharts
HC_accessible(Highcharts);         //accessible function 
HCMore(Highcharts);                //Add more chart options

const exportURL = /*process.env.REACT_APP_BACKEND_URL*/ 'https://export.highcharts.com/';
const fallbackToExportServer = true;

// Filter BIPOC out as NDC requests
employment = employment.filter(employment => employment.attribution !== 'deaf BIPOC' && employment.attribution !== 'hearing BIPOC');

// National Option List
let national_options = [
  {label: 'Education', value: 'Education',isTitle: true,
   variable: 'education', title: "Bachelor's Degree Attainment or Higher", title_by:'', disabled: false, second_disabled: false, display: 'unset', 
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education',
   chartype: 'column', metrics: 'percentage', categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Education Attainment', value: 'Education Attainment', variable: 'education', title: "Bachelor's Degree Attainment or Higher", title_by:'', disabled: false, second_disabled: false, display: 'unset', 
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education',
   chartype: 'column', metrics: 'percentage', categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Enrollment Rate', value: 'Enrollment Rate', variable: 'enrollment', title: 'Enrollment Rate', title_by:'', disabled: false, second_disabled: false, display: 'None',
    set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'Enrolled',type: 'enrollment',age: '16-64', description: ' are enrolled in postsecondary education and training', description1: '', sentence: '', group: 'enrollment',
    chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Most Popular Majors', value: 'Most Popular Majors',variable: 'mostpopular', title: 'College Graduate Rates Across 5 Most Popular Majors', title_by:'', disabled: true, second_disabled: true, display: 'unset',
    set_for_chart: [{label: "Bachelor’s Degrees", value: "Bachelor’s Degrees"}], subvariable: 'Graduate', type: 'Field of Degree', age: '25-64', description: '', description1: '', sentence: '', group: 'popular',
    chartype: 'popular',metrics: 'percentage',categories: '', accordion: 'accordion-is', scope: ''
  },
  {label: 'Employment', value: 'Employment',isTitle: true,
   variable: 'employment', title: 'Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Employed", value: "Employed"}], subvariable: 'employed',type: 'employment',age: '16-64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Employment Status', value: 'Employment Status', variable: 'employment', title: 'Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Employed", value: "Employed"}], subvariable: 'employed',type: 'employment',age: '16-64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Class of Worker', value: 'Class of Worker', variable: 'cow', title: "Percentage of Federal Gov't Employees", title_by:'', disabled: false, second_disabled: false, display: 'unset',
    set_for_chart: [{label: "Federal gov't", value: "Federal gov't"}], subvariable: "Federal gov't",type: 'cow',age: '16-64', description: '  are federal government employees',description1: '  are federal government employees', sentence: '', group: 'cow',
    chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Type of Employment', value: 'Type of Employment', variable: 'self-employment', title: 'Self-Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: 'Self-Employed', value: 'Self-Employed Rate'}], subvariable: 'self-employed', type: 'self-employment', age: '16-64', description: ' are self-employed, which is defined as not working for a specific employer who pays them a consistent salary or wage', description1: '', sentence: '', group: 'self-employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ' and who are employed'
  },
  {label: 'Income', value: 'Income',isTitle: true,
   variable: 'earning', title: 'Median Earning', title_by:'', disabled: false, second_disabled: false, display: 'None',
   set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'earning', type: 'salary-range',age: '16-64', description: ' who have full-time job earn', description1: '', sentence: '', group: 'salary-range',
   chartype: 'column',metrics: 'median_income',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Median Earning', value: 'Median Earning', variable: 'earning', title: 'Median Earning', title_by:'', disabled: false, second_disabled: false, display: 'None',
  set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'earning', type: 'salary-range',age: '16-64', description: ' who have full-time job earn', description1: '', sentence: '', group: 'salary-range',
   chartype: 'column',metrics: 'median_income',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Mean Earning', value: 'Mean Earning', variable: 'earning', title: 'Mean Earning', title_by:'', disabled: false, second_disabled: false, display: 'None',
   set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'earning', type: 'mean-salary-range',age: '16-64', description: ' who have full-time job earn', description1: '', sentence: '', group: 'mean-salary-range',
   chartype: 'column',metrics: 'median_income',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Trends', value: 'Trends',isTitle: true,
   variable: 'TimeSeries', title: "Bachelor's Degree Attainment or Higher",title_by: ' By Year '+[acs_one_year-13]+'-'+acs_one_year, disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education', age: '25-64', description: " have completed a bachelor's degree or higher", description1: '', sentence: "bachelor's degree attainment rate", group: 'TimeSeries',
   chartype: 'spline', metrics: 'percentage', categories: '', accordion: 'accordion-is-open', scope: ''
  },
  {label: 'Change Over Time', value: 'Change Over Time', variable: 'TimeSeries', title: "Bachelor's Degree Attainment or Higher",title_by: ' By Year '+[acs_one_year-13]+'-'+acs_one_year, disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education', age: '25-64', description: " have completed a bachelor's degree or higher", description1: '', sentence: "bachelor's degree attainment rate", group: 'TimeSeries',
   chartype: 'spline', metrics: 'percentage', categories: '', accordion: 'accordion-is-open', scope: ''
  },
  {label: 'Employment/Earnings by Education', value: 'Employment/Earnings by Education', variable: 'levels of education', title: 'Employment Rate',title_by: ' By Level of Education', disabled: true, second_disabled: true, display: 'unset',
   set_for_chart: [{label: "Employment Rates", value: "Employment Rates"}], subvariable: "employed", type: 'levels of education', age: '25-64', description: 'employment rate', description1: '', sentence: '', group: 'levels of education',
   chartype: 'levels', metrics: 'percentage', categories: '', accordion: 'accordion-is', scope: ''
  }
]
let variables = [
  {label: 'Overall', value: 'Overall', variable: 'overall', variables: [''],
   deaf: ['deaf people'], hearing: ['hearing people'], more_options: ' ', title_by: '', age: '16-64'
  },
  {label: 'Age', value: 'Age', variable: 'age', variables: ['16-24','25-34','35-44','45-54','55-64'],
   deaf: ['deaf people in 16-24 age','deaf people in 25-34 age group','deaf people in 35-44 age group','deaf people in 45-54 age group','deaf people in 55-64 age group'], 
   hearing: ['hearing people in 16-24 age people','hearing people in 25-34 age group','hearing people in 35-44 age group','hearing people in 45-54 age group','hearing people in 55-64 age people'],
   more_options: ' Age ', title_by: ' by Age', age: '16-64'
  },
  {label: 'Race', value: 'Race', variable: 'race', variables: ['Asian','Black','Latine','Native American','multiracial','white'/*,'BIPOC'*/],
   deaf: ['Asian deaf people','Black deaf people','Latine deaf people','Native American deaf people','multiracial deaf people','white deaf people'/*,'deaf BIPOC'*/],
   hearing: ['Asian hearing people','Black hearing people','Latine hearing people','Native American hearing people','multiracial hearing','white hearing people'/*,'hearing BIPOC'*/],
   more_options: ' Race ', title_by: ' by Race', age: '16-64'
  },
  {label: 'Gender', value: 'Gender', variable: 'gender', variables: ['women','men'],
   deaf: ['deaf women','deaf men'], hearing: ['hearing women','hearing men'],
   more_options: ' Gender ', title_by: ' by Gender', age: '16-64'
  },
  {label: 'Disability', value: 'Disability', variable: 'disability', variables: ['blind','disabled','no additional disabilities','with additional disabilities'],
   deaf: ['deafblind people','deafdisabled people','deaf people with no additional disabilities','deaf with additional disabilities'], 
   hearing: ['hearing blind people','hearing disabled people', 'hearing people with no additional disabilities','hearing with additional disabilities'],
   more_options: ' Disability ', title_by: ' by Disability', age: '16-64'
  },
  {label: 'Overall', value: 'Overall', variable: 'overall', variables: [''],
  deaf: ['deaf people'], hearing: ['hearing people'], more_options: ' ', title_by: '', age: '25-64'
 },
 {label: 'Age', value: 'Age', variable: 'age', variables: ['25-34','35-44','45-54','55-64'],
  deaf: ['deaf people in 25-34 age group','deaf people in 35-44 age group','deaf people in 45-54 age group','deaf people in 55-64 age group'], 
  hearing: ['hearing people in 25-34 age group','hearing people in 35-44 age group','hearing people in 45-54 age group','hearing people in 55-64 age people'],
  more_options: ' Age ', title_by: ' by Age', age: '25-64'
 },
 {label: 'Race', value: 'Race', variable: 'race', variables: ['Asian','Black','Latine','Native American','multiracial','white'/*,'BIPOC'*/],
  deaf: ['Asian deaf people','Black deaf people','Latine deaf people','Native American deaf people','multiracial deaf people','white deaf people'/*,'deaf BIPOC'*/],
  hearing: ['Asian hearing people','Black hearing people','Latine hearing people','Native American hearing people','multiracial hearing','white hearing people'/*,'hearing BIPOC'*/],
  more_options: ' Race ', title_by: ' by Race', age: '25-64'
 },
 {label: 'Gender', value: 'Gender', variable: 'gender', variables: ['women','men'],
  deaf: ['deaf women','deaf men'], hearing: ['hearing women','hearing men'],
  more_options: ' Gender ', title_by: ' by Gender', age: '25-64'
 },
 {label: 'Disability', value: 'Disability', variable: 'disability', variables: ['blind','disabled','no additional disabilities','additional disabilities'],
  deaf: ['deafblind people','deafdisabled people','deaf people with no additional disabilities','deaf people with additional disabilities'], 
  hearing: ['hearing blind people','hearing disabled people', 'hearing people with no additional disabilities','hearing people with additional disabilities'],
  more_options: ' Disability ', title_by: ' by Disability', age: '25-64'
 }
]
let inside_chart_options = [
  {label: 'All Levels', value: 'All Levels', title: "Education Attainment - High School, Some College, AA, BA, MA, PHD", variable: 'all', type: 'education',age: '25-64', description: '', description1: '', sentence: '', group: 'education', metrics: 'percentage', chartype: 'all', disabled: true, second_disabled: true},
  {label: 'High School', value: 'High School', title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25-64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college',type: 'education',age: '25-64',description: ' have completed some college', description1: ' have completed some college', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false,second_disabled: false},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate',type: 'education',age: '25-64', description: " have completed an associate's degree or higher", description1: " have completed an associate's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master',type: 'education',age: '25-64', description: " have completed a master's degree or higher", description1: " have completed a master's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr',type: 'education',age: '25-64', description: ' have completed doctoral degree or equivalent',description1: ' have completed doctoral degree or equivalent', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  
  {label: "Employed", value: "Employed", title: "Employment Rate", variable: 'employed',type: 'employment',age: '16-64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Unemployed", value: "Unemployed", title: "Unemployment Rate", variable: 'unemployed',type: 'employment',age: '16-64', description: ' are unemployed, which is defined as being currently or recently looking for work', description1: ' are unemployed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Not in Labor Force", value: "Not in Labor Force", title: "People not in Labor Force", variable: 'notinLF',type: 'employment',age: '16-64', description: ' are not in the labor force, which is defined as not currently employed and not looking for work', description1: ' are not in the labor force', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},

  {label: 'All Classes', value: 'All Classes', title: "Percentage of Worker Classes", variable: 'every_class', type: 'cow',age: '25-64', description: '', description1: '', sentence: '', group: 'cow', metrics: 'percentage', chartype: 'every_class', disabled: true, second_disabled: true},
  {label: "For-Profit", value: "For-Profit", title: "Percentage of For-Profit Employees", variable: 'For-profit',type: 'cow',age: '16-64', description: '  are for-profit employees',description1: '  are for-profit employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Non-Profit", value: "Non-Profit", title: "Percentage of Non-Profit Employees", variable: 'Non-profit',type: 'cow',age: '16-64', description: '  are non-profit employees',description1: '  are non-profit employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Local Gov't", value: "Local Gov't", title: "Percentage of Local Gov't Employees", variable: "Local gov't",type: 'cow',age: '16-64', description: '  are local government employees',description1: '  are local government employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "State Gov't", value: "State Gov't", title: "Percentage of State Gov't Employees", variable: "State gov't",type: 'cow',age: '16-64', description: '  are state government employees',description1: '  are state government employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Federal Gov't", value: "Federal Gov't", title: "Percentage of Federal Gov't Employees", variable: "Federal gov't",type: 'cow',age: '16-64', description: '  are federal government employees',description1: '  are federal government employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Self-Employed/Business", value: "Self-Employed/Business", title: "Percentage of Self-Employed/Business Employees", variable: "Self-employed/Business",type: 'cow',age: '16-64', description: '  are self-employed or business owners',description1: '  are self-employed or business owners', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},

  {label: "Bachelor’s Degrees", value: "Bachelor’s Degrees", title: "College Graduate Rate Across 5 Most Popular Majors", variable: 'Graduate',type: 'Field of Degree',age: '25-64', description: ' have completed a bachelor’s degree or higher', description1: ' who have completed a bachelor’s degree or higher', sentence: '', group: 'mostpopular', metrics: 'percentage',chartype: 'popular',disabled: true, second_disabled: true},
  {label: "Degrees x Employment Rate", value: "Degrees x Employment Rate", title: "Employment Rate By 5 Most Popular Majors", variable: 'Employment',type: 'Field of Degree',age: '25-64', description: ' have completed a bachelor’s degree or higher', description1: ' who have completed a bachelor’s degree or higher', sentence: '', group: 'mostpopular', metrics: 'percentage', chartype: 'popular',disabled: true, second_disabled: true},
  
  {label: "Self-Employed", value: "Self-Employed", title: "Self-Employment Rate", variable: "self-employed", type: "self-employment", age: "16-64", description: ' are self-employed, which is defined as not working for a specific employer who pays them a consistent salary or wage', description1: '', sentence: '', group: 'self-employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Business Owners", value: "Business Owners", title: "Percentage of Business Owners", variable: "business owner", type: "self-employment", age: "16-64", description: ' are business owners', description1: '', sentence: '', group: 'self-employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Full-Time Workers", value: "Full-Time Workers", title: "Percentage of Full-Time Workers", variable: "full-time", type: "self-employment", age: "16-64", description: ' are full-time workers', description1: '', sentence: '', group: 'self-employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  
  {label: 'Enrollment', value: 'Enrollment',isTitle: true,title: "Enrollment Rate", variable: 'Enrolled',type: 'enrollment',age: '16-64', description: ' are enrolled in postsecondary education and training,', description1: ' are enrolled', sentence: 'the enrollment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Enrolled", value: "Enrolled", title: "Enrollment Rate", variable: 'Enrolled',type: 'enrollment',age: '16-64', description: ' are enrolled in postsecondary education and training,', description1: ' are enrolled', sentence: 'the enrollment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'Education', value: 'Education',isTitle: true, title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25-64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: "the high school's attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'High School', value: 'High School', title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25-64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: "the high school's attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college',type: 'education',age: '25-64',description: ' have completed some college', description1: ' have completed some college', sentence: 'some college attainment rate', group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate',type: 'education',age: '25-64', description: " have completed an associate's degree or higher", description1: " have completed an associate's degree or higher", sentence: "the associate's degree attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: "the bachelor's degree attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master',type: 'education',age: '25-64', description: " have completed a master's degree or higher", description1: " have completed a master's degree or higher", sentence: "the master's degree attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr',type: 'education',age: '25-64', description: ' have completed doctoral degree or equivalent',description1: ' have completed doctoral degree or equivalent', sentence: 'the doctoral attainment rate', group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'Employment', value: 'Employment',isTitle: true, title: "Employment Rate", variable: 'employed',type: 'employment',age: '16-64', description: '  are employed',description1: '  are employed', sentence: 'the employment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Employed", value: "Employed", title: "Employment Rate", variable: 'employed',type: 'employment',age: '16-64', description: '  are employed',description1: '  are employed', sentence: 'the employment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Unemployed", value: "Unemployed", title: "Unemployment Rate", variable: 'unemployed',type: 'employment',age: '16-64', description: ' are unemployed, which is defined as being currently or recently looking for work,', description1: ' are unemployed', sentence: 'the unemployment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Not in Labor Force", value: "Not in Labor Force", title: "People not in Labor Force", variable: 'notinLF',type: 'employment',age: '16-64', description: ' are not in the labor force, which is defined as not currently employed and not looking for work,', description1: ' are not in the labor force', sentence: 'the non-labor force participation rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},

  {label: "Employment Rates", value: "Employment Rates", title: "Employment Rate", variable: 'employed',type: 'levels of education',age: '25-64', description: 'employment rate',description1: '  are employed', sentence: '', group: 'levels of education', metrics: 'percentage', chartype: 'levels',disabled: true, second_disabled: true},
  {label: "Median Earnings", value: "Median Earnings", title: "Median Earnings", variable: 'earning',type: 'levels of education',age: '25-64', description: 'median earning',description1: '', sentence: '', group: 'levels of education', metrics: 'median_income', chartype: 'levels',disabled: true, second_disabled: true},
  {label: "Mean Earnings", value: "Mean Earnings", title: "Mean Earnings", variable: 'mean-earning',type: 'levels of education',age: '25-64', description: 'mean earning',description1: '', sentence: '', group: 'levels of education', metrics: 'median_income', chartype: 'levels',disabled: true, second_disabled: true},
  {label: "Nothing", value: "Nothing"},
]

let attributions = [
  {label: 'deaf', value: 'deaf', variable: 'overall', color: 'teal', words: 'deaf people'},
  {label: 'hearing', value: 'hearing', variable: 'overall', color: 'black', words: 'hearing people'},
  {label: 'deaf: ages 55-64', value: 'deaf: ages 55-64', variable: 'age', color: 'teal', words: 'deaf people in 55-64 age group'},
  {label: 'deaf: ages 45-54', value: 'deaf: ages 45-54', variable: 'age', color: 'teal', words: 'deaf people in 45-54 age group'},
  {label: 'deaf: ages 35-44', value: 'deaf: ages 35-44', variable: 'age', color: 'teal', words: 'deaf people in 35-44 age group'},
  {label: 'deaf: ages 25-34', value: 'deaf: ages 25-34', variable: 'age', color: 'teal', words: 'deaf people in 25-34 age group'},
  {label: 'deaf: ages 16-24', value: 'deaf: ages 16-24', variable: 'age', color: 'teal', words: 'deaf people in 16-24 age group'},
  {label: 'hearing: ages 55-64', value: 'hearing: ages 55-64', variable: 'age', color: 'black', words: 'hearing people in 55-64 age group'},
  {label: 'hearing: ages 45-54', value: 'hearing: ages 45-54', variable: 'age', color: 'black', words: 'hearing people in 45-54 age group'},
  {label: 'hearing: ages 35-44', value: 'hearing: ages 35-44', variable: 'age', color: 'black', words: 'hearing people in 35-44 age group'},
  {label: 'hearing: ages 25-34', value: 'hearing: ages 25-34', variable: 'age', color: 'black', words: 'hearing people in 25-34 age group'},
  {label: 'hearing: ages 16-24', value: 'hearing: ages 16-24', variable: 'age', color: 'black', words: 'hearing people in 16-24 age group'},
  {label: 'deaf women', value: 'deaf women', variable: 'gender', color: 'teal', words: 'deaf women'},
  {label: 'deaf men', value: 'deaf men', variable: 'gender', color: 'teal', words: 'deaf men'},
  {label: 'hearing women', value: 'hearing women', variable: 'gender', color: 'black', words: 'hearing women'},
  {label: 'hearing men', value: 'hearing men', variable: 'gender', color: 'black', words: 'hearing men'},
  {label: 'Asian deaf', value: 'Asian deaf', variable: 'race', color: 'teal', words: 'Asian deaf people'},
  {label: 'Black deaf', value: 'Black deaf', variable: 'race', color: 'teal', words: 'Black deaf people'},
  {label: 'Latine deaf', value: 'Latine deaf', variable: 'race', color: 'teal', words: 'Latine deaf people'},
  {label: 'Native American deaf', value: 'Native American deaf', variable: 'race', color: 'teal', words: 'Native American deaf people'},
  {label: 'multiracial deaf', value: 'multiracial deaf', variable: 'race', color: 'teal', words: 'multiracial deaf people'},
  {label: 'white deaf', value: 'white deaf', variable: 'race', color: 'teal', words: 'white deaf people'},
  //{label: 'deaf BIPOC', value: 'deaf BIPOC', variable: 'race', color: 'teal', words: 'deaf BIPOC'},
  {label: 'Asian hearing', value: 'Asian hearing', variable: 'race', color: 'black', words: 'Asian hearing people'},
  {label: 'Black hearing', value: 'Black hearing', variable: 'race', color: 'black', words: 'Black hearing people'},
  {label: 'Latine hearing', value: 'Latine hearing', variable: 'race', color: 'black', words: 'Latine hearing'},
  {label: 'Native American hearing', value: 'Native American hearing', variable: 'race', color: 'black', words: 'Native American hearing people'},
  {label: 'multiracial hearing', value: 'multiracial hearing', variable: 'race', color: 'black', words: 'multiracial hearing people'},
  {label: 'white hearing', value: 'white hearing', variable: 'race', color: 'black', words: 'white hearing people'},
  //{label: 'hearing BIPOC', value: 'hearing BIPOC', variable: 'race', color: 'black', words: 'hearing BIPOC'},
  {label: 'deafblind', value: 'deafblind', variable: 'disability', color: 'teal', words: 'deafblind people'},
  {label: 'deafdisabled', value: 'deafdisabled', variable: 'disability', color: 'teal', words: 'deafdisabled people'},
  {label: 'deaf with no additional disabilities', value: 'deaf with no additional disabilities', variable: 'disability', color: 'teal', words: 'deaf people with no additional disabilities'},  
  {label: 'deaf with additional disabilities', value: 'deaf with additional disabilities', variable: 'disability', color: 'teal', words: 'deaf people with additional disabilities'},  
  {label: 'hearing blind', value: 'hearing blind', variable: 'disability', color: 'black', words: 'hearing blind people'},
  {label: 'hearing disabled', value: 'hearing disabled', variable: 'disability', color: 'black', words: 'hearing disabled people'},
  {label: 'hearing with no additional disabilities', value: 'hearing with no additional disabilities', variable: 'disability', color: 'black', words: 'hearing people with no additional disabilities'},
  {label: 'hearing with additional disabilities', value: 'hearing with additional disabilities', variable: 'disability', color: 'black', words: 'hearing people with additional disabilities'}
]

// State Option List
let state_options = [
  {label: 'Education Attainment', value: 'Education Attainment', variable: 'education', title: "Bachelor's Degree Attainment or Higher", title_by:'', disabled: false, second_disabled: false, display: 'unset', 
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education',
   chartype: 'column', metrics: 'percentage', categories: '', accordion: 'nothing'
  },
  {label: 'Employment Status', value: 'Employment Status', variable: 'employment', title: 'Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Employed", value: "Employed"}], subvariable: 'employed',type: 'employment',age: '16-64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing'
  }
]

let state_inside_chart_options = [
  {label: 'All Levels', value: 'All Levels', title: "Education Attainment - High School, Some College, AA, BA, MA, PHD", variable: 'all', type: 'education',age: '25-64', description: '', description1: '', sentence: '', group: 'education', metrics: 'percentage', chartype: 'all', disabled: true, second_disabled: true},
  {label: 'High School', value: 'High School', title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25-64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college',type: 'education',age: '25-64',description: ' have completed some college', description1: ' have completed some college', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false,second_disabled: false},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate',type: 'education',age: '25-64', description: " have completed an associate's degree or higher", description1: " have completed an associate's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor',type: 'education',age: '25-64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master',type: 'education',age: '25-64', description: " have completed a master's degree or higher", description1: " have completed a master's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr',type: 'education',age: '25-64', description: ' have completed doctoral degree or equivalent',description1: ' have completed doctoral degree or equivalent', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  
  {label: "Employed", value: "Employed", title: "Employment Rate", variable: 'employed',type: 'employment',age: '16-64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Unemployed", value: "Unemployed", title: "Unemployment Rate", variable: 'unemployed',type: 'employment',age: '16-64', description: ' are unemployed, which is defined as being currently or recently looking for work', description1: ' are unemployed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Not in Labor Force", value: "Not in Labor Force", title: "People not in Labor Force", variable: 'notinLF',type: 'employment',age: '16-64', description: ' are not in the labor force, which is defined as not currently employed and not looking for work', description1: ' are not in the labor force', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
]

let geographics = [
  {label: 'United States', value: 'United States', variable: 'US'},
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

// Categories
let edulist = ["doctoral degree or equivalent","master’s degree or higher","bachelor’s degree or higher",
               "an associate’s degree or higher",'some college or higher','high school or higher']

//Stylize selections in More Option Selection
const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
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
      </components.Option>
    </div>
  );
};

const Dashboard = ({colors, justcolor, colorfill, navmenu}) => {
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
  // Dollar format function
  function formatDollar(num) {
    var p = num.toFixed(2).split(".");
    return ["$", p[0].split("").reverse().reduce(function(acc, num, i) {
        return num + (i && !(i % 3) ? "," : "") + acc;
    }, "."), p[1]].join("");
  }
  // This function is to set up the Y-Axis limit range in HighChart's Trend and Education line plots
  const spm = (x) => {
    const result = Math.min(...x)-1
    if(result < 0){
      return(0)
    }else{
      return(result)
    }
  }

  // This function is to make sure that percentage format looks good after subtraction
  const percentage_difference = (x1,x2) => {
    return(Math.abs(round((x2 - x1)))+'%')
  }
  // This function is to sort array of Fields of Degrees nothing more.
  const sortarray = employment.filter(employment => employment.type === 'Field of Degree' & // Sorting by another array
   employment.variable ===  'Graduate' &
   employment.state === 'United States' &
   employment?.attribution?.includes('deaf')).map(
   employment => employment.status)

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
  const whenNull = (e,s) => {
    if(!e){
      return(s)
    }else{
      return(e)
    }
  }

  const strAccordion = whenNull(searchParams.get('groups'),'closed,deaf,hearing');
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

  // Data: Trend over Time - Set limit x-axis range
  const min_year = Math.min(...timeseries.filter(timeseries => timeseries.type === 'education' &
    timeseries.status === 'bachelor' & timeseries.attribution === 'deaf').map(
    timeseries => timeseries['year']))
  const max_year = Math.max(...timeseries.filter(timeseries => timeseries.type === 'education' &
    timeseries.status === 'bachelor' & timeseries.attribution === 'deaf').map(
    timeseries => timeseries['year']))

  // Chart Option Change Function - first selection options
  const maintitle = whenNull(searchParams.get('main'),'Education Attainment');
  const statusCateg = whenNull(searchParams.get('status'),national_options.filter(e => e.value === maintitle).map(e => e.set_for_chart)[0].map(e => e.value)[0]);
  const selected_attributions = whenNull(searchParams.get('attr'),'overall');
  const chartType = whenNull(searchParams.get('chart_type'),'column');

  const [nationSelectDisplay, setNationSelectDisplay] = useState(national_options.filter(e => e.value === maintitle).map(e => e.display)[0]);
  const [title_by, setTitleBy] = useState(national_options.filter(e => e.value === maintitle).map(e => e.title_by)[0]);
  const [nationalSchema, setNationalSchema] = useState(national_options.filter(e => e.value === maintitle));
  const [groupInsideChart, setGroupInsideChart] = useState(national_options.filter(e => e.value === maintitle).map(e => e.variable)[0]);
  const [scope, setScope] = useState(national_options.filter(e => e.value === maintitle).map(e => e.scope)[0])

  const [metrics, setMetrics] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.metrics)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.metrics)[0]));
  const [nationalTitle, setNationalTitle] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.title)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.title)[0]));
  const [nationDescript, setNationDescript] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.description)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.description)[0]));
  const [nationDisabled,setNationDisabled] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.disabled)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.disabled)[0]));
  const [second_nationDisabled,setSecondDisabled] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.second_disabled)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.second_disabled)[0]));
  const [insidechartType, setInsideChartType] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.type)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.type)[0]));
  const [insidechartStatus, setInsideChartStatus] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.variable)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.subvariable)[0]));
  const [sentence, setSentence] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.sentence)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.sentence)[0]));
  const [limit_age, setAge] = useState(whenNull(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.age)[0],
    national_options.filter(e => e.value === maintitle).map(e => e.age)[0]));
  const [inside_chart_schema, setInsideChartSchema] = useState(inside_chart_options.filter(e => e.value === statusCateg));
  const [title_color,setTitleColor] = useState(inside_chart_options.filter(e => e.value === statusCateg).map(e => e.second_disabled)[0] === true ? '#bfbfbf' : '#0d7777');

  const [categories, setCategories] = useState(variables.filter(e => e.variable === selected_attributions).map(e => e.variables)[0]);
  const [deaf_labels, setDeafLabels] = useState(variables.filter(e => e.variable === selected_attributions).map(e => e.deaf)[0]);
  const [hear_labels, setHearLabels] = useState(variables.filter(e => e.variable === selected_attributions).map(e => e.hearing)[0]);
  const [secondSchema, setSecondSchema] = useState(variables.filter(e => e.variable === selected_attributions))
  const [more_options, setMoreOptions] = useState(variables.filter(e => e.variable === selected_attributions).map(e => e.more_options)[0])

  const [dgraduate, setDGrad] = useState(
    employment.filter(employment => employment.type === 'Field of Degree' &
    employment.variable ===  'Graduate' &
    employment.state === 'United States' &
    employment?.attribution?.includes('deaf')).map(
    employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
    return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
    }).slice(0,5).reverse())
  
  const [hgraduate, setHGrad] = useState(
    employment.filter(employment => employment.type === 'Field of Degree' &
    employment.variable ===  'Graduate' &
    employment.state === 'United States' &
    employment?.attribution?.includes('hearing')).map(
    employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
    return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
    }).slice(0,5).reverse())

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
    if(e.variable === 'mostpopular'){
      setDGrad(
        employment.filter(employment => employment.type === 'Field of Degree' &
        employment.variable ===  'Graduate' &
        employment.state === 'United States' &
        employment?.attribution?.includes('deaf')).map(
        employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
        return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
        }).slice(0,5).reverse()
      )

      setHGrad(
        employment.filter(employment => employment.type === 'Field of Degree' &
        employment.variable ===  'Graduate' &
        employment.state === 'United States' &
        employment?.attribution?.includes('hearing')).map(
        employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
        return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
        }).slice(0,5).reverse()
      )
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
    
    if(e.type === 'Field of Degree'){
      if(e.variable === 'Graduate'){
        setDGrad(
          employment.filter(employment => employment.type === 'Field of Degree' &
          employment.variable ===  'Graduate' &
          employment.state === 'United States' &
          employment?.attribution?.includes('deaf')).map(
          employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
          return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
          }).slice(0,5).reverse()
        )
        setHGrad(
          employment.filter(employment => employment.type === 'Field of Degree' &
          employment.variable ===  'Graduate' &
          employment.state === 'United States' &
          employment?.attribution?.includes('hearing')).map(
          employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
          return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
          }).slice(0,5).reverse()
        )
      }else{
        setDGrad(
          employment.filter(employment => employment.type === 'Field of Degree' &
          employment.variable ===  'Employment' &
          employment.state === 'United States' &
          employment?.attribution?.includes('deaf')).map(
          employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
          return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
          }).slice(0,5).reverse()
        )
        setHGrad(
          employment.filter(employment => employment.type === 'Field of Degree' &
          employment.variable ===  'Employment' &
          employment.state === 'United States' &
          employment?.attribution?.includes('hearing')).map(
          employment => [employment.status,employment.percentage,employment.margin_errors]).sort(function(a,b){
          return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
          }).slice(0,5).reverse()
        )
      }
    }
  }

  // Change geographic locations - first selection options on top of Highcharts plots in "State" tab
  const states_choice = whenNull(searchParams.get('states'),'US,Texas').split(',');
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

  // Text effect of time series
  const [crease, setCrease] = useState('increased more')
  const [crease_word,setCreaseWord] = useState('increased')
  const [second_crease_word,setSecondCreaseWord] = useState('increased')

  useEffect(()=>{
    let deaf_minyear = timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & 
      timeseries.attribution === attribute[0] & 
      timeseries.year === min_year).map(
      timeseries => timeseries['percentage'])[0]
    
    let deaf_maxyear = timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & 
      timeseries.attribution === attribute[0] & 
      timeseries.year === max_year).map(
      timeseries => timeseries['percentage'])[0]
    
    let hear_minyear = timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & 
      timeseries.attribution === attribute[1] & 
      timeseries.year === min_year).map(
      timeseries => timeseries['percentage'])[0]
    
    let hear_maxyear = timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & 
      timeseries.attribution === attribute[1] & 
      timeseries.year === max_year).map(
      timeseries => timeseries['percentage'])[0]

    if((deaf_maxyear - deaf_minyear > 0) & (hear_maxyear - hear_minyear < 0)){
      setCrease('increased for '+words[0]+' while it has decreased for '+words[1])
      setCreaseWord('increased')
      setSecondCreaseWord('decreased')
    }else if((deaf_maxyear - deaf_minyear < 0) & (hear_maxyear - hear_minyear > 0)){
      setCrease('decreased for '+words[0]+' while it has increased for '+words[1])
      setCreaseWord('decreased')
      setSecondCreaseWord('increased')
    }else if((deaf_maxyear - deaf_minyear > hear_maxyear - hear_minyear) & (deaf_maxyear - deaf_minyear > 0) & (hear_maxyear - hear_minyear > 0)){
      setCrease('increased more for '+words[0]+' than '+words[1])
      setCreaseWord('increased')
      setSecondCreaseWord('increased')
    }else if((deaf_maxyear - deaf_minyear < hear_maxyear - hear_minyear) & (deaf_maxyear - deaf_minyear > 0) & (hear_maxyear - hear_minyear > 0)){
      setCrease('increased less for '+words[0]+' than '+words[1])
      setCreaseWord('increased')
      setSecondCreaseWord('increased')
    }else if((deaf_maxyear - deaf_minyear > hear_maxyear - hear_minyear) & (deaf_maxyear - deaf_minyear < 0) & (hear_maxyear - hear_minyear < 0)){
      setCrease('decreased less for '+words[0]+' than '+words[1])
      setCreaseWord('decreased')
      setSecondCreaseWord('decreased')
    }else if((deaf_maxyear - deaf_minyear < hear_maxyear - hear_minyear) & (deaf_maxyear - deaf_minyear < 0) & (hear_maxyear - hear_minyear < 0)){
      setCrease('decreased more for '+words[0]+' than '+words[1])
      setCreaseWord('decreased')
      setSecondCreaseWord('decreased')
    }else if((deaf_maxyear - deaf_minyear === hear_maxyear - hear_minyear) & (deaf_maxyear - deaf_minyear > 0) & (hear_maxyear - hear_minyear > 0)){
      setCrease('neither increased more nor less for '+words[0]+' than '+words[1])
      setCreaseWord('increased')
      setSecondCreaseWord('increased')
    }else if((deaf_maxyear - deaf_minyear === hear_maxyear - hear_minyear) & (deaf_maxyear - deaf_minyear < 0) & (hear_maxyear - hear_minyear < 0)){
      setCrease('neither decreased more nor less')
      setCreaseWord('decreased')
      setSecondCreaseWord('decreased')
    }else{
      setCrease('neither decreased nor increased')
      setCreaseWord('changed')
      setSecondCreaseWord('changed')
    }
  },[words,insidechartStatus, insidechartType, attribute, max_year, min_year])

  // Reset charts if switching to either nation level or state level
  useEffect(() => {
    if(reportTrigger === 1 | reportTrigger === 3){
      setYear((acs_five_year-4)+'-'+(acs_five_year))
    }else{
      setYear(acs_one_year)
    }
  },[reportTrigger]);

  // Warnings for nation level
  const [warning_sty,setWarningSty] = useState('not-warning')
  
  useEffect(()=>{
    if(
      (Math.max(...employment.filter(employment => employment.type === insidechartType & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === insidechartStatus).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
        )) > 0.3 & accordion_is === 'accordion-is' & chartType === 'column') |
      (Math.max(...employment.filter(employment => (employment.attribution === attribute[0] | 
        employment.attribution === attribute[1]) & 
        employment.status === insidechartStatus & 
        employment.type === insidechartType & 
        employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
        )) > 0.3 & accordion_is === 'accordion-is' & chartType === 'column')  |
      (Math.max(...employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
        employment.status === 'phd/dr' & employment.type === 'education' & 
        employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
        )) > 0.3 & chartType === 'all') |
      (Math.min(...employment.filter(employment => employment.type === insidechartType & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === insidechartStatus).map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(ME[1])}
        )) === 0 & accordion_is === 'accordion-is' & chartType === 'column') |
      (Math.min(...employment.filter(employment => (employment.attribution === attribute[0] | 
        employment.attribution === attribute[1]) & 
        employment.status === insidechartStatus & 
        employment.type === insidechartType & 
        employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(ME[1])}
        )) === 0 & accordion_is === 'accordion-is' & chartType === 'column')  |
      (Math.min(...employment.filter(employment => (employment.attribution === 'deaf' | employment.attribution === 'hearing') & 
        employment.status === 'phd/dr' & employment.type === 'education' & 
        employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
          function(ME){return(ME[1])}
        )) === 0 & chartType === 'all') |
      (Math.min(...employment.filter(employment => employment.type === insidechartType & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === insidechartStatus).map(employment => [employment.margin_errors,employment.median_income]).map(
          function(ME){return(ME[1])}
        )) === 0 & accordion_is === 'accordion-is' & chartType === 'column') |
      (Math.max(...employment.filter(employment => employment.type === insidechartType & 
        employment.variable === selected_attributions & employment.state === 'United States' &
        employment.status === insidechartStatus).map(employment => [employment.margin_errors,employment.median_income]).map(
          function(ME){return(((ME[0]/100)/1.962937)/(ME[1]/100))}
        )) > 0.3 & accordion_is === 'accordion-is' & chartType === 'column')
    ){
      setWarningSty('shown-warning')
    }else{
      setWarningSty('not-warning')
    }
  },[insidechartType,insidechartStatus,attribute, accordion_is, chartType, selected_attributions])

  // Warnings for state level
  const [state_warning_sty,setStateWarningSty] = useState('not-warning')
  
  useEffect(()=>{
    if(
      (Math.max(...employment.filter(employment => employment.type === insidechartType & 
        employment.variable === selected_attributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
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
        employment.variable === selected_attributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
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
  },[insidechartType,insidechartStatus,attribute, accordion_is, chartType, chosen_state_a, chosen_state_b, selected_attributions])

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
          employment.variable === selected_attributions & employment.state === chosen_state_b &
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
          ' '+employment.percentage+'% '+edulist[index]}).reverse())+citation[2]
      )
    }else if(reportTrigger === 1){
      wordCounter(
        {
          'accordion-is':
            {
              percentage: 
              employment.filter(employment => employment.type === insidechartType & 
                employment.variable === selected_attributions & employment.state === chosen_state_b &
                employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                employment.percentage !== 0).length === 0 ?
              in_the_b+state_label_b+", among people aged 16-64, the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript :
              in_the_b+state_label_b+', among people aged 16-64, an estimated'+
              employment.filter(employment => employment.type === insidechartType & 
                employment.variable === selected_attributions & employment.state === chosen_state_b &
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
                employment.variable === selected_attributions & employment.state === chosen_state_b &
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
        }[accordion_is]+' '+citation[2]
      )
    }else{
      wordCounter(
        {
        'accordion-is':
            {
              percentage: 
                'In the United States, among people aged 25-64'+scope+', an estimated'+
                employment.filter(employment => employment.type === insidechartType & 
                  employment.variable === selected_attributions & employment.state === 'United States' &
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
                  employment.variable === selected_attributions & employment.state === 'United States' &
                  employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                  employment.percentage !== 0).map(
                  function(employment, index){ return (index  !== 0 && hear_labels[deaf_labels.length - 1] === hear_labels[employment.index]) ? 
                  ' and '+
                  (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                  hear_labels[employment.index] : ' '+
                  (((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                  hear_labels[employment.index]}),
              median_income:
                'In the United States, among people aged 16-64,'+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.variable === selected_attributions &
                  employment?.attribution?.includes('deaf') &
                  employment.median_income !== 0).map(
                    function(employment,index){ return (index !== 0 && deaf_labels[deaf_labels.length - 1] === deaf_labels[employment.index]) ? 
                    ' and '+
                    deaf_labels[employment.index]+
                    ' $'+Math.round(employment.median_income/1000) + 'K': 
                    index === 0 ?
                    ' '+deaf_labels[employment.index] +' who are full-time workers earn $'+
                    +Math.round(employment.median_income/1000) + 'K':
                    ' '+deaf_labels[employment.index]+
                    ' $'+Math.round(employment.median_income/1000) + 'K'})+
                ', compared to '+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.variable === selected_attributions &
                  employment?.attribution?.includes('hearing') &
                  employment.median_income !== 0).map(
                    function(employment,index){ return (index !== 0 && hear_labels[hear_labels.length - 1] === hear_labels[employment.index]) ? 
                    ' and '+
                    hear_labels[employment.index]+
                    ' $'+Math.round(employment.median_income/1000) + 'K': 
                    index === 0 ?
                    ' '+hear_labels[employment.index] +' earn $'+
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
                'In the United States, among people aged 16-64,'+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[0]).map(
                    function(employment){return (
                    ' '+words[0]+' who are working full-time earn $'+
                    +Math.round(employment.median_income/1000) + 'K')})+
                ', compared to '+
                employment.filter(employment => employment.status === 'earning' &  
                  employment.type === insidechartType & 
                  employment.state === 'United States' &  
                  employment.attribution === attribute[1]).map(
                    function(employment){return (
                      ' '+words[1]+' earn $'+
                      +Math.round(employment.median_income/1000) + 'K')})
          }[metrics]
        }[accordion_is]+' '+citation[2]
      )
    }
  },[accordion_is,attribute,deaf_labels,hear_labels,
    insidechartStatus,insidechartType,metrics,nationDescript,
    scope,selected_attributions,words,reportTrigger,
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

  // Class of Work
  const statusOrder = ['For-profit', 'Non-profit', "Local gov't", "State gov't", "Federal gov't", "Self-employed/Business"];
  const cowLabels = ['self-employed or business owners', 'federal government employees', 'state government employees', 'local government employees', 'non-profit employees', 'for-profit employees']
  let nation_every_class = {
    chart:{
      width: HCwidth,
      height: 330
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: ['For-Profit','Non-Profit',"Local Gov't","State Gov't","Federal Gov't","Self-Employed"],
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
        employment.type === 'cow' & 
        employment.state === 'United States').sort(
          (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        ).map(employment => employment.percentage),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'deaf' & 
            employment.type === 'cow' & 
            employment.state === 'United States' &
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
        employment.type === 'cow' & 
        employment.state === 'United States').sort(
          (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        ).map(employment => employment.percentage),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'hearing' & 
            employment.type === 'cow' & 
            employment.state === 'United States' &
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
      allowHTML: true,
      url: exportURL,
      fallbackToExportServer: fallbackToExportServer,
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
          text: 'Class of Worker',
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
          text: nationalTitle+' in the United States ('+acs_one_year+')',
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
          text: 
            '<p>In the United States, among people aged '+limit_age+', an estimated'+
            employment.filter(employment => employment.attribution === 'deaf' & 
              employment.type === 'cow' & 
              employment.state === 'United States').sort(
                (a, b) => statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status)
              ).map(
              function(employment, index){ return index === 0 ? 
              ' and '+
              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
              cowLabels[index] : cowLabels[cowLabels.length - 1] === cowLabels[index] ? ' '+
              (employment.percentage === 0 ? 'N/A of deaf people are ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people are ' : employment.percentage + '% of deaf people are ')+
              cowLabels[index] :
              ' '+employment.percentage+'% '+cowLabels[index]}).reverse()+
            ', compared to '+
            employment.filter(employment => employment.attribution === 'hearing' & 
              employment.type === 'cow' & 
              employment.state === 'United States').sort(
                (a, b) => statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status)
              ).map(
              function(employment, index){ return index === 0 ? 
              ' and '+
              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
              cowLabels[index] : cowLabels[cowLabels.length - 1] === cowLabels[index] ? ' '+
              (employment.percentage === 0 ? 'N/A of hearing people are ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people are ' : employment.percentage + '% of hearing people are ')+
              cowLabels[index] :
              ' '+employment.percentage+'% '+cowLabels[index]}).reverse()+
              ' '+citation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
          backgroundColor: {
            linearGradient: [0, 0, 0, 600],
            stops:
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.71, 'rgb(255,255,255)'],
                [0.71, 'rgb(243, 243, 243)']
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
  
  // Rest of charts
  let nation = {
    chart:{
      width: HCwidth,
      height: 330
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
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === insidechartStatus).map(
            employment => employment[metrics])),
        'accordion-is-open':
          1+Math.max(...employment.filter(employment => employment.type === insidechartType & 
            employment.state === 'United States' &
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
      borderColor: colorfill[0],
      type: 'column',
      borderWidth: 1,
      data: {
        'accordion-is':
          employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === insidechartStatus & employment?.attribution?.includes('deaf')).map(
            employment => [employment.index,employment[metrics]]),
        'accordion-is-open':
            employment.filter(employment => employment.type === insidechartType & 
              employment.state === 'United States' &
              employment.status === insidechartStatus & employment.attribution === attribute[0]).map(
              employment => employment[metrics])
        }[accordion_is],
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selected_attributions & employment.state === 'United States' &
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
            employment.variable === selected_attributions & employment.state === 'United States' &
            employment.status === insidechartStatus & employment?.attribution?.includes('hearing')).map(
            employment => [employment.index,employment[metrics]]),
        'accordion-is-open':
          employment.filter(employment => employment.type === insidechartType & 
            employment.state === 'United States' &
            employment.status === insidechartStatus & employment.attribution === attribute[1]).map(
            employment => employment[metrics])
      }[accordion_is],
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selected_attributions & employment.state === 'United States' &
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
            'accordion-is': nationalTitle+title_by+' in the United States ('+acs_one_year+')',
            'accordion-is-open': nationalTitle+' in the United States ('+acs_one_year+')'
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
          text: '<p>'+
          {
            column:
            {
            'accordion-is':
              {
                percentage: 
                  'In the United States, among people aged '+limit_age+scope+', an estimated'+
                  employment.filter(employment => employment.type === insidechartType & 
                    employment.variable === selected_attributions & employment.state === 'United States' &
                    employment.status === insidechartStatus & employment?.attribution?.includes('deaf')  &
                    employment.percentage !== 0).map(
                    function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                    ' and '+
                    (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                    deaf_labels[employment.index] : ' '+ 
                    (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                    deaf_labels[employment.index]}).reverse()+
                  nationDescript+', compared to '+
                  employment.filter(employment => employment.type === insidechartType & 
                    employment.variable === selected_attributions & employment.state === 'United States' &
                    employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                    employment.percentage !== 0).map(
                    function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                    ' and '+
                    (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                    hear_labels[employment.index] : ' '+
                    (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                    hear_labels[employment.index]}).reverse(),
                median_income:
                  'In the United States, among people aged 16-64,'+
                  employment.filter(employment => employment.status === 'earning' &  
                    employment.type === insidechartType & 
                    employment.state === 'United States' &  
                    employment.variable === selected_attributions &
                    employment?.attribution?.includes('deaf') &
                    employment.median_income !== 0).map(
                      function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                      ' and '+
                      deaf_labels[employment.index]+
                      ' $'+Math.round(employment.median_income/1000) + 'K': 
                      index === (row.length-1) ?
                      ' '+deaf_labels[employment.index] +' who are full-time workers earn $'+
                      +Math.round(employment.median_income/1000) + 'K':
                      ' '+deaf_labels[employment.index]+
                      ' $'+Math.round(employment.median_income/1000) + 'K'}).reverse()+
                  ', compared to '+
                  employment.filter(employment => employment.status === 'earning' &  
                    employment.type === insidechartType & 
                    employment.state === 'United States' &  
                    employment.variable === selected_attributions &
                    employment?.attribution?.includes('hearing') &
                    employment.median_income !== 0).map(
                      function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                      ' and '+
                      hear_labels[employment.index]+
                      ' $'+Math.round(employment.median_income/1000) + 'K': 
                      index === (row.length-1) ?
                      ' '+hear_labels[employment.index] +' earn $'+
                      +Math.round(employment.median_income/1000) + 'K':
                      ' '+hear_labels[employment.index]+
                      ' $'+Math.round(employment.median_income/1000) + 'K'}).reverse()
              }[metrics],
            'accordion-is-open':
              {
                percentage:
                  'In the United States, among people aged '+limit_age+scope+', an estimated '+
                  employment.filter(employment => employment.attribution === attribute[0] & 
                    employment.status === insidechartStatus &  
                    employment.type === insidechartType & 
                    employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                      function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                    )
                    +
                  words[0]+nationDescript+', compared to '+
                  employment.filter(employment => employment.attribution === attribute[1] & 
                    employment.status === insidechartStatus &  
                    employment.type === insidechartType & 
                    employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                      function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                    )+
                  words[1],
                median_income:
                  'In the United States, among people aged 16-64,'+
                  employment.filter(employment => employment.status === 'earning' &  
                    employment.type === insidechartType & 
                    employment.state === 'United States' &  
                    employment.attribution === attribute[0]).map(
                      function(employment){return (
                      ' '+words[0]+' who are working full-time earn $'+
                      +Math.round(employment.median_income/1000) + 'K')})+
                  ', compared to '+
                  employment.filter(employment => employment.status === 'earning' &  
                    employment.type === insidechartType & 
                    employment.state === 'United States' &  
                    employment.attribution === attribute[1]).map(
                      function(employment){return (
                        ' '+words[1]+' earn $'+
                        +Math.round(employment.median_income/1000) + 'K')})
                  }[metrics]
              }[accordion_is],
            spline: 
              '',                
            
            popular: 
              '',
            
            all: 
              ''
          }[chartType]+' '+citation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
  let nation_all = {
    chart:{
      width: HCwidth,
      height: 330
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
        employment.state === 'United States').map(employment => employment.percentage).reverse(),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'deaf' & 
            employment.status !== 'no HS diploma' &  
            employment.type === 'education' & 
            employment.state === 'United States' &
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
        employment.state === 'United States').map(employment => employment.percentage).reverse(),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.attribution === 'hearing' & 
            employment.status !== 'no HS diploma' &  
            employment.type === 'education' & 
            employment.state === 'United States' &
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
      allowHTML: true,
      url: exportURL,
      fallbackToExportServer: fallbackToExportServer,
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
          text: nationalTitle+' in the United States ('+acs_one_year+')',
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
          text: 
            '<p>In the United States, among people aged '+limit_age+', an estimated'+
            employment.filter(employment => employment.attribution === 'deaf' & 
              employment.status !== 'no HS diploma' &  
              employment.type === 'education' & 
              employment.state === 'United States').map(
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
              employment.state === 'United States').map(
              function(employment, index){ return index === 0 ? 
              ' and '+
              (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
              edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
              (employment.percentage === 0 ? 'N/A of hearing people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
              edulist[index] :
              ' '+employment.percentage+'% '+edulist[index]}).reverse()+
              ' '+citation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
          backgroundColor: {
            linearGradient: [0, 0, 0, 600],
            stops:
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.71, 'rgb(255,255,255)'],
                [0.71, 'rgb(243, 243, 243)']
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
  let most_popular = {
    chart:{
      width: HCwidth,
      height: 330
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: employment.filter(employment => employment.type === 'Field of Degree' &
        employment.variable ===  insidechartStatus &
        employment.state === 'United States' &
        employment?.attribution?.includes('deaf')).map(
        employment => [employment.status,employment.percentage]).sort(function(a,b){
        return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
        }).map(el => el[0]).slice(0,5).map(function(x,i){
          if(x === 'Science and\nEngineering Related\nFields'){
            return('Science and Engineering Related Fields')
          }else{
            return(x)
          }
        }),
      visible: true,
      type: 'category',
      title: {
        text: null
      },
      crosshair: true,
      gridLineColor: '#ffffff',
      gridLineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 1+Math.max(...employment.filter(employment => employment.type === 'Field of Degree' &
        employment.variable ===  insidechartStatus &
        employment.state === 'United States').map(
        employment => employment.percentage)),
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
        return this.y+'%'
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
      name: 'deaf',
      color: colorfill[0],
      borderColor: colorfill[0],
      borderWidth: 1,
      type: 'column',
      data: employment.filter(employment => employment.type === 'Field of Degree' &
      employment.variable ===  insidechartStatus &
      employment.state === 'United States' &
      employment?.attribution?.includes('deaf')).map(
      employment => [employment.status,employment.percentage]).sort(function(a,b){
      return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
      }).map(el => el[1]).slice(0,5),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === 'Field of Degree' &
              employment.variable ===  insidechartStatus &
              employment.state === 'United States' &
              employment?.attribution?.includes('deaf') &
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
          //return '<img src=''></img>'
        },
      }
    },
    { name: 'hearing',
      color: colorfill[6],
      borderColor: colorfill[6],
      borderWidth: 1,
      type: 'column',
      data: employment.filter(employment => employment.type === 'Field of Degree' &
      employment.variable ===  insidechartStatus &
      employment.state === 'United States' &
      employment?.attribution?.includes('hearing')).map(
      employment => [employment.status,employment.percentage]).sort(function(a,b){
      return sortarray.indexOf(a[0]) - sortarray.indexOf(b[0]);
      }).map(el => el[1]).slice(0,5),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(
            (employment.filter(employment => employment.type === 'Field of Degree' &
              employment.variable ===  insidechartStatus &
              employment.state === 'United States' &
              employment?.attribution?.includes('hearing') &
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
          //return '<img src=''></img>'
        },
      }
    }],
    exporting: {
      allowHTML: true,
      url: exportURL,
      fallbackToExportServer: fallbackToExportServer,
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
          text: nationalTitle+title_by+' in the United States ('+acs_one_year+')',
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
          text: 
            '<p>In the United States, among people aged 25-64, an estimated '+
            dgraduate.map(function(dgraduate, index){ return index === 0 ?
            ' and '+
            (dgraduate[1] === 0 ? 'N/A of ' : ((dgraduate[2]/100)/1.962937)/(dgraduate[1]/100) > 0.3 ? dgraduate[1] + '% \u26a0 ' : dgraduate[1] + '% ')+
            dgraduate[0].toLowerCase() : index === 4 ? ' '+
            (dgraduate[1] === 0 ? 'N/A of deaf people have completed a bachelor’s degree or higher in ' : ((dgraduate[2]/100)/1.962937)/(dgraduate[1]/100) > 0.3 ? dgraduate[1] + "% \u26a0 of deaf people have completed a bachelor’s degree or higher in "+dgraduate[0].toLowerCase() :
            (insidechartStatus === 'Employment' ? dgraduate[1] + "% of deaf people with degrees in "+dgraduate[0].toLowerCase()+' are employed': 
            dgraduate[1] + "% of deaf people have completed a bachelor's degree or higher in "+dgraduate[0].toLowerCase())):
            ' '+dgraduate[1]+'% in '+dgraduate[0].toLowerCase()}).reverse()+
            ', compared to '+
            hgraduate.map(function(hgraduate, index){ return index === 0 ?
              ' and '+
            (hgraduate[1] === 0 ? 'N/A of ' : ((hgraduate[2]/100)/1.962937)/(hgraduate[1]/100) > 0.3 ? hgraduate[1] + '% \u26a0 ' : hgraduate[1] + '% ')+
            hgraduate[0].toLowerCase() : index === 4 ?
            (hgraduate[1] === 0 ? 'N/A of hearing people have completed a bachelor’s degree or higher in ' : ((hgraduate[2]/100)/1.962937)/(hgraduate[1]/100) > 0.3 ? ' '+hgraduate[1] + "% \u26a0 of hearing people in "+hgraduate[0].toLowerCase() :
            (insidechartStatus === 'Employment' ? ' '+hgraduate[1] + "% of hearing people in "+hgraduate[0].toLowerCase()+' being employed': 
            ' '+hgraduate[1] + "% of hearing people with degrees in "+hgraduate[0].toLowerCase())):
            ' '+hgraduate[1]+'% in '+hgraduate[0].toLowerCase()}).reverse()+' '+citation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
          backgroundColor: {
            linearGradient: [0, 0, 0, 600],
            stops: 
            {
              'Graduate': 
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.74, 'rgb(255,255,255)'],
                [0.74, 'rgb(243, 243, 243)']
              ],
              'Employment':
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.71, 'rgb(255,255,255)'],
                [0.71, 'rgb(243, 243, 243)']
              ]
            }[insidechartStatus]
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
  
  let time = {
    chart: {
      width: HCwidth,
      type: 'line'
    },
    title: {
      text: ""
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    xAxis: {
      categories: [acs_one_year-13, acs_one_year-12, acs_one_year-11, acs_one_year-10, acs_one_year-9,
                  acs_one_year-8, acs_one_year-7, acs_one_year-6, acs_one_year-5,
                  acs_one_year-4,acs_one_year-3,acs_one_year-2,acs_one_year-1,acs_one_year],
      type: 'category'
    },
    yAxis: {
      min: spm(timeseries.filter(timeseries => timeseries.type === insidechartType &
        timeseries.status === insidechartStatus & (timeseries.attribution === attribute[0] | timeseries.attribution === attribute[1])).map(
        timeseries => timeseries['percentage']))-1,
      max: Math.max(...timeseries.filter(timeseries => timeseries.type === insidechartType &
        timeseries.status === insidechartStatus & (timeseries.attribution === attribute[0] | timeseries.attribution === attribute[1])).map(
        timeseries => timeseries['percentage']))+1,
      gridLineColor: '#ffffff',
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        overflow: 'justify',
        formatter: function(){
          return this.value+'%'
        },
      }
    },
    tooltip: {
      shared: false,
      formatter: function () {
        return this.series.name+': <b>'+this.y+'%</b>'
      },
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
      connectNulls: false,
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        pointStart: 0
      }
    },
    series: [
    {
      name: attribute[0]+': 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[1],
      data: timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & timeseries.attribution === attribute[0]).map(
      timeseries => [timeseries.year,round(timeseries['percentage']-timeseries.margin_errors),
      round(timeseries['percentage']+timeseries.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false,
      dataLabels: {
        enabled: false,
        formatter: function () {
          return this.y + '%';
        }
      },
      marker: {
        enabled: false
      }
    },
    {
      name: attribute[1]+': 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[7],
      data: timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & timeseries.attribution === attribute[1]).map(
      timeseries => [timeseries.year,round(timeseries['percentage']-timeseries.margin_errors),
      round(timeseries['percentage']+timeseries.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false,
      dataLabels: {
        enabled: false,
        formatter: function () {
          return this.y + '%';
        }
      },
      marker: {
        enabled: false
      }
    },
    {
      name: attribute[0],
      type: 'spline',
      color: colorfill[0],
      data: timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & timeseries.attribution === attribute[0]).map(
        timeseries => [timeseries.year,timeseries['percentage']]),
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y + '%';
          }
        },
        marker: {
          enabled: true,
          symbol: 'diamond'
        }
    },
    {
      name: attribute[1],
      type: 'spline',
      color: colorfill[6],
      dashStyle: 'dot',
      data: timeseries.filter(timeseries => timeseries.type === insidechartType &
      timeseries.status === insidechartStatus & timeseries.attribution === attribute[1]).map(
        timeseries => [timeseries.year,timeseries['percentage']]),
      dataLabels: {
        enabled: true,
        formatter: function () {
          return this.y + '%';
        }
      },
      marker: {
        enabled: true,
        symbol: 'square'
      }
    }],
    exporting: {
      allowHTML: true,
      url: exportURL,
      fallbackToExportServer: fallbackToExportServer,
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
              formatter: function () {
                return this.y + '%';
              },
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
          text: nationalTitle+' by Year in the United States ('+(acs_one_year-13)+'-'+acs_one_year+')',
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
          text:
          '<p>In the United States from '+(acs_one_year-13)+'-'+acs_one_year+
          ', among people aged '+limit_age+', '+sentence+' has '+crease+'. '+
          'From '+(acs_one_year-13)+' to '+acs_one_year+', '+sentence+'s '+crease_word+' by '+                                 
          percentage_difference(timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === min_year &
            timeseries.status === insidechartStatus & timeseries.attribution === attribute[0]).map(
            timeseries => timeseries['percentage']),timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === max_year &
            timeseries.status === insidechartStatus & timeseries.attribution === attribute[0]).map(
            timeseries => timeseries['percentage']))
          +' for '+words[0]+' and '+second_crease_word+' by '+
          percentage_difference(timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === min_year &
            timeseries.status === insidechartStatus & timeseries.attribution === attribute[1]).map(
            timeseries => timeseries['percentage']),timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === max_year &
            timeseries.status === insidechartStatus & timeseries.attribution === attribute[1]).map(
            timeseries => timeseries['percentage']))+' for '+words[1]+' '+citation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
          backgroundColor: {
            linearGradient: [0, 0, 0, 600],
            stops: 
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.77, 'rgb(255,255,255)'],
                [0.77, 'rgb(243, 243, 243)']
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
  }
  let edulevels = {
    chart: {
      width: HCwidth
    },
    title: {
      text: ""
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
    },
    xAxis: {
      categories: ["Less than high school","High school diploma/GED","Some college", "Associate's degree","Bachelor's degree","Master's degree","Ph.D., J.D. or M.D."],
      type: 'category'
    },
    yAxis: {
      min: spm(employment.filter(employment => employment.type === 'levels of education' &
        employment.status === insidechartStatus & (employment.attribution === 'deaf' | employment.attribution === 'hearing')).map(
        employment => employment[metrics]))-1,
      max: Math.max(...employment.filter(employment => employment.type === 'levels of education' &
        employment.status === insidechartStatus & (employment.attribution === 'deaf' | employment.attribution === 'hearing')).map(
        employment => employment[metrics]))+1,
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
      shared: false,
      formatter: function () {
        if(metrics === 'percentage'){
          return this.y+'%'
        }else{
          return '$'+Math.round(this.y/1000)+'K'
        }
      },
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
      connectNulls: false,
      column: {
        pointPadding: 0,
        borderWidth: 0,
      }
    },
    series: [
    {
      name: 'deaf: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[1],
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === insidechartStatus & employment.attribution === 'deaf').map(
      employment => [employment.index,round(employment[metrics]-employment.margin_errors),
      round(employment[metrics]+employment.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false,
      dataLabels: {
        enabled: false,
        formatter: function () {
          if(metrics === 'percentage'){
            return this.y + '%';
          }else{
            return '$'+Math.round(this.y/1000)+'K'
          }
        },
      },
      marker: {
        enabled: false
      }
    },
    {
      name: 'hearing: 95% confidence interval',
      type: 'areasplinerange',
      color: colorfill[7],
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === insidechartStatus & employment.attribution === 'hearing').map(
      employment => [employment.index,round(employment[metrics]-employment.margin_errors),
      round(employment[metrics]+employment.margin_errors)]),
      enableMouseTracking: false,
      showInLegend: false,
      dataLabels: {
        enabled: false,
        formatter: function () {
          if(metrics === 'percentage'){
            return this.y + '%';
          }else{
            return '$'+Math.round(this.y/1000)+'K'
          }
        }
      },
      marker: {
        enabled: false
      }
    },
    {
      name: 'deaf',
      type: 'spline',
      color: colorfill[0],
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === insidechartStatus & employment.attribution === 'deaf').map(
        employment => [employment.index,employment[metrics]]),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(metrics === 'percentage'){
            return this.y + '%';
          }else{
            return '$'+Math.round(this.y/1000)+'K'
          }
        }
      },
      marker: {
        enabled: true,
        symbol: 'diamond'
      }
    },
    {
      name: 'hearing',
      type: 'spline',
      color: colorfill[6],
      dashStyle: 'dot',
      data: employment.filter(employment => employment.type === 'levels of education' &
      employment.status === insidechartStatus & employment.attribution === 'hearing').map(
        employment => [employment.index,employment[metrics]]),
      dataLabels: {
        enabled: true,
        formatter: function () {
          if(metrics === 'percentage'){
            return this.y + '%';
          }else{
            return '$'+Math.round(this.y/1000)+'K'
          }
        }
      },
      marker: {
        enabled: true,
        symbol: 'square'
      }
    }],
    exporting: {
      allowHTML: true,
      url: exportURL,
      fallbackToExportServer: fallbackToExportServer,
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
              formatter: function () {
                if(metrics === 'percentage'){
                  return this.y + '%';
                }else{
                  return '$'+Math.round(this.y/1000)+'K'
                }
              },
              style: {
                fontSize: '18px'
              }
            }
          }
        },
        title: {
          text: 'Education Trend',
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
          text: nationalTitle+' by Level of Education in the United States',
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
          text: 
            '<p>In the United States, among deaf people ages 16-64, the '+nationDescript+
            ' of deaf people increases with level of education, from '+
            employment.filter(employment => employment.type === 'levels of education' &
              employment.status === insidechartStatus & employment.attribution === 'deaf' && employment.level === 'no HS diploma').map(
              employment => employment[metrics]).map(function(x){
              if(metrics === 'median_income'){
                return '$'+Math.round(x/1000)+'K'
              }else{
                return x+'%'
              }})+
            ' for those who did not complete a high school education, to '+
            employment.filter(employment => employment.type === 'levels of education' &
              employment.status === insidechartStatus & employment.attribution === 'deaf' && employment.level === 'master').map(
              employment => employment[metrics]).map(function(x){
              if(metrics === 'median_income'){
                return '$'+Math.round(x/1000)+'K'
              }else{
                return x+'%'
              }})+' for those with a master’s degree '+citation[2],
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
          backgroundColor: {
            linearGradient: [0, 0, 0, 600],
            stops: 
              [
                [0, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(243, 243, 243)'],
                [0.2, 'rgb(255,255,255)'],
                [0.8, 'rgb(255,255,255)'],
                [0.8, 'rgb(243, 243, 243)']
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
  }

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
            employment.variable === selected_attributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
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
      borderColor: colorfill[0],
      type: 'column',
      borderWidth: 1,
      data: {
        'accordion-is':
          employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selected_attributions & employment.state === chosen_state_a &
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
              employment.variable === selected_attributions & employment.state === chosen_state_a &
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
            employment.variable === selected_attributions & employment.state === chosen_state_a &
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
              employment.variable === selected_attributions & employment.state === chosen_state_a &
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
            employment.variable === selected_attributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
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
      borderColor: colorfill[0],
      type: 'column',
      borderWidth: 1,
      data: {
        'accordion-is':
          employment.filter(employment => employment.type === insidechartType & 
            employment.variable === selected_attributions & employment.state === chosen_state_b &
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
              employment.variable === selected_attributions & employment.state === chosen_state_b &
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
            employment.variable === selected_attributions & employment.state === chosen_state_b &
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
              employment.variable === selected_attributions & employment.state === chosen_state_b &
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
          text: 
            '<p>'+{
              column:
                {
                  'accordion-is':
                  {
                    percentage: 
                    employment.filter(employment => employment.type === insidechartType & 
                      employment.variable === selected_attributions & employment.state === chosen_state_b &
                      employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                      employment.percentage !== 0).length === 0 ?
                    in_the_b+state_label_b+', among people aged '+limit_age+
                    ", the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript :
                    in_the_b+state_label_b+', among people aged '+limit_age+', an estimated'+
                    employment.filter(employment => employment.type === insidechartType & 
                      employment.variable === selected_attributions & employment.state === chosen_state_b &
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
                      employment.variable === selected_attributions & employment.state === chosen_state_b &
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
            }[chartType]+' '+citation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
          text: 
            '<p>'+in_the_b+state_label_b+', among people aged '+limit_age+
            (employment.filter(employment => employment.type === insidechartType & 
              employment.variable === selected_attributions & employment.state === chosen_state_b &
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
              ' '+employment.percentage+'% '+edulist[index]}).reverse())+' '+citation[2]+'</p>',
          verticalAlign: 'bottom',
          margin:80,
          useHTML: true,
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
                <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
              </button>
              <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                <div className='data_sidebar_interface'>
                  <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                    <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
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
                        options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
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
                    {
                      {
                        column: <HighchartsReact highcharts={Highcharts} options={nation}/>,
                        spline: <HighchartsReact highcharts={Highcharts} options={time}/>,                       
                        popular:<HighchartsReact highcharts={Highcharts} options={most_popular}/>, 
                        levels: <HighchartsReact highcharts={Highcharts} options={edulevels}/>,
                        all:    <HighchartsReact highcharts={Highcharts} options={nation_all}/>,
                        every_class: <HighchartsReact highcharts={Highcharts} options={nation_every_class}/>
                      }[chartType]
                    }
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
                                    {
                                      percentage: 
                                        'In the United States, among people aged '+limit_age+scope+', an estimated'+
                                        employment.filter(employment => employment.type === insidechartType & 
                                          employment.variable === selected_attributions & employment.state === 'United States' &
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
                                          employment.variable === selected_attributions & employment.state === 'United States' &
                                          employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                                          employment.percentage !== 0).map(
                                          function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ?   
                                          ' and '+
                                          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                          hear_labels[employment.index] : ' '+
                                          (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                          hear_labels[employment.index]}).reverse()+'.',
                                      median_income:
                                        'In the United States, among people aged 16-64,'+
                                        employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.variable === selected_attributions &
                                          employment?.attribution?.includes('deaf') &
                                          employment.median_income !== 0).map(
                                            function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ?   
                                            ' and '+
                                            deaf_labels[employment.index]+
                                            ' $'+Math.round(employment.median_income/1000) + 'K': 
                                            index === (row.length-1) ?
                                            ' '+deaf_labels[employment.index] +' who are full-time workers earn $'+
                                            +Math.round(employment.median_income/1000) + 'K':
                                            ' '+deaf_labels[employment.index]+
                                            ' $'+Math.round(employment.median_income/1000) + 'K'}).reverse()+
                                        ', compared to '+
                                        employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.variable === selected_attributions &
                                          employment?.attribution?.includes('hearing') &
                                          employment.median_income !== 0).map(
                                            function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ?   
                                            ' and '+
                                            hear_labels[employment.index]+
                                            ' $'+Math.round(employment.median_income/1000) + 'K': 
                                            index === (row.length-1) ?
                                            ' '+hear_labels[employment.index] +' earn $'+
                                            +Math.round(employment.median_income/1000) + 'K':
                                            ' '+hear_labels[employment.index]+
                                            ' $'+Math.round(employment.median_income/1000) + 'K'}).reverse()+'.'
                                    }[metrics],
                                  'accordion-is-open':
                                    {
                                      percentage:
                                        'In the United States, among people aged '+limit_age+scope+', an estimated '+
                                        employment.filter(employment => employment.attribution === attribute[0] & 
                                          employment.status === insidechartStatus &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                                            function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                          )
                                          +
                                        words[0]+nationDescript+', compared to '+
                                        employment.filter(employment => employment.attribution === attribute[1] & 
                                          employment.status === insidechartStatus &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States').map(employment => [employment.margin_errors,employment.percentage]).map(
                                            function(ME){return(ME[1] === 0 ? 'N/A of ' : ((ME[0]/100)/1.962937)/(ME[1]/100) > 0.3 ? ME[1] + '% \u26a0 of ' : ME[1] + '% of ')}
                                          )+
                                        words[1]+'.',
                                      median_income:
                                        'In the United States, among people aged 16-64,'+
                                        employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.attribution === attribute[0]).map(
                                            function(employment){return (
                                            ' '+words[0]+' who are working full-time earn $'+
                                            +Math.round(employment.median_income/1000) + 'K')})+
                                        ', compared to '+
                                        employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.attribution === attribute[1]).map(
                                            function(employment){return (
                                              ' '+words[1]+' earn $'+
                                              +Math.round(employment.median_income/1000) + 'K.')})
                                    }[metrics]
                                }[accordion_is],
                              spline: 
                                'In the United States from '+(acs_one_year-13)+'-'+acs_one_year+
                                ', among people aged '+limit_age+', '+sentence+' has '+crease+'. '+
                                'From '+(acs_one_year-13)+' to '+acs_one_year+', '+sentence+'s '+crease_word+' by '+                                 
                                percentage_difference(timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === min_year &
                                  timeseries.status === insidechartStatus & timeseries.attribution === attribute[0]).map(
                                  timeseries => timeseries['percentage']),timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === max_year &
                                  timeseries.status === insidechartStatus & timeseries.attribution === attribute[0]).map(
                                  timeseries => timeseries['percentage']))
                                +' for '+words[0]+' and '+second_crease_word+' by '+
                                percentage_difference(timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === min_year &
                                  timeseries.status === insidechartStatus & timeseries.attribution === attribute[1]).map(
                                  timeseries => timeseries['percentage']),timeseries.filter(timeseries => timeseries.type === insidechartType & timeseries.year === max_year &
                                  timeseries.status === insidechartStatus & timeseries.attribution === attribute[1]).map(
                                  timeseries => timeseries['percentage']))+' for '+words[1]+'.',                                                  
                              popular: 
                                'In the United States, among people aged 25-64, an estimated '+
                                dgraduate.map(function(dgraduate, index){ return index === 0 ?
                                ' and '+
                                (dgraduate[2] === 0 ? 'N/A of ' : ((dgraduate[2]/100)/1.962937)/(dgraduate[1]/100) > 0.3 ? dgraduate[1] + '% \u26a0 ' : dgraduate[1] + '% ')+
                                dgraduate[0].toLowerCase() : index === 4 ? ' '+
                                (dgraduate[2] === 0 ? 'N/A of deaf people have completed a bachelor’s degree or higher in ' : ((dgraduate[2]/100)/1.962937)/(dgraduate[1]/100) > 0.3 ? dgraduate[1] + "% \u26a0 of deaf people have completed a bachelor’s degree or higher in "+dgraduate[0].toLowerCase() :
                                (insidechartStatus === 'Employment' ? dgraduate[1] + "% of deaf people with degrees in "+dgraduate[0].toLowerCase()+' are employed': 
                                dgraduate[1] + "% of deaf people have completed a bachelor's degree or higher in "+dgraduate[0].toLowerCase())):
                                ' '+dgraduate[1]+'% in '+dgraduate[0].toLowerCase()}).reverse()+
                                ', compared to '+
                                hgraduate.map(function(hgraduate, index){ return index === 0 ?
                                  ' and '+
                                (hgraduate[2] === 0 ? 'N/A of ' : ((hgraduate[2]/100)/1.962937)/(hgraduate[1]/100) > 0.3 ? hgraduate[1] + '% \u26a0 ' : hgraduate[1] + '% ')+
                                hgraduate[0].toLowerCase()+'.' : index === 4 ?
                                (dgraduate[2] === 0 ? 'N/A of hearing people have completed a bachelor’s degree or higher in ' : ((hgraduate[2]/100)/1.962937)/(hgraduate[1]/100) > 0.3 ? ' '+hgraduate[1] + "% \u26a0 of hearing people in "+hgraduate[0].toLowerCase() :
                                (insidechartStatus === 'Employment' ? ' '+hgraduate[1] + "% of hearing people in "+hgraduate[0].toLowerCase()+' being employed': 
                                ' '+hgraduate[1] + "% of hearing people with degrees in "+hgraduate[0].toLowerCase())):
                                ' '+hgraduate[1]+'% in '+hgraduate[0].toLowerCase()}).reverse(),
                              levels: 
                                'In the United States, among deaf people ages 16-64, the '+nationDescript+
                                ' of deaf people increases with level of education, from '+
                                employment.filter(employment => employment.type === 'levels of education' &
                                  employment.status === insidechartStatus & employment.attribution === 'deaf' && employment.level === 'no HS diploma').map(
                                  employment => employment[metrics]).map(function(x){
                                  if(metrics === 'median_income'){
                                    return '$'+Math.round(x/1000)+'K'
                                  }else{
                                    return x+'%'
                                  }})+
                                ' for those who did not complete a high school education, to '+
                                employment.filter(employment => employment.type === 'levels of education' &
                                  employment.status === insidechartStatus & employment.attribution === 'deaf' && employment.level === 'master').map(
                                  employment => employment[metrics]).map(function(x){
                                  if(metrics === 'median_income'){
                                    return '$'+Math.round(x/1000)+'K'
                                  }else{
                                    return x+'%'
                                  }})+' for those with a master’s degree.',                                
                              all: 
                                'In the United States, among people aged '+limit_age+', an estimated'+
                                employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.status !== 'no HS diploma' &  
                                  employment.type === 'education' & 
                                  employment.state === 'United States').map(
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
                                  employment.state === 'United States').map(
                                  function(employment, index){ return index === 0 ? 
                                  ' and '+
                                  (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                  edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
                                  (employment.percentage === 0 ? 'N/A of hearing people have completed ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people have completed ' : employment.percentage + '% of hearing people have completed ')+
                                  edulist[index] :
                                  ' '+employment.percentage+'% '+edulist[index]}).reverse()+'.',
                              every_class: 
                                'In the United States, among people aged '+limit_age+', an estimated'+
                                employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.type === 'cow' & 
                                  employment.state === 'United States').sort(
                                    (a, b) => statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status)
                                  ).map(
                                  function(employment, index){ return index === 0 ? 
                                  ' and '+
                                  (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                  cowLabels[index] : cowLabels[cowLabels.length - 1] === cowLabels[index] ? ' '+
                                  (employment.percentage === 0 ? 'N/A of deaf people are ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of deaf people are ' : employment.percentage + '% of deaf people are ')+
                                  cowLabels[index] :
                                  ' '+employment.percentage+'% '+cowLabels[index]}).reverse()+
                                ', compared to '+
                                employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.type === 'cow' & 
                                  employment.state === 'United States').sort(
                                    (a, b) => statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status)
                                  ).map(
                                  function(employment, index){ return index === 0 ? 
                                  ' and '+
                                  (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 ' : employment.percentage + '% ')+
                                  cowLabels[index] : cowLabels[cowLabels.length - 1] === cowLabels[index] ? ' '+
                                  (employment.percentage === 0 ? 'N/A of hearing people are ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of hearing people are ' : employment.percentage + '% of hearing people are ')+
                                  cowLabels[index] :
                                  ' '+employment.percentage+'% '+cowLabels[index]}).reverse()
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
                                      employment.variable === selected_attributions & employment.state === 'United States' &
                                      employment.status === insidechartStatus & employment?.attribution?.includes('deaf')).map(
                                      employment => employment.n).reduce(
                                        (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                    ' deaf people and '+
                                    size_checker(employment.filter(employment => employment.type === insidechartType & 
                                      employment.variable === selected_attributions & employment.state === 'United States' &
                                      employment.status === insidechartStatus & employment?.attribution?.includes('hearing')).map(
                                      employment => employment.n).reduce(
                                        (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                    ' hearing people in the United States who participated in the '+year+
                                    ' American Community Survey. The margin of errors are '+
                                    {
                                      percentage:
                                        employment.filter(employment => employment.attribution === 'deaf' & 
                                          employment.status === insidechartStatus & 
                                          employment.type === insidechartType & 
                                          employment.state === 'United States').map(
                                          employment => employment.margin_errors)+'% for deaf people and ',
                                      median_income:
                                        formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & employment.state === 'United States' &  
                                          employment.attribution === 'deaf').map(employment => employment.margin_errors)))+' for deaf people and '
                                    }[metrics]+
                                    {
                                      percentage:
                                        employment.filter(employment => employment.attribution === 'hearing' & 
                                          employment.status === insidechartStatus & 
                                          employment.type === insidechartType & 
                                          employment.state === 'United States').map(
                                          employment => employment.margin_errors)+'% for hearing people.',
                                      median_income:
                                        formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & employment.state === 'United States' &  
                                          employment.attribution === 'hearing').map(employment => employment.margin_errors)))+' for hearing people.'
                                    }[metrics],
                                  'accordion-is-open':
                                    {
                                      percentage:
                                        'In this chart, estimates are based on a sample size of '+
                                        size_checker(employment.filter(employment => employment.type === insidechartType & 
                                          employment.attribution === attribute[0] & 
                                          employment.state === 'United States' &
                                          employment.status === insidechartStatus).map(employment => employment.n).reduce(
                                          (sum, a) => sum + a, 0)).toLocaleString('en-US')+' '+words[0]+' and '+
                                        size_checker(employment.filter(employment => employment.type === insidechartType & 
                                          employment.attribution === attribute[1] & 
                                          employment.state === 'United States' &
                                          employment.status === insidechartStatus).map(employment => employment.n).reduce(
                                          (sum, a) => sum + a, 0)).toLocaleString('en-US')+' '+words[1]+
                                        ' in the United States who participated in the '+year+' American Community Survey. The margin of errors are '+
                                        employment.filter(employment =>
                                          employment.attribution === attribute[0] & 
                                          employment.status === insidechartStatus & 
                                          employment.type === insidechartType & 
                                          employment.state === 'United States').map(
                                          employment => employment.margin_errors)+
                                        '% for '+words[0]+' and '+
                                        employment.filter(employment =>
                                          employment.attribution === attribute[1] & 
                                          employment.status === insidechartStatus & 
                                          employment.type === insidechartType & 
                                          employment.state === 'United States').map(
                                          employment => employment.margin_errors)+
                                        '% for '+words[1]+'.',
                                      median_income:
                                        'In this chart, estimates are based on a sample size of '+
                                        employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.attribution === attribute[0]).map(employment => employment.n).map(
                                            function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+' '+
                                        words[0]+' people and '+
                                        employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.attribution === attribute[1]).map(employment => employment.n).map(
                                          function(n){if(n < 100){return 'less than 100'}else{return n}}).toLocaleString('en-US')+
                                        ' '+words[1]+
                                        ' people who participated in the '+acs_one_year+
                                        ' American Community Survey. The margin of errors are '+
                                        formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.attribution === attribute[0]).map(employment => employment.margin_errors)))+
                                        ' for '+words[0]+' and '+
                                        formatDollar(round(employment.filter(employment => employment.status === 'earning' &  
                                          employment.type === insidechartType & 
                                          employment.state === 'United States' &  
                                          employment.attribution === attribute[1]).map(employment => employment.margin_errors)))+
                                        ' for '+words[1]+'.'
                                    }[metrics]
                                }[accordion_is],
                              spline:
                                <div/>,
                              popular:
                                <div/>,
                              levels:
                                <div/>,
                              all:
                                'In this chart, estimates are based on a sample size of '+
                                size_checker(employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.status === 'HS diploma' & employment.type === 'education' & 
                                  employment.state === 'United States').map(employment => employment.n).reduce(
                                    (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
                                size_checker(employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.status === 'HS diploma' & employment.type === 'education' & 
                                  employment.state === 'United States').map(employment => employment.n).reduce(
                                    (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                ' hearing people in the United States who participated in the American Community '+year+
                                ' American Community Survey. The margin of errors are between '+
                                employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.status === 'phd/dr' & 
                                  employment.type === 'education' & 
                                  employment.state === 'United States').map(
                                  employment => employment.margin_errors)+
                                '% and '+
                                employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.status === 'HS diploma' & 
                                  employment.type === 'education' & 
                                  employment.state === 'United States').map(
                                  employment => employment.margin_errors)+
                                '% for deaf people, and between '+
                                employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.status === 'phd/dr' & 
                                  employment.type === 'education' & 
                                  employment.state === 'United States').map(employment => employment.margin_errors)+
                                '% and '+
                                employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.status === 'HS diploma' & 
                                  employment.type === 'education' & 
                                  employment.state === 'United States').map(employment => employment.margin_errors)+
                                '% for hearing people.',
                              every_class:
                                'In this chart, estimates are based on a sample size of '+
                                size_checker(employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.status === 'For-profit' & employment.type === 'cow' & 
                                  employment.state === 'United States').map(employment => employment.denominator).reduce(
                                    (sum, a) => sum + a, 0)).toLocaleString('en-US')+' deaf people and '+
                                size_checker(employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.status === 'For-profit' & employment.type === 'cow' & 
                                  employment.state === 'United States').map(employment => employment.denominator).reduce(
                                    (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                ' hearing people in the United States who participated in the American Community '+year+
                                ' American Community Survey. The margin of errors are between '+
                                Math.min(...employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.type === 'cow' & 
                                  employment.state === 'United States').map(
                                  employment => employment.margin_errors))+
                                '% and '+
                                Math.max(...employment.filter(employment => employment.attribution === 'deaf' & 
                                  employment.type === 'cow' & 
                                  employment.state === 'United States').map(
                                  employment => employment.margin_errors))+
                                '% for deaf people, and between '+
                                Math.min(...employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.type === 'cow' & 
                                  employment.state === 'United States').map(employment => employment.margin_errors))+
                                '% and '+
                                Math.max(...employment.filter(employment => employment.attribution === 'hearing' & 
                                  employment.type === 'cow' & 
                                  employment.state === 'United States').map(employment => employment.margin_errors))+
                                '% for hearing people.'
                            }[chartType]
                          }
                          </div>
                          <div className = {warning_sty}>
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
                          options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
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
                <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
              </button>
              <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                <div className='data_sidebar_interface'>
                  <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                    <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
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
                        options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
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
                                              employment.variable === selected_attributions & employment.state === chosen_state_a &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).length === 0 ? ", the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript : 
                                              ', an estimated'+
                                            employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selected_attributions & employment.state === chosen_state_a &
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
                                              employment.variable === selected_attributions & employment.state === chosen_state_a &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                                              employment.percentage !== 0).length === 0 ? ' N/A of ' : '')+
                                            employment.filter(employment => employment.type === insidechartType & 
                                            employment.variable === selected_attributions & employment.state === chosen_state_a &
                                            employment.status === insidechartStatus & employment?.attribution?.includes('hearing') &
                                            employment.percentage !== 0).map(
                                            function(employment,index,row){ return (index === 0 && (deaf_labels.length - 1) > 0 && row.length > 1) ? 
                                            ' and '+
                                            (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                            hear_labels[employment.index] : ' '+
                                            (employment.percentage === 0 ? 'N/A of ' : ((employment.margin_errors/100)/1.962937)/(employment.percentage/100) > 0.3 ? employment.percentage + '% \u26a0 of ' : employment.percentage + '% of ')+
                                            hear_labels[employment.index]}).reverse())+
                                            (employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selected_attributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).length === 0 ? ". This issue is also present "+in_the_b.toLowerCase()+state_label_b+'.' : 
                                            employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selected_attributions & employment.state === chosen_state_b &
                                              employment.status === insidechartStatus & employment?.attribution?.includes('deaf') &
                                              employment.percentage !== 0).length === 0 ?
                                            '. While '+in_the_b.toLowerCase()+state_label_b+', among people aged '+limit_age+
                                            ", the sample size is not sufficient to accurately report the percentage of deaf people who"+nationDescript :
                                            '. While '+in_the_b.toLowerCase()+state_label_b+', among people aged '+limit_age+', an estimated'+
                                            employment.filter(employment => employment.type === insidechartType & 
                                              employment.variable === selected_attributions & employment.state === chosen_state_b &
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
                                              employment.variable === selected_attributions & employment.state === chosen_state_b &
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
                                        employment.variable === selected_attributions & employment.state === chosen_state_a &
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
                                          employment.variable === selected_attributions & (employment.state === chosen_state_a | employment.state === chosen_state_b) &
                                          employment.status !== 'no HS diploma' & employment?.attribution?.includes('deaf') &
                                          employment.percentage !== 0).length === 0 ? ". This issue is also present "+in_the_b.toLowerCase()+state_label_b : 
                                        employment.filter(employment => employment.type === insidechartType & 
                                          employment.variable === selected_attributions & employment.state === chosen_state_b &
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
                                            employment.variable === selected_attributions & employment.state === chosen_state_a &
                                            employment.status === insidechartStatus).map(employment => employment.n).reduce(
                                              (sum, a) => sum + a, 0)).toLocaleString('en-US')+
                                          ' people'+in_the_a.toLowerCase()+state_label_a+' and '+
                                          size_checker(employment.filter(employment => employment.type === insidechartType & 
                                            employment.variable === selected_attributions & employment.state === chosen_state_b &
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
                          options = {attributions.filter(attributions => attributions.variable === selected_attributions)}
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
                <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
              </button>
              <div className = 'data_sidebar' ref={sidebarRef} style={{display:data_sidebar,marginRight: sidebarWidth}} aria-hidden = 'true'>
                <div className='data_sidebar_interface'>
                  <button className = 'data_sidebar_button1' ref={buttonRef} onClick= {changeSideBarWidth} style = {{display:data_sidebar}} tabIndex = {tabindex}>
                    <FontAwesome name = 'caret-left' className = 'icon_style' style={{transform: icon_rotate}}/>
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