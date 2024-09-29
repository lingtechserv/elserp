import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { useInventory } from '../../../contexts/InventoryContext';
import { globalColors } from '../../../constants/Styles';

const RecipeWizard = ({ onClose }) => {
  const { recipeInventory, productInventory } = useInventory();
  const [recipeName, setRecipeName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const theme = useTheme();
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCarriers, setSelectedCarriers] = useState([]);
  const [details, setDetails] = useState({
    Density: '',
    CNTR: '',
    PG: '',
    VG: ''
  });
  const [recipeDetails, setRecipeDetails] = useState(''); 

  useEffect(() => {
    console.log(productInventory);
  }, [productInventory]);

  const handleSave = () => {
    console.log({
      recipeName,
      quantity,
      unit,
      selectedProducts,
      selectedIngredients,
      selectedCarriers,
      details,
      recipeDetails 
    });
    onClose();
  };

  const handleAddIngredient = (newIngredients) => {
    setSelectedIngredients(prevIngredients => [
      ...prevIngredients,
      ...newIngredients.map(newIngredient => ({
        basics: newIngredient,
        details: {
          Density: '',
          CNTR: '',
          PG: '',
          VG: '',
          percentage: ''
        }
      }))
    ]);
  };

  const handleAddCarrier = (newCarrier) => {
    setSelectedCarriers(prevCarriers => [
      ...prevCarriers,
      ...newCarrier.map(newCarrier => ({
        basics: newCarrier,
        details: {
          Density: '',
          CNTR: '',
          PG: '',
          VG: '',
          percentage: ''
        }
      }))
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setSelectedIngredients(prevIngredients => prevIngredients.filter((_, i) => i !== index));
  };

  const handleRemoveCarrier = (index) => {
    setSelectedCarriers(prevCarriers => prevCarriers.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{
      width: '80vw',
      height: '85vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      padding: 2,
    }}>
      <Grid container spacing={0} sx={{ height: '80vh' }}> 
        <Grid item xs={6} sx={{ height: '100%' }}> 
          <Box sx={{
            width: '100%',
            height: '100%',
            border: '1px solid #ccc',
            p: 2,
          }}>
            <Divider>Ingredients</Divider>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: '30%' }}>Ingredient</TableCell>
                    <TableCell align="center" valign="top" sx={{ width: '15%' }}>Density</TableCell>
                    <TableCell align="center" valign="top" sx={{ width: '15%' }}>CNTR</TableCell>
                    <TableCell align="center" sx={{ width: '30%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{ fontSize: 'small', marginBottom: '4px' }}>Max QTY</Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box>PG</Box>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                          <Box>VG</Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ width: '10%', mr: '5px' }} valign="top">%</TableCell>
                    <TableCell align="center">Actions</TableCell> 
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedIngredients.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ width: '30%' }}>
                        <Autocomplete
                          multiple
                          options={recipeInventory.map((option) => option.basics.name)} 
                          onChange={(event, newValues) => {
                            const newIngredients = newValues.map(name => 
                              recipeInventory.find(ingredient => ingredient.basics.name === name)
                            );
                            handleAddIngredient(newIngredients);
                          }}
                          renderInput={(params) => <TextField {...params} label="Ingredient" />}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '15%' }}>{ingredient.details.Density}</TableCell>
                      <TableCell sx={{ width: '15%' }}>{ingredient.details.CNTR}</TableCell>
                      <TableCell sx={{ width: '30%' }}>
                        <TextField
                          sx={{ width: '46%' }}
                          type="number"
                          value={ingredient.details.PG}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setSelectedIngredients(prevIngredients =>
                              prevIngredients.map(prevIngredient => {
                                if (prevIngredient.basics.id === ingredient.basics.id) {
                                  return { ...prevIngredient, details: { ...prevIngredient.details, PG: newValue } };
                                }
                                return prevIngredient;
                              })
                            );
                          }}
                          label="PG"
                          variant="standard"
                          size="small"
                        />
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <TextField
                          sx={{ width: '46%' }}
                          type="number"
                          value={ingredient.details.VG}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setSelectedIngredients(prevIngredients =>
                              prevIngredients.map(prevIngredient => {
                                if (prevIngredient.basics.id === ingredient.basics.id) {
                                  return { ...prevIngredient, details: { ...prevIngredient.details, VG: newValue } };
                                }
                                return prevIngredient;
                              })
                            );
                          }}
                          label="VG"
                          variant="standard"
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>
                        <TextField
                          type="number"
                          value={ingredient.details.percentage}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setSelectedIngredients(prevIngredients =>
                              prevIngredients.map(prevIngredient => {
                                if (prevIngredient.basics.id === ingredient.basics.id) {
                                  return { ...prevIngredient, details: { ...prevIngredient.details, percentage: newValue } };
                                }
                                return prevIngredient;
                              })
                            );
                          }}
                          label="Percent"
                          variant="standard"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveIngredient(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={() => handleAddIngredient([recipeInventory[0]])}>Add Ingredient</Button>
          </Box>
        </Grid>
        <Grid item xs={6} container direction="column" spacing={2}>
          <Grid item xs={12}> 
            <Box sx={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              p: 2,
            }}>
              <Divider>Carriers</Divider>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ width: '30%' }}>Carrier</TableCell>
                      <TableCell align="center" valign="top" sx={{ width: '15%' }}>Density</TableCell>
                      <TableCell align="center" valign="top" sx={{ width: '15%' }}>CNTR</TableCell>
                      <TableCell align="center" sx={{ width: '30%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Box sx={{ fontSize: 'small', marginBottom: '4px' }}>Max QTY</Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>PG</Box>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                            <Box>VG</Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ width: '10%', mr: '5px' }} valign="top">%</TableCell>
                      <TableCell align="center">Actions</TableCell> 
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedCarriers.map((carrier, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ width: '30%' }}>
                          <Autocomplete
                            multiple
                            options={productInventory.map((option) => option.basics.name)} 
                            onChange={(event, newValues) => {
                              const newCarriers = newValues.map(name => 
                                productInventory.find(carrier => carrier.basics.name === name)
                              );
                              handleAddCarrier(newCarriers);
                            }}
                            renderInput={(params) => <TextField {...params} label="Carrier" />}
                          />
                        </TableCell>
                        <TableCell sx={{ width: '15%' }}>{carrier.details.Density}</TableCell>
                        <TableCell sx={{ width: '15%' }}>{carrier.details.CNTR}</TableCell>
                        <TableCell sx={{ width: '30%' }}>
                          <TextField
                            sx={{ width: '46%' }}
                            type="number"
                            value={carrier.details.PG}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setSelectedCarriers(prevCarriers =>
                                prevCarriers.map(prevCarrier => {
                                  if (prevCarrier.basics.id === carrier.basics.id) {
                                    return { ...prevCarrier, details: { ...prevCarrier.details, PG: newValue } };
                                  }
                                  return prevCarrier;
                                })
                              );
                            }}
                            label="PG"
                            variant="standard"
                            size="small"
                          />
                          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                          <TextField
                            sx={{ width: '46%' }}
                            type="number"
                            value={carrier.details.VG}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setSelectedCarriers(prevCarriers =>
                                prevCarriers.map(prevCarrier => {
                                  if (prevCarrier.basics.id === carrier.basics.id) {
                                    return { ...prevCarrier, details: { ...prevCarrier.details, VG: newValue } };
                                  }
                                  return prevCarrier;
                                })
                              );
                            }}
                            label="VG"
                            variant="standard"
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ width: '10%' }}>
                          <TextField
                            type="number"
                            value={carrier.details.percentage}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setSelectedCarriers(prevCarriers =>
                                prevCarriers.map(prevCarrier => {
                                  if (prevCarrier.basics.id === carrier.basics.id) {
                                    return { ...prevCarrier, details: { ...prevCarrier.details, percentage: newValue } };
                                  }
                                  return prevCarrier;
                                })
                              );
                            }}
                            label="Percent"
                            variant="standard"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveCarrier(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button onClick={() => handleAddCarrier([productInventory[0]])}>Add Carrier</Button>
            </Box>
          </Grid>
          <Grid item xs={12}> 
            <TextField
              label="Details"
              multiline
              rows={4}
              value={recipeDetails}
              onChange={(e) => setRecipeDetails(e.target.value)}
              sx={{
                width: '100%',
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          m: 2,
          bgcolor: globalColors.primary
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default RecipeWizard;