import { useMemo } from "react";
import { useCitation } from "../citation.jsx";
import acs_one_year from '../../data/acs_year.json';
import thelogo from "../../assets/images/NDC_logo_color_horizontal-black-text.png";
import raw_employment from '../../data/employment.json';
import timeseries from '../../data/timeseries.json'; 
import { 
  edulist, attributions as listAttributions,
  level_of_education
} from "./list.jsx";
import '../../assets/styles/app.css';


class customHighCharts {
  constructor(options = {}){
    this.config = {
      maintitle: options.maintitle || '',
      caption: options.caption || '',
      attributions: options.attributions || ['deaf','hearing'], 
      type: options.type || 'employment', 
      variable: options.variable || 'overall',
      state: options.state || 'United States', 
      status: options.status || 'employed', 
      colorfill: options.colorfill || ['#00A79D', '#43C9C8', '#D6EEF0', 'url(#teal)', 'url(#teal1)', 'url(#teal2)', '#282729', '#949494', '#dbdbdb'],
      openAccordion: options.openAccordion || false,
      isExportingEnabled: options.isExportingEnabled || true,
      chartType: options.chartType || 'column',
      sentence: options.sentence || '',
      scope: options.scope || '',
      limitAge: options.limitAge || '',
      nationDescript: options.nationDescript || '',
      deafLabels: options.deafLabels || [],
      hearLabels: options.hearLabels || [],
      titleBy: options.titleBy || ''
    }
    this.data = this._selectDataSet();
    this.preparedData = this._setup();
  }

  // Utils
  _percentage_difference = (x1,x2) => {
    return(Math.abs(this._round((x2 - x1)))+'%')
  }

  _formatValue(val) {
    const { metric } = this.preparedData;
    if (metric === 'percentage') {
      return `${val}%`;
    }
    return `$${Math.round(val / 1000)}K`;
  }

