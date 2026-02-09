import {useMemo, useState} from 'react';
//Widget
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, flexRender, //ColumnDef
} from '@tanstack/react-table';

// Data
import occupation from '../../data/occupation.json'
import '../../assets/styles/table.css'

/*Icons and fonts*/
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Ancillary Functions
function processData(jsonData) {
  return Object.keys(jsonData).map((key) => { 
    return jsonData[key];
  });
}

function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}


function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter)
  const onChange = debounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

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
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const data = useMemo(() => processData(occupation), []);

  const columns = useMemo(() => [
    {
      id: 'occupation',
      header: "Occupation",
      accessorKey: 'occupation',
    },
    {
      id: "employed_deaf",
      header: ' deaf',
      accessorKey: 'percent of total employed',
      cell: (info) => {
        const value = info.getValue() || 0;
        return(
          <>
            {value === 0 ? '' : value+'%'}
            <div className = 'td-percentage-container'>
              <div className = 'td-percentage-deaf' style = {{width: value}}/>
            </div> 
          </>
        )
        }
    },
    {
      id: "employed_hearing",
      header: ' hearing',
      accessorKey: 'percent of total employed_hearing',
      cell: (info) => {
        const value = info.getValue() || 0;
        return (
          <>
            {value === 0 ? '' : value+'%'}
            <div className = 'td-percentage-container'>
              <div className = 'td-percentage-hearing' style = {{width: value}}/>
            </div> 
          </>
        );
      }
    },
    {
      id: "BA_deaf",
      header: 'deaf',
      accessorKey: 'BA',
      cell: (info) => {
        const value = info.getValue() || 0;
        return (
          <>
            {value === 0 ? '' : value+'%'}
            <div className = 'td-percentage-container'>
              <div className = 'td-percentage-deaf' style = {{width: value}}/>
            </div> 
          </>
        );
      }
    },
    {
      id: "BA_hearing",
      header: 'hearing',
      accessorKey: 'BA_hearing',
      cell: (info) => {
        const value = info.getValue() || 0;
        return (
          <>
            {value === 0 ? '' : value+'%'}
            <div className = 'td-percentage-container'>
              <div className = 'td-percentage-hearing' style = {{width: value}}/>
            </div> 
          </>
          );
      }
    },
    {
      id: 'salary_deaf',
      header: 'deaf ',
      accessorKey: 'median salary',
      cell: (info) => {
        const value = info.getValue() || 0;
        return value.toLocaleString('en-US', {
          style: 'currency',currency: 'USD',
          maximumFractionDigits: 0, 
          minimumFractionDigits: 0
        });
      }
    },
    {
      id: 'salary_hearing',
      header: 'hearing ',
      accessorKey: 'median salary_hearing',
      cell: (info) => {
        const value = info.getValue() || 0;
        return value.toLocaleString('en-US', {
          style: 'currency',currency: 'USD',
          maximumFractionDigits: 0, 
          minimumFractionDigits: 0
        });
      }
    },
  ], []);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data, columns,
    state: {
      sorting, globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tState = table.getState();

  return (
     <div>
      <div className = 'table_interface'>
        <GlobalFilter
          globalFilter={tState.globalFilter}
          setGlobalFilter={(val) => table.setGlobalFilter(val)}
        />
      </div>

      <table>
        <thead>
          {/* Superheader row */}
          <tr>
            <th colSpan="1" className = 'superheader'/>
            <th colSpan="2" className = 'superheader'>Total employed</th>
            <th colSpan="2" className = 'superheader'>Bachelor&apos;s or higher</th>
            <th colSpan="2" className = 'superheader'>Median earning</th>
          </tr>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {
                headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const sortToggleProps = header.column.getToggleSortingHandler();

                  return(
                    <th 
                      key={header.id}
                      className = "header"
                      onClick={sortToggleProps}
                      style = {{ cursor: "pointer" }}
                    >
                      {
                        header.isPlaceholder ?
                        null :
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      }
                      &nbsp;&nbsp;
                      <FontAwesomeIcon
                        className = 'arrow-down'
                        icon={faAngleDown}
                        style = {{ transform: isSorted
                          ? isSorted === 'desc'
                            ? 'rotate3d(1,0,0,180deg)'
                            : 'rotate3d(1,0,0,0deg)'
                          : 'rotate3d(1,0,0,90deg)'
                        }}
                      />

                    </th>
                  )
                })
              }
            </tr>
          ))}
        </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className = "row-color">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style = {{ padding: "12px 15px" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
         </tbody>
       </table>
     </div>
  );
}

export default Table;

/*export function Profile() {
  // ...
}*/