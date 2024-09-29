import React, { useState, useEffect } from 'react';
import { useSchema } from '../../../../contexts/SchemaContext';
import TableForm from './TableForm';
import { globalColors } from '../../../../constants/Styles';
import { Modal, Box, Button, ButtonGroup, TextField, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';

const TableBuilder = () => {
  const { schemaData, buildTables } = useSchema(); // Import buildTables from context
  const [tables, setTables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [mode, setMode] = useState('New');
  const [newTableName, setNewTableName] = useState('');
  const [selectedExistingTable, setSelectedExistingTable] = useState('');
  const [selectedPivotTables, setSelectedPivotTables] = useState([]);
  const [isPivotOptionEnabled, setIsPivotOptionEnabled] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Function to handle opening the modal
  const handleOpenModal = () => setModalOpen(true);

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewTableName('');
    setSelectedExistingTable('');
    setSelectedPivotTables([]);
    setMode('New');
  };

  // Function to open the delete confirmation modal
  const handleOpenDeleteModal = (tableName) => {
    setTableToDelete(tableName);
    setDeleteModalOpen(true);
    setDeleteConfirmation('');
  };

  // Function to close the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setTableToDelete(null);
    setDeleteModalOpen(false);
    setDeleteConfirmation('');
  };

  // Function to normalize table name
  const normalizeTableName = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  };

  // Function to handle adding a new table
  const handleAddTable = () => {
    if (mode === 'New' && newTableName) {
      const normalizedTableName = normalizeTableName(newTableName);
      setTables([...tables, { name: normalizedTableName, columns: [], relationships: [] }]);
    } else if (mode === 'Existing' && selectedExistingTable) {
      const existingTable = schemaData.find(table => table.name === selectedExistingTable);
      if (existingTable) {
        setTables([...tables, existingTable]);
      }
    } else if (mode === 'Pivot' && selectedPivotTables.length === 2) {
      const [table1, table2] = selectedPivotTables;
      const pivotTableName = `${table1}_${table2}`;
      const pivotTableColumns = [
        {
          name: `${table1}_id`,
          type: 'bigint(20) unsigned',
          immutable: true,
          editable: false,
        },
        {
          name: `${table2}_id`,
          type: 'bigint(20) unsigned',
          immutable: true,
          editable: false,
        }
      ];
      setTables([...tables, { name: pivotTableName, columns: pivotTableColumns, relationships: [] }]);
    }
    handleCloseModal();
  };

  // Function to delete a table and associated pivot tables
  const handleDeleteTable = () => {
    if (deleteConfirmation === 'DELETE' && tableToDelete) {
      const updatedTables = tables.filter(table => {
        // Remove the selected table and any pivot tables associated with it
        if (table.name === tableToDelete) return false;
        if (table.name.includes('_')) {
          const [table1, table2] = table.name.split('_');
          return table1 !== tableToDelete && table2 !== tableToDelete;
        }
        return true;
      });

      setTables(updatedTables);
      handleCloseDeleteModal();
    }
  };

  // Effect to enable the "Pivot" option only if there are at least two tables
  useEffect(() => {
    setIsPivotOptionEnabled(tables.length >= 2);
  }, [tables]);

  // Function to handle checkbox selection for pivot tables
  const handlePivotTableSelection = (tableName) => {
    if (selectedPivotTables.includes(tableName)) {
      setSelectedPivotTables(selectedPivotTables.filter((name) => name !== tableName));
    } else if (selectedPivotTables.length < 2) {
      setSelectedPivotTables([...selectedPivotTables, tableName]);
    }
  };

  // Function to prepare data and send to the context for building tables
  const handleSave = () => {
    const config = {
      config: {
        tables: tables.map(table => ({
          name: table.name,
          columns: table.columns.map(col => ({
            name: col.name,
            type: col.type
          })),
          foreign_keys: table.relationships.map(rel => ({
            column: rel.column,
            references: rel.references,
            on: rel.on
          }))
        }))
      }
    };

    buildTables(config); // Use the buildTables function from context
  };

  // useEffect to log the configuration whenever it changes
  useEffect(() => {
    const config = {
      config: {
        tables: tables.map(table => ({
          name: table.name,
          columns: table.columns.map(col => ({
            name: col.name,
            type: col.type
          })),
          foreign_keys: table.relationships.map(rel => ({
            column: rel.column,
            references: rel.references,
            on: rel.on
          }))
        }))
      }
    };
    console.log('Current configuration:', JSON.stringify(config, null, 2));
  }, [tables]);

  return (
    <div>
      <h2>Table Builder</h2>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', border: '1px solid #ccc' }}>
        {tables.map((table, index) => (
          <div key={index} style={{ minWidth: '350px', marginRight: '10px', position: 'relative' }}>
            <TableForm
              tableIndex={index}
              table={table}
              updateTable={(updatedTable) => setTables(tables.map((t, i) => (i === index ? updatedTable : t)))}
              existingSchema={schemaData}
              onDeleteTable={handleOpenDeleteModal}
              tables={tables}
            />
          </div>
        ))}
        <button
          onClick={handleOpenModal}
          style={{
            padding: '10px 20px',
            backgroundColor: globalColors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '16px',
            alignSelf: 'center'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = globalColors.primary}
        >
          + Add New Table
        </button>
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          fontSize: '16px',
        }}
      >
        Save
      </button>

      {/* Modal for Adding New Table */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: '8px' 
        }}>
          <h3>Add New Table</h3>
          <ButtonGroup variant="outlined" aria-label="outlined button group" fullWidth style={{ marginBottom: '20px' }}>
            <Button
              variant={mode === 'New' ? 'contained' : 'outlined'}
              onClick={() => setMode('New')}
            >
              New
            </Button>
            <Button
              variant={mode === 'Existing' ? 'contained' : 'outlined'}
              onClick={() => setMode('Existing')}
            >
              Existing
            </Button>
            {isPivotOptionEnabled && (
              <Button
                variant={mode === 'Pivot' ? 'contained' : 'outlined'}
                onClick={() => setMode('Pivot')}
              >
                Pivot
              </Button>
            )}
          </ButtonGroup>

          {mode === 'New' && (
            <TextField
              label="Table Name"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}

          {mode === 'Existing' && (
            <Select
              value={selectedExistingTable}
              onChange={(e) => setSelectedExistingTable(e.target.value)}
              fullWidth
              margin="normal"
            >
              {schemaData.map((table) => (
                <MenuItem key={table.name} value={table.name}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
          )}

          {mode === 'Pivot' && (
            <div>
              <p>Select two tables to create a pivot table:</p>
              {tables.map((table) => (
                <FormControlLabel
                  key={table.name}
                  control={
                    <Checkbox
                      checked={selectedPivotTables.includes(table.name)}
                      onChange={() => handlePivotTableSelection(table.name)}
                      disabled={!selectedPivotTables.includes(table.name) && selectedPivotTables.length >= 2}
                    />
                  }
                  label={table.name}
                />
              ))}
            </div>
          )}

          <Button
            onClick={handleAddTable}
            variant="contained"
            style={{ backgroundColor: globalColors.primary, color: '#fff', marginTop: '20px' }}
            fullWidth
            disabled={mode === 'Pivot' && selectedPivotTables.length !== 2}
          >
            Add Table
          </Button>
        </Box>
      </Modal>

      {/* Modal for Confirming Table Deletion */}
      <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 300, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: '8px' 
        }}>
          <h3>Confirm Delete</h3>
          <p>Type "DELETE" to confirm deletion of the table <strong>{tableToDelete}</strong>:</p>
          <TextField
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            onClick={handleDeleteTable}
            variant="contained"
            style={{ backgroundColor: 'red', color: '#fff', marginTop: '20px' }}
            fullWidth
            disabled={deleteConfirmation !== 'DELETE'}
          >
            Delete Table
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TableBuilder;