  _capitalize = (str) => {
    if (typeof str !== 'string' || str.length === 0) {
      return ""; 
    } // Handle empty strings or null
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  _dataLabelFormatter = ({y,name}) => {
    const { metric, series } = this.preparedData;
    const isUnstable = series.flatMap(seriesData => 
      seriesData.filter(e => e[metric] === y & e?.attribution?.includes(name)))
      .some(e => ((e.margin_errors/100)/1.962937)/(y/100) > 0.3);
    
    if(isUnstable){
      if(y === 0){
        return ''
      }else{
        if(metric === 'percentage'){
          return '\u26a0'+y + '%'
        }else{
          return '\u26a0 $'+Math.round(y/1000)+'K'
        }
      }
    }else{
      if(y === 0){
        return ''
      }else{
        if(metric === 'percentage'){
          return y + '%';
        }else{
          return '$'+Math.round(y/1000)+'K'
        }
      }
    }
  }

  _round = (num) => {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  _joinWithAnd = arr => {
    const items = arr.filter(v => v != null && v !== '');

    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  };

  _wordCounter = x => {
    if(x.trim().split(/\s+/gi).length/20 > 2){
      return((Math.trunc(x.trim().split(/\s+/gi).length/20)-2)*0.03)
    }else{
      return(0)
    }
  }

  // Select and prepare data
  _selectDataSet = () => {
    const { chartType } = this.config;
    let data = [];
    if(chartType === 'spline'){
      data = timeseries;
    }else {
      data = raw_employment.filter(e => e.attribution !== 'deaf BIPOC' && e.attribution !== 'hearing BIPOC');
    }
    return data;
  }

  _setup = () => {
    const { attributions, type, variable, status, state, chartType, openAccordion } = this.config;
    const dataset = this.data;

    let categories = this._defineCategories();
    let maxY = 100;
    let minY = 0;
    let series = [];
    let arr1 = [];
    let arr2 = [];

    // Build series dataset
    if(chartType === 'levels'){
      const filtered = dataset.filter(
        (e) =>
          e.status === status &&
          e.type === "levels of education" &&
          e.state === state
      ).map((e) => {
        // Find the object where the category matches the value in your dataset
        const match = level_of_education.find((item) => item.category === e?.level);
        
        // Return the label if found, otherwise fallback to the raw value
        return match ? {...e, label: match.label} : {...e};
      }).reverse();

      const firstAttr = filtered.filter(e => e.attribution === 'deaf').reverse();
      const seconAttr = filtered.filter(e => e.attribution === 'hearing').reverse();

      arr1.push(...firstAttr);
      arr2.push(...seconAttr);
    }else if(chartType === 'spline'){
      const filtered = dataset.filter(
        (e) =>
          e.status === status &&
          e.type === type &&
          e.state === state
      );

      const firstAttr = filtered.filter(e => e.attribution === attributions[0]).reverse();
      const seconAttr = filtered.filter(e => e.attribution === attributions[1]).reverse();

      arr1.push(...firstAttr);
      arr2.push(...seconAttr);
    }else if(type === 'Field of Degree'){
      const filtered = dataset.filter(
        (e) =>
          e.variable === status &&
          e.type === type &&
          e.state === state
      );

      const deafItems = filtered.filter(e => e.attribution === 'deaf').slice(0,5);
      const hearingItems = filtered.filter(e => e.attribution === 'hearing').slice(0,5);

      arr1.push(...deafItems);
      arr2.push(...hearingItems); 
    }else if (['all','popular','every_class'].includes(chartType)/* || !categories || categories.length === 0*/) {     
      const filtered = dataset.filter(
        (e) =>
          e.type === type &&
          e.state === state
      );

      const deafItems = filtered.filter(e => e.attribution === 'deaf' && e.status !== 'no HS diploma').reverse();
      const hearingItems = filtered.filter(e => e.attribution === 'hearing' && e.status !== 'no HS diploma').reverse();

      arr1.push(...deafItems);
      arr2.push(...hearingItems);      
    }else if(openAccordion){
      const filtered = attributions.map((attr) => {
        const filtered = dataset.filter(
          (e) =>
            e.attribution === attr &&
            e.type === type &&
            e.status === status &&
            e.state === state
        );

        return filtered[0]
      });

      arr1.push(filtered[0]);
      arr2.push(filtered[1]);
    }else{
      categories.forEach((category) => {
        if(!category){
          let filtered = [];

          filtered = dataset.filter(
            (e) =>
              e.type === type &&
              e.variable === variable &&
              e.status === status &&
              e.state === state
          );

          arr1.push(filtered[0]);
          arr2.push(filtered[1]);
          return;
        }

        const filtered = dataset.filter(
          (e) =>
            e.categories === category &&
            e.type === type &&
            e.variable === variable &&
            e.status === status &&
            e.state === state
        );
        
        arr1.push(filtered[0]);
        arr2.push(filtered[1]);
      });
    }

    // Add readable words to both arrays
    const processSeries = (arr) => {
      if (arr?.length > 0 && arr.every(e => e !== undefined)) {
        return arr.map(e => {
          const match = listAttributions.find(list => list.label === e?.attribution);
          return {
            ...e,
            readable: match?.words
          };
        });
      }
      return null;
    };

    // Use the helper to push to series
    const processed1 = processSeries(arr1);
    if (processed1) series.push(processed1);

    const processed2 = processSeries(arr2);
    if (processed2) series.push(processed2);

    // Redefine categories if levels
    if(chartType === 'levels'){
      categories = series[0].map(e => e?.label);
    }

    const inverted = state !== 'United States';
    const metric = ['salary-range','mean-salary-range','stem-salary-range','stem-mean-salary-range'].includes(type) || 
       (chartType === 'levels' && ['earning','mean-earning'].includes(status)) ?  'median_income' : 'percentage';

    // Find y-axis max
    maxY = Math.max(...series.map((serie) => {
      return Math.max(...serie.map((dataPoint) => {
        const value = metric === 'percentage' ? dataPoint?.percentage : dataPoint?.median_income;
        return value
      }));
    })) + 1; 
    
    if(['spline','levels'].includes(chartType)){
      minY = Math.min(...series.map((serie) => {
        return Math.min(...serie.map((dataPoint) => {
          const value = metric === 'percentage' ? dataPoint?.percentage : dataPoint?.median_income;
          return value
        }))
      }))-1
    }

    return {
      categories,
      series,
      metric,
      inverted,
      maxY,
      minY
    }
  }

  // Map color and categories
  _defineColorNum = () => {
    const { attributions, chartType } = this.config;

    // Check if every string in the array contains the word 'deaf'
    if(['all','most_popular','every_class','levels'].includes(chartType)){
      return [0,6];
    }else if (chartType !== 'spline' && attributions.every(attr => attr.toLowerCase().includes('deaf'))) {
      return [0,2];
    } 
    // Check if every string in the array contains the word 'hearing'
    else if (chartType !== 'spline' && attributions.every(attr => attr.toLowerCase().includes('hearing'))) {
      return [6,8];
    } 
    // If both
    else {
      return [0,6];
    }
  }

  _defineCategories = () => {
    const { variable, status, state, attributions, type, chartType, openAccordion } = this.config;
    const dataset = this.data;

    if(type === 'Field of Degree'){
      const categories = dataset.filter(
        (e) =>
          e.variable === status &&
          e.type === type &&
          e.state === state &&
          e.attribution === 'deaf'
      ).slice(0,5).map(e => e?.categories || '');
      return(categories)
    }else if(chartType === 'spline'){
      return([acs_one_year[0]-9,
        acs_one_year[0]-8, acs_one_year[0]-7, acs_one_year[0]-6, acs_one_year[0]-5,
        acs_one_year[0]-4,acs_one_year[0]-3,acs_one_year[0]-2,acs_one_year[0]-1,acs_one_year[0]])
    }else{
      return(openAccordion ? 
        attributions : 
        dataset.filter(e =>
          e.type === type && 
          e.variable === variable && 
          e.status === status && 
          e.state === state &&
          e.attribution.includes('deaf')
        ).map(e => e?.categories || '').reverse()
      );
    }
  };

  // Construct sentence  
  _calculateCrease = () => {
    const { attributions } = this.config;
    const { series } = this.preparedData;

    const object = series
      .flatMap(seriesData =>
        seriesData
          .filter(e => e?.year === acs_one_year[0] || e?.year === acs_one_year[0] - 9)
          .map(e => ({
            year: e?.year,
            attribution: e?.attribution,
            value: e?.percentage,
            readable: e?.readable
          }))
      )
      .reduce((acc, { year, attribution, readable, value }) => {
        if (!acc[attribution]) acc[attribution] = {};
        acc[attribution][year] = { value, readable };
        return acc;
      }, {});

    const yearNow = acs_one_year[0];
    const yearPast = yearNow - 9;

    const attr1 = attributions[0];
    const attr2 = attributions[1];

    const attr1CompareToSelf =
      (object?.[attr1]?.[yearNow]?.value ?? 0) -
      (object?.[attr1]?.[yearPast]?.value ?? 0);

    const attr2CompareToSelf =
      (object?.[attr2]?.[yearNow]?.value ?? 0) -
      (object?.[attr2]?.[yearPast]?.value ?? 0);

    const attr1Word = object?.[attr1]?.[yearNow]?.readable ?? attr1;
    const attr2Word = object?.[attr2]?.[yearNow]?.readable ?? attr2;

    if (attr1CompareToSelf > 0 && attr2CompareToSelf < 0) {
      return {
        crease: `increased for ${attr1Word} while it has decreased for ${attr2Word}`,
        creaseAttr1: 'increase',
        creaseAttr2: 'decrease',
        attr1Word,
        attr2Word
      };
    } else if (attr1CompareToSelf < 0 && attr2CompareToSelf > 0) {
      return {
        crease: `decreased for ${attr1Word} while it has increased for ${attr2Word}`,
        creaseAttr1: 'decreased',
        creaseAttr2: 'increased',
        attr1Word,
        attr2Word
      };
    } else if (
      attr1CompareToSelf > attr2CompareToSelf &&
      attr1CompareToSelf > 0 &&
      attr2CompareToSelf > 0
    ) {
      return {
        crease: `increased more for ${attr1Word} than ${attr2Word}`,
        creaseAttr1: 'increased',
        creaseAttr2: 'increased',
        attr1Word,
        attr2Word
      };
    } else if (
      attr1CompareToSelf < attr2CompareToSelf &&
      attr1CompareToSelf > 0 &&
      attr2CompareToSelf > 0
    ) {
      return {
        crease: `increased less for ${attr1Word} than ${attr2Word}`,
        creaseAttr1: 'increased',
        creaseAttr2: 'increased',
        attr1Word,
        attr2Word
      };
    } else if (
      attr1CompareToSelf > attr2CompareToSelf &&
      attr1CompareToSelf < 0 &&
      attr2CompareToSelf < 0
    ) {
      return {
        crease: `decreased less for ${attr1Word} than ${attr2Word}`,
        creaseAttr1: 'decreased',
        creaseAttr2: 'decreased',
        attr1Word,
        attr2Word
      };
    } else if (
      attr1CompareToSelf < attr2CompareToSelf &&
      attr1CompareToSelf < 0 &&
      attr2CompareToSelf < 0
    ) {
      return {
        crease: `decreased more for ${attr1Word} than ${attr2Word}`,
        creaseAttr1: 'decreased',
        creaseAttr2: 'decreased',
        attr1Word,
        attr2Word
      };
    } else if (
      attr1CompareToSelf === attr2CompareToSelf &&
      attr1CompareToSelf > 0
    ) {
      return {
        crease: `neither increased more nor less for ${attr1Word} than ${attr2Word}`,
        creaseAttr1: 'increased',
        creaseAttr2: 'increased',
        attr1Word,
        attr2Word
      };
    } else if (
      attr1CompareToSelf === attr2CompareToSelf &&
      attr1CompareToSelf < 0
    ) {
      return {
        crease: `neither decreased more nor less for ${attr1Word} than ${attr2Word}`,
        creaseAttr1: 'decreased',
        creaseAttr2: 'decreased',
        attr1Word,
        attr2Word
      };
    } else {
      return {
        crease: `neither decreased nor increased`,
        creaseAttr1: 'changed',
        creaseAttr2: 'changed',
        attr1Word,
        attr2Word
      };
    }
  };

  getWarning = () =>{
    const { series, metric } = this.preparedData;

    const warning = series.some(seriesData =>
      seriesData.some(e => {
        if (!e?.margin_errors) return false;
        const standardError = (e.margin_errors / 100) / 1.962937;
        const rse = standardError / (e.percentage / 100);
        return rse > 0.3 || e?.[metric] === 0;
      })
    )

    return warning;
  }

  getContent = () => {
    // Parameters
    let spline = {};
    let column = [];
    let attribution = null; // Handle if attribute contains no value

    const { 
      chartType, type, status, 
      attributions, sentence,
      scope, limitAge, nationDescript
    } = this.config;
    const { metric, series } = this.preparedData
    const dataset = this.data;

    // If user selects nonexistent group
    if(series.length === 1){
      attribution = [
        ...new Set(
          series.flatMap(seriesData =>
            seriesData.map(e => ({attribution: e.attribution, readable: e.readable}))
          )
        )
      ]
    }
    
    if(chartType === 'spline'){
      spline = this._calculateCrease();
    }else if(chartType === 'column'){
      column = series.map((seriesData, index) =>
        this._joinWithAnd(
          seriesData.filter(e => e?.[metric] !== 0).map((e,i) => {
            const ratio =
              ((e?.margin_errors / 100) / 1.962937) /
              (e?.percentage / 100);

            if(metric === 'median_income'){
              const complete = index === 0 && i === 0 && e?.median_income !== 0 
                ? `${e?.readable} have a ${type === 'mean-salary-range' ? 'mean' : 'median'} annual income of $${Math.round(e.median_income/1000)}K`
                : e?.median_income !== 0 
                  ? `${e?.readable} $${Math.round(e.median_income/1000)}K`
                  : null
              return complete      
            }else{
              const prefix =
                e?.[metric] === 0
                  ? 'N/A of '
                  : ratio > 0.3
                    ? `${e?.percentage}% \u26a0 of `
                    : `${e?.percentage}% of `;  
              
              return `${prefix}${e?.readable}`;
            }
          })
        )
      ).filter(e => e !== "")
    }

    const statusOrder = ['For-profit', 'Non-profit', "Local gov't", "State gov't", "Federal gov't", "Self-employed/Business"];
    const cowLabels = ['self-employed or business owners', 'federal government employees', 'state government employees', 'local government employees', 'non-profit employees', 'for-profit employees']

    const dgraduate = dataset.filter(e => e.type === 'Field of Degree' &
      e.variable ===  'Graduate' &
      e.state === 'United States' &
      e?.attribution?.includes('deaf')).map(
      e => [e.status,e.percentage,e.margin_errors]).slice(0,5).reverse()

    const hgraduate = dataset.filter(e => e.type === 'Field of Degree' &
      e.variable ===  'Graduate' &
      e.state === 'United States' &
      e?.attribution?.includes('deaf')).map(
      e => [e.status,e.percentage,e.margin_errors]).slice(0,5).reverse()
    
    console.log(column.length === 1);
    const content = {
      column:
      {
        percentage:
          series.length > 1 && column.length > 1
            ?
              'In the United States, among people aged '+limitAge+scope+', an estimated '+column[0]+
              nationDescript+', compared to '+column[1]
            : series.length === 1 || column.length === 1
              ?
                'In the United States, among people aged '+limitAge+scope+', an estimated '+column[0]+
                nationDescript+'.'
              : 
                '',
        median_income:
          series.length > 1 && column.length > 1
              ?
                'In the United States, among people aged 16-64 who are working full time, '+column[0]+
                ', compared to '+column[1]
              : series.length === 1 || column.length === 1
                ?
                  'In the United States, among people aged 16-64 who are working full time, '+column[0]+'.'
                :
                  ''
      }[metric],
      spline:
        series.length > 1 
          ?
            'In the United States from '+(acs_one_year[0]-9)+' to '+acs_one_year[0]+
            ', among people aged '+limitAge+', '+sentence+' has '+spline?.crease+'. '+
            'For example, '+sentence+'s '+spline?.creaseAttr1+' by '+                                 
            this._percentage_difference(dataset.filter(e => e.type === type & e.year === acs_one_year[0]-9 &
              e.status === status & e.attribution === attributions[0]).map(
              e => e['percentage']),dataset.filter(e => e.type === type & e.year === acs_one_year[0] &
              e.status === status & e.attribution === attributions[0]).map(
              e => e['percentage']))
            +' for '+spline?.attr1Word+' and '+spline?.creaseAttr2+' by '+
            this._percentage_difference(dataset.filter(e => e.type === type & e.year === acs_one_year[0]-9 &
              e.status === status & e.attribution === attributions[1]).map(
              e => e['percentage']),dataset.filter(e => e.type === type & e.year === acs_one_year[0] &
              e.status === status & e.attribution === attributions[1]).map(
              e => e['percentage']))+' for '+spline?.attr2Word
        : series.length === 1 
          ?
            'In the United States from '+(acs_one_year[0]-9)+' to '+acs_one_year[0]+
            ', among people aged '+limitAge+', '+sentence+'s '+spline?.creaseAttr1+' by '+                                 
            this._percentage_difference(dataset.filter(e => e.type === type & e.year === acs_one_year[0]-9 &
              e.status === status & e.attribution === attribution?.[0]?.attribution).map(
              e => e['percentage']),dataset.filter(e => e.type === type & e.year === acs_one_year[0] &
              e.status === status & e.attribution === attribution?.[0]?.attribution).map(
              e => e['percentage']))
            +' for '+attribution?.[0]?.readable+'.'
          :
            ''
      ,                                                  
      popular: 
        'In the United States, among people aged 25-64, an estimated '+
        dgraduate.map(function(dgraduate, index){ return index === 0 ?
        ' and '+
        (dgraduate[2] === 0 ? 'N/A of ' : ((dgraduate[2]/100)/1.962937)/(dgraduate[1]/100) > 0.3 ? dgraduate[1] + '% \u26a0 ' : dgraduate[1] + '% ')+
        dgraduate[0].toLowerCase() : index === 4 ? ' '+
        (dgraduate[2] === 0 ? 'N/A of deaf people have completed a bachelor’s degree or higher in ' : ((dgraduate[2]/100)/1.962937)/(dgraduate[1]/100) > 0.3 ? dgraduate[1] + "% \u26a0 of deaf people have completed a bachelor’s degree or higher in "+dgraduate[0].toLowerCase() :
        (status === 'Employment' ? dgraduate[1] + "% of deaf people with degrees in "+dgraduate[0].toLowerCase()+' are employed': 
        dgraduate[1] + "% of deaf people have completed a bachelor's degree or higher in "+dgraduate[0].toLowerCase())):
        ' '+dgraduate[1]+'% in '+dgraduate[0].toLowerCase()}).reverse()+
        ', compared to '+
        hgraduate.map(function(hgraduate, index){ return index === 0 ?
          ' and '+
        (hgraduate[2] === 0 ? 'N/A of ' : ((hgraduate[2]/100)/1.962937)/(hgraduate[1]/100) > 0.3 ? hgraduate[1] + '% \u26a0 ' : hgraduate[1] + '% ')+
        hgraduate[0].toLowerCase() : index === 4 ?
        (dgraduate[2] === 0 ? 'N/A of hearing people have completed a bachelor’s degree or higher in ' : ((hgraduate[2]/100)/1.962937)/(hgraduate[1]/100) > 0.3 ? ' '+hgraduate[1] + "% \u26a0 of hearing people in "+hgraduate[0].toLowerCase() :
        (status === 'Employment' ? ' '+hgraduate[1] + "% of hearing people in "+hgraduate[0].toLowerCase()+' being employed': 
        ' '+hgraduate[1] + "% of hearing people with degrees in "+hgraduate[0].toLowerCase())):
        ' '+hgraduate[1]+'% in '+hgraduate[0].toLowerCase()}).reverse(),
      levels: 
        'In the United States, among deaf people ages 16-64, the '+nationDescript+
        ' of deaf people increases with level of education, from '+
        dataset.filter(e => e.type === 'levels of education' &
          e.status === status & e.attribution === 'deaf' && e.level === 'no HS diploma').map(
          e => e[metric]).map(function(x){
          if(metric === 'median_income'){
            return '$'+Math.round(x/1000)+'K'
          }else{
            return x+'%'
          }})+
        ' those who did not complete a high school education, to '+
        dataset.filter(e => e.type === 'levels of education' &
          e.status === status & e.attribution === 'deaf' && e.level === 'master').map(
          e => e[metric]).map(function(x){
          if(metric === 'median_income'){
            return '$'+Math.round(x/1000)+'K'
          }else{
            return x+'%'
          }})+' those with a master’s degree',                                
      all: 
        'In the United States, among people aged '+limitAge+', an estimated'+
        dataset.filter(e => e.attribution === 'deaf' & 
          e.status !== 'no HS diploma' &  
          e.type === 'education' & 
          e.state === 'United States').map(
          function(e, index){ return index === 0 ? 
          ' and '+
          (e.percentage === 0 ? 'N/A of ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 ' : e.percentage + '% ')+
          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
          (e.percentage === 0 ? 'N/A of deaf people have completed ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 of deaf people have completed ' : e.percentage + '% of deaf people have completed ')+
          edulist[index] :
          ' '+e.percentage+'% '+edulist[index]}).reverse()+
        ', compared to '+
        dataset.filter(e => e.attribution === 'hearing' & 
          e.status !== 'no HS diploma' & 
          e.type === 'education' & 
          e.state === 'United States').map(
          function(e, index){ return index === 0 ? 
          ' and '+
          (e.percentage === 0 ? 'N/A of ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 ' : e.percentage + '% ')+
          edulist[index] : edulist[edulist.length - 1] === edulist[index] ? ' '+
          (e.percentage === 0 ? 'N/A of hearing people have completed ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 of hearing people have completed ' : e.percentage + '% of hearing people have completed ')+
          edulist[index] :
          ' '+e.percentage+'% '+edulist[index]}).reverse(),
      every_class: 
        'In the United States, among people aged '+limitAge+', an estimated'+
        dataset.filter(e => e.attribution === 'deaf' & 
          e.type === 'cow' & 
          e.state === 'United States').sort(
            (a, b) => statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status)
          ).map(
          function(e, index){ return index === 0 ? 
          ' and '+
          (e.percentage === 0 ? 'N/A of ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 ' : e.percentage + '% ')+
          cowLabels[index] : cowLabels[cowLabels.length - 1] === cowLabels[index] ? ' '+
          (e.percentage === 0 ? 'N/A of deaf people are ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 of deaf people are ' : e.percentage + '% of deaf people are ')+
          cowLabels[index] :
          ' '+e.percentage+'% '+cowLabels[index]}).reverse()+
        ', compared to '+
        dataset.filter(e => e.attribution === 'hearing' & 
          e.type === 'cow' & 
          e.state === 'United States').sort(
            (a, b) => statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status)
          ).map(
          function(e, index){ return index === 0 ? 
          ' and '+
          (e.percentage === 0 ? 'N/A of ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 ' : e.percentage + '% ')+
          cowLabels[index] : cowLabels[cowLabels.length - 1] === cowLabels[index] ? ' '+
          (e.percentage === 0 ? 'N/A of hearing people are ' : ((e.margin_errors/100)/1.962937)/(e.percentage/100) > 0.3 ? e.percentage + '% \u26a0 of hearing people are ' : e.percentage + '% of hearing people are ')+
          cowLabels[index] :
          ' '+e.percentage+'% '+cowLabels[index]}).reverse()
    }[chartType]

    return{
      content: series.length === 0 ? 'No data is available for the current selection. Try adjusting your selections or removing filters.' : content,
      add_stop: this._wordCounter(content+' '+useCitation[2])
    }
  }

