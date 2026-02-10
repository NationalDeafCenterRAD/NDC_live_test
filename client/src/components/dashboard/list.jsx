import acs_one_year from '../../data/acs_year.json';

export const national_options = [
  {label: 'Education', value: 'Education',isTitle: true,
   variable: 'education', title: "Bachelor's Degree Attainment or Higher", title_by:'', disabled: false, second_disabled: false, display: 'unset', 
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education',age: '25–64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education',
   chartype: 'column', metrics: 'percentage', categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Education Attainment', value: 'Education Attainment', variable: 'education', title: "Bachelor's Degree Attainment or Higher", title_by:'', disabled: false, second_disabled: false, display: 'unset', 
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education',age: '25–64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education',
   chartype: 'column', metrics: 'percentage', categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'College Enrollment Rate', value: 'College Enrollment Rate', variable: 'enrollment', title: 'College Enrollment Rate', title_by:'', disabled: false, second_disabled: false, display: 'None',
    set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'Enrolled',type: 'enrollment',age: '16–64', description: ' are enrolled in postsecondary education and training', description1: '', sentence: '', group: 'enrollment',
    chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Most Popular Majors', value: 'Most Popular Majors',variable: 'mostpopular', title: 'College Graduate Rates Across 5 Most Popular Majors', title_by:'', disabled: true, second_disabled: true, display: 'unset',
    set_for_chart: [{label: "Graduate Rate", value: "Graduate Rate"}], subvariable: 'Graduate', type: 'Field of Degree', age: '25–64', description: '', description1: '', sentence: '', group: 'popular',
    chartype: 'popular',metrics: 'percentage',categories: '', accordion: 'accordion-is', scope: ''
  },
  {label: 'Employment', value: 'Employment',isTitle: true,
   variable: 'employment', title: 'Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Employed", value: "Employed"}], subvariable: 'employed',type: 'employment',age: '16–64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Employment Status', value: 'Employment Status', variable: 'employment', title: 'Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Employed", value: "Employed"}], subvariable: 'employed',type: 'employment',age: '16–64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Class of Worker', value: 'Class of Worker', variable: 'cow', title: "Percentage of Federal Gov't Employees", title_by:'', disabled: false, second_disabled: false, display: 'unset',
    set_for_chart: [{label: "Federal gov't", value: "Federal gov't"}], subvariable: "Federal gov't",type: 'cow',age: '16–64', description: '  are federal government employees',description1: '  are federal government employees', sentence: '', group: 'cow',
    chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Type of Employment', value: 'Type of Employment', variable: 'self-employment', title: 'Self-Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: 'Self-Employed', value: 'Self-Employed Rate'}], subvariable: 'self-employed', type: 'self-employment', age: '16–64', description: ' are self-employed, which is defined as not working for a specific employer who pays them a consistent salary or wage', description1: '', sentence: '', group: 'self-employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing', scope: ' and who are employed'
  },
  {label: 'Income', value: 'Income',isTitle: true,
   variable: 'earning', title: 'Median Earning', title_by:'', disabled: false, second_disabled: false, display: 'None',
   set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'earning', type: 'salary-range',age: '16–64', description: ' who have full-time job earn', description1: '', sentence: '', group: 'salary-range',
   chartype: 'column',metrics: 'median_income',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Median Earning', value: 'Median Earning', variable: 'earning', title: 'Median Earning', title_by:'', disabled: false, second_disabled: false, display: 'None',
  set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'earning', type: 'salary-range',age: '16–64', description: ' who have full-time job earn', description1: '', sentence: '', group: 'salary-range',
   chartype: 'column',metrics: 'median_income',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Mean Earning', value: 'Mean Earning', variable: 'earning', title: 'Mean Earning', title_by:'', disabled: false, second_disabled: false, display: 'None',
   set_for_chart: [{label: "Nothing", value: "Nothing"}], subvariable: 'earning', type: 'mean-salary-range',age: '16–64', description: ' who have full-time job earn', description1: '', sentence: '', group: 'mean-salary-range',
   chartype: 'column',metrics: 'median_income',categories: '', accordion: 'nothing', scope: ''
  },
  {label: 'Trends', value: 'Trends',isTitle: true,
   variable: 'TimeSeries', title: "Bachelor's Degree Attainment or Higher",title_by: ' By Year '+[acs_one_year-9]+'-'+acs_one_year, disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education', age: '25–64', description: " have completed a bachelor's degree or higher", description1: '', sentence: "bachelor's degree attainment rate", group: 'TimeSeries',
   chartype: 'spline', metrics: 'percentage', categories: '', accordion: 'accordion-is-open', scope: ''
  },
  {label: 'Change Over Time', value: 'Change Over Time', variable: 'TimeSeries', title: "Bachelor's Degree Attainment or Higher",title_by: ' By Year '+[acs_one_year-9]+'-'+acs_one_year, disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education', age: '25–64', description: " have completed a bachelor's degree or higher", description1: '', sentence: "bachelor's degree attainment rate", group: 'TimeSeries',
   chartype: 'spline', metrics: 'percentage', categories: '', accordion: 'accordion-is-open', scope: ''
  },
  {label: 'Employment/Earnings by Education', value: 'Employment/Earnings by Education', variable: 'levels of education', title: 'Employment Rate',title_by: ' By Level of Education', disabled: true, second_disabled: true, display: 'unset',
   set_for_chart: [{label: "Employment Rates", value: "Employment Rates"}], subvariable: "employed", type: 'levels of education', age: '25–64', description: 'employment rate', description1: '', sentence: '', group: 'levels of education',
   chartype: 'levels', metrics: 'percentage', categories: '', accordion: 'accordion-is', scope: ''
  }
]

