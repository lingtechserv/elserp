import React, { useState } from 'react';
import ColumnForm from './ColumnForm';
import { globalColors } from '../../../../constants/Styles'; 
import DeleteIcon from '@mui/icons-material/Delete';

const TableForm = ({ tableIndex, table, updateTable, existingSchema, onDeleteTable, tables }) => {
  const [tableName, setTableName] = useState(table.name);
  const [columns, setColumns] = useState(table.columns);

  // Function to update the table name
  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
    updateTable(tableIndex, { ...table, name: e.target.value });
  };

  // Function to add a column
  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'string' }]);
  };

  // Function to update column data
  const updateColumn = (colIndex, updatedColumn) => {
    const newColumns = [...columns];
    newColumns[colIndex] = updatedColumn;
    setColumns(newColumns);
    updateTable(tableIndex, { ...table, columns: newColumns });
  };

  return (
    <div className="table-form" style={{ width: '350px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
      <input
        type="text"
        value={tableName}
        onChange={handleTableNameChange}
        placeholder="Table Name"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <div className="columns">
        <h4>Columns</h4>
        {columns.map((col, index) => (
          <ColumnForm
            key={index}
            columnIndex={index}
            column={col}
            updateColumn={(updatedColumn) => updateColumn(index, updatedColumn)}
            disabled={col.immutable || col.editable === false}
            tables={tables} // Ensure tables are passed properly
          />
        ))}
        {!columns.some(col => col.immutable) && (
          <button
            onClick={addColumn}
            style={{
              marginTop: '10px',
              backgroundColor: globalColors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Add Column
          </button>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDeleteTable(table.name)}
        style={{
          marginTop: '10px',
          backgroundColor: 'red',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px'
        }}
      >
        <DeleteIcon style={{ marginRight: '5px' }} /> Delete
      </button>
    </div>
  );
};

export default TableForm;
