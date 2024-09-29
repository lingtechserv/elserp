import React, { useEffect, useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { globalColors } from '../../constants/Styles';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RecipeWizard from './recipes/RecipeWizard';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Recipes = () => {
  const { recipeInventory } = useInventory();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log(recipeInventory)
  }, [recipeInventory]);

  const handleOpen = () => setIsModalVisible(true);
  const handleClose = () => setIsModalVisible(false);

  return (
    <Box sx={{ height: '100%', width: '100%', bgcolor: globalColors.primaryLight }}> 
      <Button variant="contained" onClick={handleOpen} style={{ margin: '10px', backgroundColor: globalColors.secondary }}>
        Create Recipe
      </Button>
      <Modal
        open={isModalVisible}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box sx={style}> 
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Recipe Wizard
          </Typography>
          <RecipeWizard onClose={handleClose} />
        </Box>
      </Modal>
      {/* Use recipeInventory here to list recipes or any other related content */}
      {recipeInventory.map((item, index) => (
        <div key={index}>{/* Render each item from recipeInventory */}</div>
      ))}
    </Box>
  );
};

export default Recipes;