  getSampleInfo = () => {
    const { series, metric } = this.preparedData;
    const { state, openAccordion, chartType } = this.config;

    const defineSampleSize = (x) => {
      return(x > 351 ? x.toLocaleString('en-US') : '351 or less')
    }

    const info = ['all','most_popular','every_class'].includes(chartType) 
      ? series.flatMap((seriesData, index) => {
          if (!seriesData || seriesData.length === 0) return [];

          const aggregated = seriesData.reduce(
            (acc, e) => {
              const errorVal = (metric === 'percentage' && e?.percentage === 0) ||  (metric === 'median_income' && e?.median_income === 0) 
                ? null : e?.margin_errors;
              const hasError = typeof errorVal === 'number';

              return {
                denominator: e?.denominator ?? 0,
                error: {
                  min: hasError ? Math.min(acc.error.min, errorVal) : acc.error.min,
                  max: hasError ? Math.max(acc.error.max, errorVal) : acc.error.max
                }
              };
            },
            {
              denominator: 0,
              error: { min: Infinity, max: 0 }
            }
          );

          const { min, max } = aggregated.error;
          const hasValidError = min !== Infinity;

          const errorDisplay = !hasValidError
            ? 'N/A'
            : min === max
              ? metric === 'percentage' ? `${min}%` : `$${this._round(min)}`
              : metric === 'percentage' ? `${min}%–${max}%` : `$${this._round(min)}–$${this._round(max)}`;

          return [{
            denominator: defineSampleSize(aggregated.denominator),
            group: index === 0 ? 'deaf people' : 'hearing people',
            error: errorDisplay
          }];
        })
      : chartType === 'spline' 
        ? series.flatMap((seriesData, index) => {
            if (!seriesData || seriesData.length === 0) return [];
            const aggregated = seriesData.reduce(
              (acc, e) => {
                const denominatorVal = !e?.denominator ? null : e.denominator > 351 ? e.denominator : 351;
                const errorVal = (metric === 'percentage' && e?.percentage === 0) ||  (metric === 'median_income' && e?.median_income === 0) 
                  ? null : e?.margin_errors;
                const hasError = typeof errorVal === 'number';

                return {
                  denominator: {
                    minDenominator: denominatorVal? Math.min(acc.denominator.minDenominator, denominatorVal) : acc.denominator.minDenominator,
                    maxDenominator: denominatorVal? Math.max(acc.denominator.maxDenominator, denominatorVal) : acc.denominator.maxDenominator,
                  },
                  error: {
                    minError: hasError ? Math.min(acc.error.minError, errorVal) : acc.error.minError,
                    maxError: hasError ? Math.max(acc.error.maxError, errorVal) : acc.error.maxError
                  }
                };
              },
              {
                denominator: {minDenominator: Infinity, maxDenominator: 0},
                error: { minError: Infinity, maxError: 0 }
              }
            );

            const { minDenominator, maxDenominator } = aggregated.denominator;
            const hasValidDenominator = minDenominator !== Infinity;

            const denominatorDisplay = !hasValidDenominator
              ? 'N/A'
              : minDenominator === maxDenominator
                ? `${defineSampleSize(minDenominator)}`
                : `from ${defineSampleSize(minDenominator)} to ${defineSampleSize(maxDenominator)}`;

            const { minError, maxError } = aggregated.error;
            const hasValidError = minError !== Infinity;

            const errorDisplay = !hasValidError
              ? 'N/A'
              : minError === maxError
                ? metric === 'percentage' ? `${minError}%` : `$${this._round(minError)}`
                : metric === 'percentage' ? `${minError}%–${maxError}%` : `$${this._round(minError)}–$${this._round(maxError)}`;

            return [{
              denominator: denominatorDisplay,
              group: index === 0 ? 'deaf people' : 'hearing people',
              error: errorDisplay
            }];
          })
        : openAccordion
          ? series.flatMap(seriesData =>
              seriesData.map(e => ({
                denominator: defineSampleSize(e?.denominator),
                group: e?.readable,
                error: e?.margin_errors + '%'
              }))
            )
          : series.flatMap((seriesData, index) => {
              if (!seriesData || seriesData.length === 0) return [];

              const aggregated = seriesData.reduce(
                (acc, e) => {
                  const errorVal = (metric === 'percentage' && e?.percentage === 0) ||  (metric === 'median_income' && e?.median_income === 0) 
                    ? null : e?.margin_errors;
                  const hasError = typeof errorVal === 'number';

                  return {
                    denominator: acc.denominator + (e?.denominator ?? 0),
                    error: {
                      min: hasError ? Math.min(acc.error.min, errorVal) : acc.error.min,
                      max: hasError ? Math.max(acc.error.max, errorVal) : acc.error.max
                    }
                  };
                },
                {
                  denominator: 0,
                  error: { min: Infinity, max: 0 }
                }
              );

              const { min, max } = aggregated.error;
              const hasValidError = min !== Infinity;

              const errorDisplay = !hasValidError
                ? 'N/A'
                : min === max
                  ? metric === 'percentage' ? `${min}%` : `$${this._round(min)}`
                  : metric === 'percentage' ? `${min}%–${max}%` : `$${this._round(min)}–$${this._round(max)}`;

              return [{
                denominator: defineSampleSize(aggregated.denominator),
                group: index === 0 ? 'deaf people' : 'hearing people',
                error: errorDisplay
              }];
            });

    const regex = /from/i;

    if(info.length > 1){
      return `In this chart, estimates are based on ${regex.test(info[0]?.denominator) ? 'the sample sizes ranging' : 'a sample size of'} ${info[0]?.denominator} ${info[0]?.group} and ${info[1]?.denominator} ${info[1]?.group} in ${state === 'United States' ? 'the ' : ''}${state} who participated ${chartType === 'spline' ? `from ${acs_one_year-9} to ${acs_one_year} American Community Surveys` : `in the ${acs_one_year} American Community Survey`}. The margins of error are ${info[0]?.error} for ${info[0]?.group} and ${info[1]?.error} for ${info[1]?.group}.`;
    }else if(info.length === 1){
      return `In this chart, estimate is based on ${regex.test(info[0]?.denominator) ? 'the sample sizes ranging' : 'a sample size of'} ${info[0]?.denominator} ${info[0]?.group} in ${state === 'United States' ? 'the ' : ''}${state} who participated ${chartType === 'spline' ? `from ${acs_one_year-9} to ${acs_one_year} American Community Surveys` : `in the ${acs_one_year} American Community Survey`}. The margin of error is ${info[0]?.error}.`;
    }else{  
      return '';
    }
  };