export const variables = [
  {label: 'Overall', value: 'Overall', variable: 'overall', variables: [''],
   deaf: ['deaf people'], hearing: ['hearing people'], more_options: ' ', title_by: '', age: '16–64'
  },
  {label: 'Age', value: 'Age', variable: 'age', variables: ['16-24','25-34','35-44','45-54','55-64'],
   deaf: ['deaf people in 16-24 age','deaf people in 25-34 age group','deaf people in 35-44 age group','deaf people in 45-54 age group','deaf people in 55-64 age group'], 
   hearing: ['hearing people in 16-24 age people','hearing people in 25-34 age group','hearing people in 35-44 age group','hearing people in 45-54 age group','hearing people in 55-64 age people'],
   more_options: ' Age ', title_by: ' by Age', age: '16–64'
  },
  {label: 'Race', value: 'Race', variable: 'race', variables: ['Asian','Black','Latine','Native American','multiracial','white'/*,'BIPOC'*/],
   deaf: ['Asian deaf people','Black deaf people','Latine deaf people','Native American deaf people','multiracial deaf people','white deaf people'/*,'deaf BIPOC'*/],
   hearing: ['Asian hearing people','Black hearing people','Latine hearing people','Native American hearing people','multiracial hearing','white hearing people'/*,'hearing BIPOC'*/],
   more_options: ' Race ', title_by: ' by Race', age: '16–64'
  },
  {label: 'Gender', value: 'Gender', variable: 'gender', variables: ['women','men'],
   deaf: ['deaf women','deaf men'], hearing: ['hearing women','hearing men'],
   more_options: ' Gender ', title_by: ' by Gender', age: '16–64'
  },
  {label: 'Disability', value: 'Disability', variable: 'disability', variables: ['blind','disabled','no additional disabilities','with additional disabilities'],
   deaf: ['deafblind people','deafdisabled people','deaf people with no additional disabilities','deaf with additional disabilities'], 
   hearing: ['hearing blind people','hearing disabled people', 'hearing people with no additional disabilities','hearing with additional disabilities'],
   more_options: ' Disability ', title_by: ' by Disability', age: '16–64'
  },
  {label: 'Overall', value: 'Overall', variable: 'overall', variables: [''],
  deaf: ['deaf people'], hearing: ['hearing people'], more_options: ' ', title_by: '', age: '25–64'
 },
 {label: 'Age', value: 'Age', variable: 'age', variables: ['25-34','35-44','45-54','55-64'],
  deaf: ['deaf people in 25-34 age group','deaf people in 35-44 age group','deaf people in 45-54 age group','deaf people in 55-64 age group'], 
  hearing: ['hearing people in 25-34 age group','hearing people in 35-44 age group','hearing people in 45-54 age group','hearing people in 55-64 age people'],
  more_options: ' Age ', title_by: ' by Age', age: '25–64'
 },
 {label: 'Race', value: 'Race', variable: 'race', variables: ['Asian','Black','Latine','Native American','multiracial','white'/*,'BIPOC'*/],
  deaf: ['Asian deaf people','Black deaf people','Latine deaf people','Native American deaf people','multiracial deaf people','white deaf people'/*,'deaf BIPOC'*/],
  hearing: ['Asian hearing people','Black hearing people','Latine hearing people','Native American hearing people','multiracial hearing','white hearing people'/*,'hearing BIPOC'*/],
  more_options: ' Race ', title_by: ' by Race', age: '25–64'
 },
 {label: 'Gender', value: 'Gender', variable: 'gender', variables: ['women','men'],
  deaf: ['deaf women','deaf men'], hearing: ['hearing women','hearing men'],
  more_options: ' Gender ', title_by: ' by Gender', age: '25–64'
 },
 {label: 'Disability', value: 'Disability', variable: 'disability', variables: ['blind','disabled','no additional disabilities','additional disabilities'],
  deaf: ['deafblind people','deafdisabled people','deaf people with no additional disabilities','deaf people with additional disabilities'], 
  hearing: ['hearing blind people','hearing disabled people', 'hearing people with no additional disabilities','hearing people with additional disabilities'],
  more_options: ' Disability ', title_by: ' by Disability', age: '25–64'
 }
]

