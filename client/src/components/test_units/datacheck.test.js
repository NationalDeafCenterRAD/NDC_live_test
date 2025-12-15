const fs = require('fs');
const path = require('path');

// Function to vertify SVG path
function isSvgPath(str) {
  const regex = /^([MLHVZCSQTAmlhvzcsqta])/; // Check for valid SVG commands
  return regex.test(str);
}

const dataDir = path.join(__dirname, '../assets');

describe('Data Integrity Checks', () => {
  test('All data files exist.', () => {
    const requiredFiles = ['acs_5_year.json','acs_year.json','employment.json',
        'occupation.json','timeseries.json','us25_64.json','usmap.json'
    ]

    requiredFiles.forEach(file => {
      const filePath = path.join(dataDir,file);
      const fileContent = fs.readFileSync(filePath,'utf8');
      expect(() => JSON.parse(fileContent)).not.toThrow();
      expect(JSON.parse(fileContent)).not.toEqual({});
    });
  });

  test('The acs_year.json is in right format.', () => {
    const filePath = path.join(dataDir,'acs_year.json');
    const fileContent = fs.readFileSync(filePath,'utf8');
    const acs1y = JSON.parse(fileContent)[0];
    const currentYear = new Date().getFullYear();
    expect(typeof acs1y).toBe('number');
    expect(acs1y).toBeGreaterThanOrEqual(1000);
    expect(acs1y).toBeLessThanOrEqual(9999);
    expect(currentYear - acs1y).toBeLessThanOrEqual(2)
  });

  test("The acs_5_year.json is in right format.", () => {
    const filePath_1y = path.join(dataDir,'acs_year.json');
    const filePath_5y = path.join(dataDir,'acs_5_year.json');
    const fileContent_1y = fs.readFileSync(filePath_1y,'utf8');
    const fileContent_5y = fs.readFileSync(filePath_5y,'utf8');

    const acs1y = JSON.parse(fileContent_1y)[0];
    const acs5y = JSON.parse(fileContent_5y)[0];

    expect(typeof acs5y).toBe('number');
    expect(acs5y).toBeGreaterThanOrEqual(1000);
    expect(acs5y).toBeLessThanOrEqual(9999);
    expect(acs1y - acs5y).toBeLessThanOrEqual(1)
  });

  test("The USmap.json is in right format.", () => {
    const filePath = path.join(dataDir,'usmap.json');
    const fileContent = fs.readFileSync(filePath,'utf8');

    const usmapData = JSON.parse(fileContent);

    const requiredVariables = ['name','label','value','id','X','Y','shape'];
    usmapData.forEach((usmap) => {
      // All variables exist
      requiredVariables.forEach(variable => {
        expect(usmap).toHaveProperty(variable, expect.anything());
      });
  
      // Name, label, and value should equal each other
      expect(usmap.name).toBe(usmap.label);
      expect(usmap.label).toBe(usmap.value);
  
      // Check if id is exactly two uppercase letters
      expect(usmap.id).toMatch(/^[A-Z]{2}$/);
      expect(usmap.id.length).toBe(2);
  
      // Check X and Y are numbers
      expect(typeof usmap.X).toBe('number');
      expect(typeof usmap.Y).toBe('number');
  
      // Check if shape is a string and matches the expected SVG path format
      expect(typeof usmap.shape).toBe('string');
      expect(isSvgPath(usmap.shape)).toBe(true);
    });
  });

  test('The us25_64.json is in right format.', () => {
    const requiredVariables = ["SCHL","n","for_filter",
      "N","cumsum","attain","type","year"
    ]

    const someHaveVariables = ["DEAR",
      "method","chisq_statistic","dof","p_value"
    ]

    const filePath = path.join(dataDir,'us25_64.json');
    const fileContent = fs.readFileSync(filePath,'utf8');

    const us25_64Data = JSON.parse(fileContent);
    
    us25_64Data.forEach((us25_64) => {
      // All variables exist
      requiredVariables.forEach(variable => {
        expect(us25_64).toHaveProperty(variable, expect.anything());
      });
    });
    
    // Check if some variables exist within some data
    const someDatahaveSomeVariable = us25_64Data.some(us25_64 => 
      someHaveVariables.some(variable => us25_64.hasOwnProperty(variable))
    );
    
    expect(someDatahaveSomeVariable).toBe(true);
  });

  test('The occupation.json is in right format.', () => {
    const filePath = path.join(dataDir,'occupation.json');
    const fileContent = fs.readFileSync(filePath,'utf8');

    const occupationData = JSON.parse(fileContent);

    const requiredVariables = ["attribution","percent of total employed",
      "BA","median salary","attribution_hearing",
      "percent of total employed_hearing","BA_hearing","median salary_hearing"];

      occupationData.forEach((occ) => {
        // All variables exist
        requiredVariables.forEach(variable => {
          expect(occ).toHaveProperty(variable, expect.anything());
        });

        // Check each variable for typeof
        expect(occ.attribution).toMatch('deaf');
        expect(typeof occ.occupation).toBe('string');
        expect(typeof occ['percent of total employed']).toBe('number');
        expect(typeof occ.BA).toBe('number');
        expect(typeof occ['median salary']).toBe('number');

        expect(occ.attribution_hearing).toMatch('hearing');
        expect(typeof occ['percent of total employed_hearing']).toBe('number');
        expect(typeof occ.BA_hearing).toBe('number');
        expect(typeof occ['median salary_hearing']).toBe('number');
    });
  });

  test('The timeseries.json is in the right format.', () => {
    const filePath = path.join(dataDir, 'timeseries.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const timeSeriesData = JSON.parse(fileContent);

    const acs1yPath = path.join(dataDir,'acs_year.json');
    const acs1yContent = fs.readFileSync(acs1yPath,'utf8');
    const acs1y = JSON.parse(acs1yContent)[0];
  
    const someVariables = [
      { name: "attribution", expectTypeOf: 'string' },
      { name: "status", expectTypeOf: 'string' },
      { name: "percentage", expectTypeOf: 'number' },
      { name: "margin_errors", expectTypeOf: 'number' },
      { name: "variable", expectTypeOf: 'string' },
      { name: "type", expectTypeOf: 'string' },
      { name: "state", expectTypeOf: 'string' },
      { name: "year", expectTypeOf: 'number' },
      { name: "n", expectTypeOf: 'number' }
    ];
  
    // Check if at least one entry has any of the specified variables
    const someDataHaveSomeVariable = timeSeriesData.some(time =>
      someVariables.some(({ name }) => time.hasOwnProperty(name))
    );
  
    expect(someDataHaveSomeVariable).toBe(true);
  
    // Check every variable associates with correct typeof in each entry
    timeSeriesData.forEach(time => {
      someVariables.forEach(({ name, expectTypeOf }) => {
        if (time.hasOwnProperty(name)) {
          const value = time[name];
          expect(typeof value).toBe(expectTypeOf); // Check for expected type
        }
      });
    });

    // Check if time series is 13 year period and most recent year equal to acs_1_year
    const allYears = [...new Set(timeSeriesData.map(variable => variable.year))];
    expect(Math.max(...allYears) - Math.min(...allYears)).toEqual(13);
    expect(Math.max(...allYears)).toEqual(acs1y);

    // Scan data for no group missing - status by variable
    const allStatuses = new Set();
    const allVariables = new Set();

    // Single pass through timeSeriesData
    timeSeriesData.forEach(time => {
      if(time.status != null && time.variable != null){
        allStatuses.add(time.status);
        allVariables.add(time.variable);
      }
    });

    allStatuses.forEach(status => {
      allVariables.forEach(variable => {
        const time = timeSeriesData.filter(item => item.variable === variable && item.status === status).map(item => item.percentage);
        const isOk = status === 'no HS diploma'
          ? !(time.length > 0 && time.every(value => value === 0))
          : !(time.length > 0 && time.every(value => value === 0 || value === 100));
        try{
          expect(isOk).toBe(true);
        } catch(error){
          const explanation = `Found missing info in data. In the status "${status}" and variable "${variable}", this data returns array of percentages: [${time}]. Please review your R script work. If good, revise the datacheck.test.js.`
          /*console.log({
            status: status,
            variable: variable,
            percentages: time,
            allZeroesOr100: areAllZeroesOr100s
          });*/
          throw new Error(explanation);
        }
      })
    });
  });

  test('The employment.json is in the right format.', () => {
    const filePath = path.join(dataDir, 'employment.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const employmentData = JSON.parse(fileContent);
  
    const someVariables = [
      { name: 'state', expectTypeOf: 'string' },
      { name: "attribution", expectTypeOf: 'string' },
      { name: "variable", expectTypeOf: 'string' },
      { name: "type", expectTypeOf: 'string' },
      { name: "status", expectTypeOf: 'string' },
      { name: "percentage", expectTypeOf: 'number' },
      { name: "margin_errors", expectTypeOf: 'number' },
      { name: "index", expectTypeOf: 'number' },
      { name: "denominator", expectTypeOf: 'number' },
      { name: "median_income", expectTypeOf: 'number' },
      { name: "level", expectTypeOf: 'number' },
      { name: "n", expectTypeOf: 'number' }
    ];
  
    // Check if at least one entry has any of the specified variables
    const someDataHaveSomeVariable = employmentData.some(time =>
      someVariables.some(({ name }) => time.hasOwnProperty(name))
    );
  
    expect(someDataHaveSomeVariable).toBe(true);
  
    // Check every variable associates with correct typeof in each entry
    employmentData.forEach(emp => {
      someVariables.forEach(({ name, expectTypeOf }) => {
        if (emp.hasOwnProperty(name)) {
          const value = emp[name];
          expect(typeof value).toBe(expectTypeOf); // Check for expected type
        }
      });
    });

    // Scan data for no group missing - status by variable
    const allStatuses = new Set();
    const allVariables = new Set();
    const allStates = new Set();

    // Single pass through employmentData
    employmentData.forEach(emp => {
      if(typeof emp.status === 'string' && emp.status.trim() !== '' &&
        typeof emp.variable === 'string' && emp.variable.trim() !== '' &&
        typeof emp.state === 'string' && emp.state.trim() !== ''){
        allStatuses.add(emp.status);
        allVariables.add(emp.variable);
        allStates.add(emp.state);
      }
    });

    allStatuses.forEach(status => {
      allVariables.forEach(variable => {
        allStates.forEach(state => {
          const emp = employmentData.filter(item => item.variable === variable && item.status === status && item.state === state).map(item => item.percentage == null ? item.median_income : item.percentage);
          const areAllZeroesOr100s = status === 'no HS diploma' ?  
            emp.length === 0  || emp.every(value => value === 0) != true : 
            emp.length === 0 || emp.every(value => value === 0 || value === 100 || value === emp[0]) != true;
          try{
            expect(areAllZeroesOr100s).toBe(true);
          } catch(error){
            const explanation = `Found missing info in data. In the state "${state}", status "${status}" and variable "${variable}", this data returns array of percentages: [${emp}]. Please review your R script work. If good, revise the datacheck.test.js.`
            throw new Error(explanation);
          }
        })
      })
    });
  });
});