  // Construct chart options for Highcharts
  chart = () => {
    const self = this;
    let definedCaption = '';
    const { series, inverted, metric, categories, maxY, minY } = this.preparedData;
    const { state, maintitle, caption, status, colorfill, isExportingEnabled, chartType, titleBy, openAccordion } = this.config;
    const colNum = this._defineColorNum();

    // If no data 
    if(series.length === 0){
      const noData = {
        title: {
          text: ''
        },
        series: [{
          type: 'column',
          name: '',
          data: [],
          color: 'var(--unselected_tab_color)',
          borderColor: 'var(--unselected_tab_color)',
        }],
        xAxis: {
          title: {
            text: null
          },
        },
        yAxis: {
          title: {
            text: null
          },
        },
        credits: {
          enabled: false
        },
        lang: {
          noData: 'No data'
        },
        legend: {
          align: 'center',
          verticalAlign: 'top',
        },
        noData: {
          position: {
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y: 0,
          },
          style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: 'var(--unselected_tab_color)'
          }
        },
        exporting: {
          enabled: false
        }
      }
      return(noData);
    }
    
    const visible = categories.length > 0 || ['all','most_popular','every_class'].includes(chartType) || !openAccordion;
    const { add_stop, content } = this.getContent();
    
    if(['all','every_class'].includes(chartType)){
      definedCaption = `${caption}${state === 'United States' ? ' in the ' : ' in '}${state} (${state === 'United States' ? acs_one_year : (acs_one_year-4)+'-'+acs_one_year })` 
    }else if(chartType === 'spline'){
      definedCaption = `${caption} by Year ${state === 'United States' ? ' in the ' : ' in '}${state} (${(acs_one_year-9)+'-'+acs_one_year })`
    }else if(chartType === 'levels'){
      definedCaption = `${caption} by Level of Education ${state === 'United States' ? ' in the ' : ' in '}${state} (${(acs_one_year-9)+'-'+acs_one_year })`
    }else if(openAccordion){
      definedCaption = `${caption}${state === 'United States' ? ' in the ' : ' in '}${state} (${state === 'United States' ? acs_one_year : (acs_one_year-4)+'-'+acs_one_year })` 
    }else{
      definedCaption = `${caption}${titleBy}${state === 'United States' ? ' in the ' : ' in '}${state} (${state === 'United States' ? acs_one_year : (acs_one_year-4)+'-'+acs_one_year })`
    }