export const inside_chart_options = [
  {label: 'All Levels', value: 'All Levels', title: "Education Attainment - High School, Some College, AA, BA, MA, PHD", variable: 'all', type: 'education',age: '25–64', description: '', description1: '', sentence: '', group: 'education', metrics: 'percentage', chartype: 'all', disabled: true, second_disabled: true},
  {label: 'High School', value: 'High School', title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25–64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college',type: 'education',age: '25–64',description: ' have completed some college', description1: ' have completed some college', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false,second_disabled: false},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate',type: 'education',age: '25–64', description: " have completed an associate's degree or higher", description1: " have completed an associate's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor',type: 'education',age: '25–64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master',type: 'education',age: '25–64', description: " have completed a master's degree or higher", description1: " have completed a master's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr',type: 'education',age: '25–64', description: ' have completed doctoral degree or equivalent',description1: ' have completed doctoral degree or equivalent', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  
  {label: "Employed", value: "Employed", title: "Employment Rate", variable: 'employed',type: 'employment',age: '16–64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Unemployed", value: "Unemployed", title: "Unemployment Rate", variable: 'unemployed',type: 'employment',age: '16–64', description: ' are unemployed, which is defined as being currently or recently looking for work', description1: ' are unemployed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Not in Labor Force", value: "Not in Labor Force", title: "People not in Labor Force", variable: 'notinLF',type: 'employment',age: '16–64', description: ' are not in the labor force, which is defined as not currently employed and not looking for work', description1: ' are not in the labor force', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},

  {label: 'All Classes', value: 'All Classes', title: "Percentage of Worker Classes", variable: 'every_class', type: 'cow',age: '16–64', description: '', description1: '', sentence: '', group: 'cow', metrics: 'percentage', chartype: 'every_class', disabled: true, second_disabled: true},
  {label: "For-Profit", value: "For-Profit", title: "Percentage of For-Profit Employees", variable: 'For-profit',type: 'cow',age: '16–64', description: '  are for-profit employees',description1: '  are for-profit employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Non-Profit", value: "Non-Profit", title: "Percentage of Non-Profit Employees", variable: 'Non-profit',type: 'cow',age: '16–64', description: '  are non-profit employees',description1: '  are non-profit employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Local Gov't", value: "Local Gov't", title: "Percentage of Local Gov't Employees", variable: "Local gov't",type: 'cow',age: '16–64', description: '  are local government employees',description1: '  are local government employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "State Gov't", value: "State Gov't", title: "Percentage of State Gov't Employees", variable: "State gov't",type: 'cow',age: '16–64', description: '  are state government employees',description1: '  are state government employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Federal Gov't", value: "Federal Gov't", title: "Percentage of Federal Gov't Employees", variable: "Federal gov't",type: 'cow',age: '16–64', description: '  are federal government employees',description1: '  are federal government employees', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Self-Employed and Business", value: "Self-Employed and Business", title: "Percentage of Self-Employed and Business Employees", variable: "Self-employed/Business",type: 'cow',age: '16–64', description: '  are self-employed or business owners',description1: '  are self-employed or business owners', sentence: '', group: 'cow', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},

  {label: "Graduate Rate", value: "Graduate Rate", title: "College Graduate Rate Across 5 Most Popular Majors", variable: 'Graduate',type: 'Field of Degree',age: '25–64', description: ' have completed a bachelor’s degree or higher', description1: ' who have completed a bachelor’s degree or higher', sentence: '', group: 'mostpopular', metrics: 'percentage',chartype: 'popular',disabled: true, second_disabled: true},
  {label: "Degrees x Employment Rate", value: "Degrees x Employment Rate", title: "Employment Rate By 5 Most Popular Majors", variable: 'Employment',type: 'Field of Degree',age: '25–64', description: ' have completed a bachelor’s degree or higher', description1: ' who have completed a bachelor’s degree or higher', sentence: '', group: 'mostpopular', metrics: 'percentage', chartype: 'popular',disabled: true, second_disabled: true},
  
  {label: "Self-Employed", value: "Self-Employed", title: "Self-Employment Rate", variable: "self-employed", type: "self-employment", age: "16–64", description: ' are self-employed, which is defined as not working for a specific employer who pays them a consistent salary or wage', description1: '', sentence: '', group: 'self-employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Business Owners", value: "Business Owners", title: "Percentage of Business Owners", variable: "business owner", type: "self-employment", age: "16–64", description: ' are business owners', description1: '', sentence: '', group: 'self-employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Full-Time Workers", value: "Full-Time Workers", title: "Percentage of Full-Time Workers", variable: "full-time", type: "self-employment", age: "16–64", description: ' are full-time workers', description1: '', sentence: '', group: 'self-employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  
  {label: 'College Enrollment', value: 'College Enrollment',isTitle: true,title: "College Enrollment Rate", variable: 'Enrolled',type: 'enrollment',age: '16–64', description: ' are enrolled in postsecondary education and training,', description1: ' are enrolled', sentence: 'the college enrollment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Enrolled", value: "Enrolled", title: "College Enrollment Rate", variable: 'Enrolled',type: 'enrollment',age: '16–64', description: ' are enrolled in postsecondary education and training,', description1: ' are enrolled', sentence: 'the college enrollment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'Education', value: 'Education',isTitle: true, title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25–64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: "the high school's attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'High School', value: 'High School', title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25–64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: "the high school's attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college',type: 'education',age: '25–64',description: ' have completed some college', description1: ' have completed some college', sentence: 'some college attainment rate', group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate',type: 'education',age: '25–64', description: " have completed an associate's degree or higher", description1: " have completed an associate's degree or higher", sentence: "the associate's degree attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor',type: 'education',age: '25–64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: "the bachelor's degree attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master',type: 'education',age: '25–64', description: " have completed a master's degree or higher", description1: " have completed a master's degree or higher", sentence: "the master's degree attainment rate", group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr',type: 'education',age: '25–64', description: ' have completed doctoral degree or equivalent',description1: ' have completed doctoral degree or equivalent', sentence: 'the doctoral attainment rate', group: 'TimeSeries', metrics: 'percentage',chartype: 'spline',disabled: false, second_disabled: false},
  {label: 'Employment', value: 'Employment',isTitle: true, title: "Employment Rate", variable: 'employed',type: 'employment',age: '16–64', description: '  are employed',description1: '  are employed', sentence: 'the employment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Employed", value: "Employed", title: "Employment Rate", variable: 'employed',type: 'employment',age: '16–64', description: '  are employed',description1: '  are employed', sentence: 'the employment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Unemployed", value: "Unemployed", title: "Unemployment Rate", variable: 'unemployed',type: 'employment',age: '16–64', description: ' are unemployed, which is defined as being currently or recently looking for work,', description1: ' are unemployed', sentence: 'the unemployment rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},
  {label: "Not in Labor Force", value: "Not in Labor Force", title: "People not in Labor Force", variable: 'notinLF',type: 'employment',age: '16–64', description: ' are not in the labor force, which is defined as not currently employed and not looking for work,', description1: ' are not in the labor force', sentence: 'the non-labor force participation rate', group: 'TimeSeries', metrics: 'percentage', chartype: 'spline',disabled: false, second_disabled: false},

  {label: "Employment Rates", value: "Employment Rates", title: "Employment Rate", variable: 'employed',type: 'levels of education',age: '25–64', description: 'employment rate',description1: '  are employed', sentence: '', group: 'levels of education', metrics: 'percentage', chartype: 'levels',disabled: true, second_disabled: true},
  {label: "Median Earnings", value: "Median Earnings", title: "Median Earnings", variable: 'earning',type: 'levels of education',age: '25–64', description: 'median earning',description1: '', sentence: '', group: 'levels of education', metrics: 'median_income', chartype: 'levels',disabled: true, second_disabled: true},
  {label: "Mean Earnings", value: "Mean Earnings", title: "Mean Earnings", variable: 'mean-earning',type: 'levels of education',age: '25–64', description: 'mean earning',description1: '', sentence: '', group: 'levels of education', metrics: 'median_income', chartype: 'levels',disabled: true, second_disabled: true},
  {label: "Nothing", value: "Nothing"},
]

export const attributions = [
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
  {label: 'Latine hearing', value: 'Latine hearing', variable: 'race', color: 'black', words: 'Latine hearing people'},
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
  //{label: 'hearing with additional disabilities', value: 'hearing with additional disabilities', variable: 'disability', color: 'black', words: 'hearing people with additional disabilities'}
]

export const level_of_education = [
  { "label": "Ph.D., J.D. or M.D.", "category": "phd/dr" },
  { "label": "Master's degree", "category": "master" },
  { "label": "Bachelor's degree", "category": "bachelor" },
  { "label": "Associate's degree", "category": "associate" },
  { "label": "Some college", "category": "some college" },
  { "label": "High school diploma/GED", "category": "HS diploma" },
  { "label": "Less than high school", "category": "no HS diploma" }
];
// State Option List
export const state_options = [
  {label: 'Education Attainment', value: 'Education Attainment', variable: 'education', title: "Bachelor's Degree Attainment or Higher", title_by:'', disabled: false, second_disabled: false, display: 'unset', 
   set_for_chart: [{label: "Bachelor's", value: "Bachelor's"}], subvariable: 'bachelor',type: 'education',age: '25–64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education',
   chartype: 'column', metrics: 'percentage', categories: '', accordion: 'nothing'
  },
  {label: 'Employment Status', value: 'Employment Status', variable: 'employment', title: 'Employment Rate', title_by:'', disabled: false, second_disabled: false, display: 'unset',
   set_for_chart: [{label: "Employed", value: "Employed"}], subvariable: 'employed',type: 'employment',age: '16–64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment',
   chartype: 'column',metrics: 'percentage',categories: '', accordion: 'nothing'
  }
]

export const state_inside_chart_options = [
  {label: 'All Levels', value: 'All Levels', title: "Education Attainment - High School, Some College, AA, BA, MA, PHD", variable: 'all', type: 'education',age: '25–64', description: '', description1: '', sentence: '', group: 'education', metrics: 'percentage', chartype: 'all', disabled: true, second_disabled: true},
  {label: 'High School', value: 'High School', title: "High School Attainment or Higher", variable: 'HS diploma',type: 'education',age: '25–64', description: ' have completed high school or higher', description1: ' have completed high school or higher', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: 'Some College', value: 'Some College', title: "Some College Attainment or Higher", variable: 'some college',type: 'education',age: '25–64',description: ' have completed some college', description1: ' have completed some college', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false,second_disabled: false},
  {label: "Associate's", value: "Associate's", title: "Associate's Degree Attainment or Higher", variable: 'associate',type: 'education',age: '25–64', description: " have completed an associate's degree or higher", description1: " have completed an associate's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Bachelor's", value: "Bachelor's", title: "Bachelor's Degree Attainment or Higher", variable: 'bachelor',type: 'education',age: '25–64', description: " have completed a bachelor's degree or higher", description1: " have completed a bachelor's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Master's", value: "Master's", title: "Master's Degree Attainment or Higher", variable: 'master',type: 'education',age: '25–64', description: " have completed a master's degree or higher", description1: " have completed a master's degree or higher", sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "PhD, JD or MD", value: "PhD, JD or MD", title: "PhD, JD, or MD Attainment", variable: 'phd/dr',type: 'education',age: '25–64', description: ' have completed doctoral degree or equivalent',description1: ' have completed doctoral degree or equivalent', sentence: '', group: 'education', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  
  {label: "Employed", value: "Employed", title: "Employment Rate", variable: 'employed',type: 'employment',age: '16–64', description: '  are employed',description1: '  are employed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Unemployed", value: "Unemployed", title: "Unemployment Rate", variable: 'unemployed',type: 'employment',age: '16–64', description: ' are unemployed, which is defined as being currently or recently looking for work', description1: ' are unemployed', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
  {label: "Not in Labor Force", value: "Not in Labor Force", title: "People not in Labor Force", variable: 'notinLF',type: 'employment',age: '16–64', description: ' are not in the labor force, which is defined as not currently employed and not looking for work', description1: ' are not in the labor force', sentence: '', group: 'employment', metrics: 'percentage',chartype: 'column',disabled: false, second_disabled: false},
]

export const geographics = [
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
export const edulist = ["doctoral degree or equivalent","master’s degree or higher","bachelor’s degree or higher",
               "an associate’s degree or higher",'some college or higher','high school or higher']