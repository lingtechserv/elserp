import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Action from '../assets/shapes/Action';
import Decision from '../assets/shapes/Decision';
import Document from '../assets/shapes/Document';
import InputOutput from '../assets/shapes/InputOutput';
import ManualInput from '../assets/shapes/ManualInput';
import Preparation from '../assets/shapes/Preparation';
import Connector from '../assets/shapes/Connector';
import Or from '../assets/shapes/Or';
import Junction from '../assets/shapes/Junction';
import Merge from '../assets/shapes/Merge';
import Collate from '../assets/shapes/Collate';
import Sort from '../assets/shapes/Sort';
import Database from '../assets/shapes/Database';
import StartStop from '../assets/shapes/StartStop';

// Define the list of shapes with their components and metadata
const shapesList = [
  { component: StartStop, name: 'Start/Stop', useCase: 'Indicates the start or end of the process.' },
  { component: Action, name: 'Action', useCase: 'Represents a specific action or step in the process.' },
  { component: Document, name: 'Document', useCase: 'Indicates a document or report.' },
  { component: Decision, name: 'Decision', useCase: 'A decision point that branches the flow.' },
  { component: InputOutput, name: 'Input/Output', useCase: 'Indicates data input or output.' },
  { component: ManualInput, name: 'Manual Input', useCase: 'Represents a manual data entry.' },
  { component: Preparation, name: 'Preparation', useCase: 'Indicates preparation steps.' },
  { component: Connector, name: 'Connector', useCase: 'Connects different parts of the flow.' },
  { component: Or, name: 'Or', useCase: 'Represents an alternate path.' },
  { component: Junction, name: 'Junction', useCase: 'Combines multiple paths.' },
  { component: Merge, name: 'Merge', useCase: 'Merges multiple processes.' },
  { component: Collate, name: 'Collate', useCase: 'Organizes data or documents.' },
  { component: Sort, name: 'Sort', useCase: 'Sorts items based on criteria.' },
  { component: Database, name: 'Database', useCase: 'Represents a database or storage.' },
];

const ShapesListComponent = ({ handleItemClick }) => {
  // Ensure shapesList is defined and has content
  if (!shapesList || shapesList.length === 0) {
    return <div>No shapes available</div>;
  }

  return (
    <List>
      {shapesList.map((shape) => (
        <ListItem
          key={shape.name}
          button
          onClick={handleItemClick({
            name: shape.name,
            component: shape.component,
            bgColor: 'rgba(0, 0, 255, 0.5)',
            label: shape.name,
            fontSize: '16px',
          })}
        >
          <ListItemText primary={shape.name} />
          <IconButton onClick={(e) => e.stopPropagation()}>
            <InfoIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ShapesListComponent;