    // Define series
    const seriesConfig = series.map((seriesData, index) => {
      const seriesPlot = {
        id: `main-series-${index}`,
        name: ['all','popular','every_class','levels'].includes(chartType) && index === 0 
          ? 'deaf' :
            ['all','popular','every_class','levels'].includes(chartType) && index === 1 
            ? 'hearing'
            : chartType === 'spline' || openAccordion
              ? series[index][0]?.attribution
              : index === 0 
                ? 'deaf' : 'hearing',
        type: ['levels','spline'].includes(chartType) ? 'spline' : 'column',
        color: colorfill[colNum[index]],
        borderColor: colorfill[colNum[index]-2],
        borderWidth: 1,
        data: seriesData?.map(e => [e?.year || e?.label,e?.[metric || 'percentage']]) || [],
        dataLabels: {
          enabled: true,
          formatter: function () {
            return self._dataLabelFormatter({y: this.y, name: this.series.name});
          }
        },
        enableMouseTracking: true,
        showInLegend: true,
        ...(['spline','levels'].includes(chartType)
        ? {
            marker: {
              enabled: true,
              symbol: index === 0 ? 'diamond' : 'square'
            },
            dashStyle: index === 1 ? 'dot' : null
          }
        : {})
      };

      if (!['spline','levels'].includes(chartType)) {
        return seriesPlot;
      }

      // If chartType === 'spline', return an array with two series:
      // 1. areasplinerange (confidence interval)
      // 2. spline (main line)
      return [
        {
          linkedTo: `main-series-${index}`,
          id: `range-series-${index}`,
          name: openAccordion
              ? series[index][0]?.attribution
              : index === 0 
                ? 'deaf' : 'hearing',
          type: 'areasplinerange',
          color: colorfill[colNum[index] + 1],
          data: seriesData?.map(e => [
            e?.year || e?.label,
            this._round(e?.['percentage'] - e?.margin_errors),
            this._round(e?.['percentage'] + e?.margin_errors)
          ]) || [],
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
        seriesPlot
      ];
    })

    return {
      chart:{
        height: 330,
        inverted: inverted
      },
      legend: {
        align: 'center',
        verticalAlign: 'top',
      },
      title: {
        text: ""
      },
      credits: {
        enabled: false
      },
      exporting: {
        allowHTML: true,
        url: 'https://export.highcharts.com/',
        fallbackToExportServer: false,
        error: (_, error) => {
          console.log('Export error:', error);
        },
        sourceWidth: 1200,
        sourceHeight: 600,
        enabled: isExportingEnabled,
        buttons: {
          contextButton: {
            //text: downloadText,
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
            text: definedCaption,
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
            useHTML: true,
            text: '<p>'+content+' '+useCitation[2]+'</p>',
            verticalAlign: 'bottom',
            margin:80,
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
      },
      xAxis: {
        title: {
          text: null
        },
        type: 'category', 
        categories: chartType === 'all' && ['overall','all'].includes(status) 
          ? ['High School', "Some College", "Associate's", "Bachelor's", "Master's", "PhD, JD or MD"] 
            : chartType === 'every_class' 
              ? ['For-Profit', 'Non-Profit', "Local Gov't", "State Gov't", "Federal Gov't", "Self-Employed"] 
                : openAccordion 
                  ? [''] 
                    : categories.map(e => this._capitalize(e)),
        visible: visible,
        crosshair: visible,
        gridLineColor: '#ffffff',
        gridLineWidth: 0
      },
      yAxis: {
        min: minY,
        max: maxY,
        gridLineColor: '#ffffff',
        gridLineWidth: 0,
        title: {
          text: ''
        },
        labels: {
          overflow: 'justify',
          formatter: function() { return self._formatValue(this.value); }
        }
      },
      tooltip: {
        formatter: function() { 
          return `${this.category}<br><b>${this.series.name}:</b> ${self._formatValue(this.y)}`; 
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
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
        } // Perhaps need to fix that...
      },
      series: ['spline','levels'].includes(chartType) ? seriesConfig.flat() : seriesConfig,
    }
  }
}

class HighChartEngine extends customHighCharts {
  constructor(options) {
    super(options);
  }

  getChartOptions = () => {
    return this.chart();
  }

  getStatContent = () => {
    return this.getContent();
  }

  getSampleContent = () => {
    return this.getSampleInfo();
  }

  showWarningSign = () => {
    return this.getWarning();
  }
}

export const useHighChart = (options) => {
  const engine = useMemo(() => {
    return new HighChartEngine(options);
  },[options]);

  const { content } = engine.getStatContent();

  return {
    chart: engine.getChartOptions(),
    content,
    sample: engine.getSampleContent(),
    warning: engine.showWarningSign(),
  }
}