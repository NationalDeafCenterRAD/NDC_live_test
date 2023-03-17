import React, {useMemo, useState} from 'react';
//Widget
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table';
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
        Header: "Occupation",
        accessor: 'occupation',
      },
      {
        Header: ' deaf',
        accessor: row => row['percent of total employed'],
        Cell: prop => {
            return (
              <>
                {prop.value === 0 ? '' : prop.value+'%'}
                <div className = 'td-percentage-container'>
                  <div className = 'td-percentage-deaf' style = {{width: prop.value}}/>
                </div> 
              </>
              );
          }
      },
      {
        Header: ' hearing',
        accessor: row => row['percent of total employed_hearing'],
        Cell: prop => {
            return (
              <>
                {prop.value === 0 ? '' : prop.value+'%'}
                <div className = 'td-percentage-container'>
                  <div className = 'td-percentage-hearing' style = {{width: prop.value}}/>
                </div> 
              </>
              );
          }
      },
      {
        Header: 'deaf',
        accessor: row => row['BA'],
        Cell: prop => {
            return (
              <>
                {prop.value === 0 ? '' : prop.value+'%'}
                <div className = 'td-percentage-container'>
                  <div className = 'td-percentage-deaf' style = {{width: prop.value}}/>
                </div> 
              </>
              );
          }
      },
      {
        Header: 'hearing',
        accessor: row => row['BA_hearing'],
        Cell: prop => {
            return (
              <>
                {prop.value === 0 ? '' : prop.value+'%'}
                <div className = 'td-percentage-container'>
                  <div className = 'td-percentage-hearing' style = {{width: prop.value}}/>
                </div> 
              </>
              );
          }
      },
      {
        Header: 'deaf ',
        accessor: row => row['median salary'].toLocaleString('en-US', {
            style: 'currency',currency: 'USD',
            maximumFractionDigits: 0, 
            minimumFractionDigits: 0
        }),
      },
      {
        Header: 'hearing ',
        accessor: row => row['median salary_hearing'].toLocaleString('en-US', {
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
      <div className = 'table_interface'>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      <table {...getTableProps()}>
        <thead>
          <tr>
            <th colSpan="1" className = 'superheader'></th>
            <th colSpan="2" className = 'superheader'>Total employed</th>
            <th colSpan="2" className = 'superheader'>Bachelor's or higher</th>
            <th colSpan="2" className = 'superheader'>Median earning</th>
          </tr>
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

export function Profile() {
  // ...
}