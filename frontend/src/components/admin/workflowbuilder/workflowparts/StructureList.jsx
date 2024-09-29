// StructureList.jsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Swimlanes from '../assets/structure/Swimlanes'; // Ensure the correct import path

// Define the list of structures with their components and metadata
const structureList = [
  { component: Swimlanes, name: 'Swimlanes', useCase: 'Divides activities into lanes based on responsibility.' },
];

const StructureList = ({ handleItemClick }) => {
  // Ensure structureList is defined and has content
  if (!structureList || structureList.length === 0) {
    return <div>No structures available</div>;
  }

  return (
    <List>
      {structureList.map((structure) => (
        <ListItem
          key={structure.name}
          button
          onClick={handleItemClick({
            name: structure.name,
            component: structure.component,
            bgColor: 'rgba(0, 255, 0, 0.5)',
            label: structure.name,
            fontSize: '16px',
          })}
        >
          <ListItemText primary={structure.name} />
          <IconButton onClick={(e) => e.stopPropagation()}>
            <InfoIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default StructureList;
