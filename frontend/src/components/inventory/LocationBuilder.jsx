import React, { useState } from 'react';
import { Button, TextField, MenuItem, IconButton, FormControl, InputLabel, Select, Container, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { globalColors } from '../../constants/Styles';
import axios from 'axios';

const LocationBuilder = ({ onOk, onCancel }) => {
  const [locationType, setLocationType] = useState(null);
  const [buildingDetails, setBuildingDetails] = useState({ name: '', description: '', sections: [] });

  const handleBuildingChange = (key, value) => {
    if (key === 'type') setLocationType(value);

    setBuildingDetails(prevDetails => {
      const updatedDetails = { ...prevDetails, [key]: value };

      console.log(updatedDetails);

      return updatedDetails;
    });
  };

  const handleSectionUpdate = (index, key, value) => {
    setBuildingDetails(prevDetails => {
      const updatedSections = [...prevDetails.sections];
      if (!updatedSections[index]) {
        updatedSections[index] = { rows: [] };
      }
      updatedSections[index][key] = value;

      const updatedDetails = { ...prevDetails, sections: updatedSections };
      console.log(updatedDetails);
      return updatedDetails;
    });
  };

  const handleRowUpdate = (sectionIndex, rowIndex, rowsCount) => {
    setBuildingDetails(prevDetails => {
      const updatedSections = [...prevDetails.sections];
      const section = updatedSections[sectionIndex] || { rows: [] };

      section.rows[rowIndex] = { shelves: Array(rowsCount).fill({ bins: 1 }) };

      updatedSections[sectionIndex] = section;

      const updatedDetails = { ...prevDetails, sections: updatedSections };
      console.log(updatedDetails);
      return updatedDetails;
    });
  };

  const handleRemoveSection = sectionIndex => {
    const updatedSections = buildingDetails.sections.filter((_, index) => index !== sectionIndex);
    setBuildingDetails(prevDetails => ({ ...prevDetails, sections: updatedSections }));
  };

  const handleRemoveRow = (sectionIndex, rowIndex) => {
    const updatedSections = buildingDetails.sections.map((section, sIndex) => {
      if (sIndex === sectionIndex) {
        return { ...section, rows: section.rows.filter((_, rIndex) => rIndex !== rowIndex) };
      }
      return section;
    });
    setBuildingDetails(prevDetails => ({ ...prevDetails, sections: updatedSections }));
  };

  const handleRemoveShelf = (sectionIndex, rowIndex, shelfIndex) => {
    const updatedSections = buildingDetails.sections.map((section, sIndex) => {
      if (sIndex === sectionIndex) {
        return {
          ...section,
          rows: section.rows.map((row, rIndex) => {
            if (rIndex === rowIndex) {
              return { ...row, shelves: row.shelves.filter((_, shIndex) => shIndex !== shelfIndex) };
            }
            return row;
          }),
        };
      }
      return section;
    });
    setBuildingDetails(prevDetails => ({ ...prevDetails, sections: updatedSections }));
  };

  const handleShelfUpdate = (sectionIndex, rowIndex, shelfIndex, binsCount) => {
    setBuildingDetails(prevDetails => {
      const updatedSections = [...prevDetails.sections];
      const section = updatedSections[sectionIndex];
      const row = section.rows[rowIndex];

      row.shelves[shelfIndex] = { bins: binsCount };

      const updatedDetails = { ...prevDetails, sections: updatedSections };
      console.log(updatedDetails);
      return updatedDetails;
    });
  };

  const handleFormSubmit = () => {
    console.log("Building Details:", buildingDetails);

    axios.post('/api/locations/create', buildingDetails)
      .then(response => {
        console.log("Success:", response.data);
        onOk();
      })
      .catch(error => {
        console.error("Error:", error);
      });

    setBuildingDetails({ name: '', description: '', sections: [] });
  };

  const handleFormCancel = () => {
    setBuildingDetails({ name: '', description: '', sections: [] });
    onCancel(); // Close the modal
  };

  return (
    <Container maxWidth="xl" style={{ minWidth: '80vw', minHeight: '80vh', margin: '0 auto', padding: 0 }}>
      <Box component="form" style={{ minWidth: '80vw', minHeight: '80vh', margin: '0 auto', padding: 0 }}>
        <Box display="flex" justifyContent="space-between" marginBottom="8px">
          <TextField
            label="Building Name"
            fullWidth
            margin="normal"
            value={buildingDetails.name}
            onChange={e => handleBuildingChange('name', e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="location-type-label">Type</InputLabel>
            <Select
              labelId="location-type-label"
              id="location-type"
              value={locationType}
              label="Type"
              onChange={e => handleBuildingChange('type', e.target.value)}
              required
            >
              <MenuItem value="Warehouse">Warehouse</MenuItem>
              <MenuItem value="Vendor">Vendor</MenuItem>
              <MenuItem value="Retailer">Retailer</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TextField
          label="Building Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={buildingDetails.description}
          onChange={e => handleBuildingChange('description', e.target.value)}
        />
        {locationType === 'Warehouse' && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBuildingChange('sections', [...buildingDetails.sections, { name: '', rows: [] }])}
              style={{ backgroundColor: globalColors.primary, color: 'white', marginBottom: 8 }}
            >
              Add Section
            </Button>
            <Box
              display="grid"
              gridAutoFlow="column"
              gridTemplateColumns="repeat(auto-fill, minmax(20vw, 1fr))"
              gridAutoColumns="20vw"
              gap="8px"
              overflow="auto"
              maxHeight="50vh"
            >
              {buildingDetails.sections.map((section, sectionIndex) => (
                <Box key={sectionIndex} marginBottom="8px">
                  <TextField
                    label={`Section ${sectionIndex + 1} Name`}
                    fullWidth
                    margin="normal"
                    value={section.name}
                    onChange={e => handleSectionUpdate(sectionIndex, 'name', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => handleRemoveSection(sectionIndex)} style={{ color: 'red' }}>
                          <Close />
                        </IconButton>
                      ),
                    }}
                  />
                  {section.rows.map((row, rowIndex) => (
                    <Box key={rowIndex} marginBottom="8px" paddingLeft="24px">
                      <TextField
                        label={`Number of Shelves in Row ${rowIndex + 1}`}
                        type="number"
                        InputProps={{
                          inputProps: { min: 1 },
                          endAdornment: (
                            <IconButton onClick={() => handleRemoveRow(sectionIndex, rowIndex)} style={{ color: 'red' }}>
                              <Close />
                            </IconButton>
                          ),
                        }}
                        fullWidth
                        margin="normal"
                        value={row.shelves.length}
                        onChange={e => handleRowUpdate(sectionIndex, rowIndex, e.target.value)}
                      />
                      {row.shelves.map((shelf, shelfIndex) => (
                        <Box key={shelfIndex} marginBottom="8px" paddingLeft="24px">
                          <TextField
                            label={`Number of Bins in Shelf ${shelfIndex + 1}`}
                            type="number"
                            InputProps={{
                              inputProps: { min: 1 },
                              endAdornment: (
                                <IconButton onClick={() => handleRemoveShelf(sectionIndex, rowIndex, shelfIndex)} style={{ color: 'red' }}>
                                  <Close />
                                </IconButton>
                              ),
                            }}
                            fullWidth
                            margin="normal"
                            value={shelf.bins}
                            onChange={e => handleShelfUpdate(sectionIndex, rowIndex, shelfIndex, e.target.value)}
                          />
                        </Box>
                      ))}
                    </Box>
                  ))}
                  <Button onClick={() => handleSectionUpdate(sectionIndex, 'rows', [...section.rows, { shelves: [{ bins: 1 }] }])}>
                    Add Row to Section {sectionIndex + 1}
                  </Button>
                </Box>
              ))}
            </Box>
          </>
        )}
        <Box display="flex" justifyContent="space-between" marginTop="16px">
          <Button variant="contained" color="secondary" onClick={handleFormSubmit}>
            OK
          </Button>
          <Button variant="contained" color="primary" onClick={handleFormCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LocationBuilder;