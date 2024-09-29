import React, { useState } from 'react';
import { Modal, Box, Radio, RadioGroup, FormControlLabel, FormControl, Button } from '@mui/material';
import { globalColors } from '../../../../constants/Styles'; 

const ColumnForm = ({ columnIndex, column, updateColumn, disabled, tables = [] }) => { // Set default empty array for tables
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');

  // Function to handle the change of column name
  const handleNameChange = (e) => {
    if (!disabled) {
      updateColumn({ ...column, name: e.target.value });
    }
  };

  // Function to handle the change of column type
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    if (newType === 'relationship') {
      setShowRelationshipModal(true);
    } else if (!disabled) {
      updateColumn({ ...column, type: newType });
    }
  };

  // Function to close the relationship modal
  const handleCloseRelationshipModal = () => {
    setShowRelationshipModal(false);
    setSelectedTable('');
  };

  // Function to handle table selection in relationship modal
  const handleSelectTable = () => {
    if (selectedTable) {
      updateColumn({ ...column, type: 'relationship', references: selectedTable });
      handleCloseRelationshipModal();
    }
  };

  return (
    <div className="column-form" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input
        type="text"
        value={column.name}
        onChange={handleNameChange}
        placeholder="Column Name"
        style={{ flex: 2, marginRight: '10px' }}
        disabled={disabled}
      />
      <select
        value={column.type}
        onChange={handleTypeChange}
        style={{ flex: 1 }}
        disabled={disabled}
      >
        <option value="string">String</option>
        <option value="integer">Integer</option>
        <option value="boolean">Boolean</option>
        <option value="timestamp">Timestamp</option>
        <option value="bigint(20) unsigned">BigInt(20) Unsigned</option>
        {tables.length >= 2 && <option value="relationship">Relationship</option>}
      </select>

      {/* Modal for selecting a table relationship */}
      <Modal open={showRelationshipModal} onClose={handleCloseRelationshipModal}>
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
          <h3>Select Table for Relationship</h3>
          <FormControl component="fieldset">
            <RadioGroup
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              {tables.map((table) => (
                <FormControlLabel
                  key={table.name} // Add a unique key prop
                  value={table.name}
                  control={<Radio />}
                  label={table.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Button
            onClick={handleSelectTable}
            variant="contained"
            style={{ backgroundColor: globalColors.primary, color: '#fff', marginTop: '20px' }}
            fullWidth
            disabled={!selectedTable}
          >
            Select
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ColumnForm;
