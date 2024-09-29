import React, { useState } from 'react';
import './Table.css';

const Table = ({
  columns,
  data,
  overflowY = 'scroll',
  rowStyle = { maxHeight: '40px' },
  expandedAreaStyle = { minHeight: '18vh', width: '100%' }, // Adjusted minHeight as per requirement
  borderStyle,
  rowBackgroundColor = 'white',
  alternateRowBackgroundColor = 'white',
  showSearchBar = false,
  searchBarAlignment = 'left',
  componentHeight,
  tableHeight,
  expandable = false,
  renderExpandedArea, // New prop for custom rendering of expanded area
}) => {
  const [expandedRows, setExpandedRows] = useState(data.map(() => false));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRowExpansion = (rowIndex) => {
    setExpandedRows(current => current.map((expanded, i) => (i === rowIndex ? !expanded : expanded)));
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(
      value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ height: componentHeight, overflowY: 'auto', padding: '10px', width: '100%' }}>
      {showSearchBar && (
        <div style={{ textAlign: searchBarAlignment, marginTop: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minHeight: '35px' }}
          />
        </div>
      )}
      <div className={`custom-table-wrapper`} style={{ overflowY }}>
        <table className="custom-table" style={{ height: tableHeight }}>
          <thead>
            <tr>
              {expandable && <th style={{ border: borderStyle }}></th>} 
              {columns.map((column, index) => (
                <th key={index} style={{ width: column.width, border: borderStyle }}>
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr
                  className={`custom-table-row ${rowIndex % 2 === 0 ? 'row-background' : 'alternate-row-background'}`}
                  style={{
                    ...rowStyle,
                    backgroundColor: rowIndex % 2 === 0 ? rowBackgroundColor : alternateRowBackgroundColor
                  }}
                >
                  {expandable && (
                    <td className={`custom-table-cell expansion-control-cell`} style={{ border: borderStyle }}>
                      <div
                        className={`arrow ${expandedRows[rowIndex] ? 'up' : 'down'}`}
                        onClick={() => toggleRowExpansion(rowIndex)}
                        style={{ cursor: 'pointer', margin: 'auto' }} /* Center the arrow within the cell */
                      ></div>
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="custom-table-cell" style={{ border: borderStyle }}>
                      <div className="cell-content">
                        {React.isValidElement(row[column.dataIndex]) ? 
                          row[column.dataIndex] : 
                          <span>{row[column.dataIndex]}</span>
                        }
                      </div>
                    </td>
                  ))}
                </tr>
                {expandable && expandedRows[rowIndex] && (
                  <tr className="custom-table-expanded-row">
                    <td colSpan={columns.length + 1} style={expandedAreaStyle}>
                      {renderExpandedArea ? renderExpandedArea(row, rowIndex) : null}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
