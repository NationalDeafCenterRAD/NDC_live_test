import React, {useMemo, useState} from 'react';
//Widget
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table';
import {CSVLink} from 'react-csv';
// Data
import occupation from './assets/occupation.json'
//Table Style
import './table.css'

/*Icons and fonts*/
import 'font-awesome/css/font-awesome.min.css';
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import FontAwesome from 'react-fontawesome';

// Refactor this coding developed by Eugene Stepnov in December 2021 at React Table Guide and Best React Table Examples
function processData(jsonData) {
  const result = Object.keys(jsonData).map((key) => { 
    return jsonData[key];
  });
  return result;
}

function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}) {
 const [value, setValue] = useState(globalFilter)
 const onChange = useAsyncDebounce(value => {
   setGlobalFilter(value || undefined)
 }, 200)

 return (
    <div className = 'table_interface'>
      <input value={value || ""}
       onChange={e => {
         setValue(e.target.value);
         onChange(e.target.value);
       }}
       placeholder={`Filter By...`}
       style={{
         fontSize: '18px',
         fontFamily: 'Roboto'
       }}
       className = 'Filter_By'
      />
    </div>
 )
}

// Define a default UI for filtering
function Table() {
  const data = useMemo(() => processData(occupation), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Attribution',
        accessor: 'attribution', // accessor is the "key" in the data
      },
      {
        Header: 'Occupation',
        accessor: 'occupation',
      },
      {
        Header: 'Total Employed',
        accessor: row => row['percent of total employed'], // accessor is the "key" in the data
        Cell: prop => {
            return (
              <>
                {prop.value === 0 ? '— —' : prop.value+'%'}
              </>
            )
          }
      },
      {
        Header: 'BA or Higher',
        accessor: row => row['BA'],
        Cell: prop => {
            return (
              <>
                {prop.value === 0 ? '' : prop.value+'%'}
                <div class = 'td-percentage-container'>
                  <div class = 'td-percentage' style = {{width: prop.value}}/>
                </div> 
              </>
              );
          }
      },
      {
        Header: 'Median Salary',
        accessor: row => row['median salary'].toLocaleString('en-US', {
            style: 'currency',currency: 'USD',
            maximumFractionDigits: 0, 
            minimumFractionDigits: 0
        }),
      },
     ],
     []
  )

 const {
   getTableProps,
   headerGroups,
   rows,
   prepareRow,
   state,
   preGlobalFilteredRows,
   setGlobalFilter,
 } = useTable(
   {
     columns,
     data
   },
   useFilters,
   useGlobalFilter,
   useSortBy
 );

 return (
     <div>
      <div class = 'table_interface'>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <svg width="50px" height="50px" viewBox="0 0 260 236" preserveAspectRatio="xMidYMax meet" className = 'svg-container'>
          <g transform="translate(0.000000,236.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
            <CSVLink filename={"NDC_employment.csv"} data={data} style = {{padding: 50}}>
              <rect width="2500" height="2000" className = 'svg-rect'/>
              <path className = 'svg-download' d="M 1224 1506 c -47 -21 -55 -9 -54 -261 l 0 -183 l -37 19 c -63 32 -123 -4 -123 -74 c 0 -37 8 -47 125 -166 l 125 -126 l 125 126 c 117 119 125 129 125 166 c 0 70 -60 106 -123 74 l -37 -19 l 0 183 c -4 261 -7 240 -56 261 c -34 7 -36 8 -70 0 z M 783 736 c -26 -23 -28 -28 -31 -130 l -4 -106 l 512 0 l 512 0 l -4 106 c -3 102 -5 107 -31 130 c -16 13 -41 24 -56 24 c -35 0 -81 -35 -81 -61 c 0 -18 -11 -19 -340 -19 c -329 0 -340 1 -340 19 c 0 26 -46 61 -81 61 c -15 0 -40 -11 -56 -24 z"/>
            </CSVLink>
          </g>
        </svg>
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className = 'header'
                  {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    &nbsp;&nbsp;
                    <FontAwesome
                    name = 'angle-down'
                    className = 'arrow-down'
                    style = {{ transform: column.isSorted
                      ? column.isSortedDesc
                      ? 'rotate3d(0,0,1,180deg)':
                      'rotate3d(0,0,1,0deg)':
                      'rotate3d(1,1,1,120deg)'}}/>
                </th>
              ))}
            </tr>
          ))}
        </thead>
          <tbody>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className = 'row-color'>
                  {row.cells.map(cell => {
                    return (
                       <td style = {{padding: '12px 15px'}}>
                          {cell.render('Cell')}
                       </td>
                   )
                 })}
               </tr>
           )
         })}
         </tbody>
       </table>
     </div>
 );
}

export default Table;