import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import {
  Box, List, ListItem, ListItemButton, ListItemText, IconButton, TextField, InputAdornment,
  Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Accordion, AccordionSummary,
  AccordionDetails, Select, MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import "react-grid-layout/css/styles.css";
import FieldWizard from '../FieldWizard'; // Adjust the import path as needed

// Import field input components
import CheckBoxInput from '../fields/inputs/CheckboxInput';
import DatePickerInput from '../fields/inputs/DatePickerInput';
import DateRangeInput from '../fields/inputs/DateRangeInput';
import LongTextInput from '../fields/inputs/LongTextInput';
import SelectInput from '../fields/inputs/SelectInput';
import TextInput from '../fields/inputs/TextInput';
import NumberInput from '../fields/inputs/NumberInput';

import { useForm } from '../../../contexts/FormContext';

const gridCols = 24;
const gridSize = 30;
const gridPercentageWidth = 80;

const availableWidgets = [
  { id: 'header', name: 'Header', minW: 8, minH: 2 },
  { id: 'divider', name: 'Divider', minW: 6, minH: 2 },
];

const fieldComponents = {
  Checkbox: CheckBoxInput,
  DatePicker: DatePickerInput,
  DateRangePicker: DateRangeInput,
  TextField: LongTextInput,
  Select: SelectInput,
  TextFieldConfiguration: TextInput,
  Number: NumberInput,
};

const FormBuilder = ({ onCompletion }) => {
  const [formName, setFormName] = useState('');
  const [widgets, setWidgets] = useState([]);
  const [layoutWidth, setLayoutWidth] = useState(window.innerWidth);
  const [selectedParent, setSelectedParent] = useState(null);
  const [draggingChild, setDraggingChild] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [fields, setFields] = useState(() => {
    const savedFields = localStorage.getItem('fields');
    return savedFields ? JSON.parse(savedFields) : [];
  });
  const [formSize, setFormSize] = useState('Medium Wide');
  const [formCompleted, setFormCompleted] = useState(false);

  const { createForm } = useForm();

  const updateLayoutWidth = () => {
    setLayoutWidth(window.innerWidth * (gridPercentageWidth / 100));
  };

  useEffect(() => {
    window.addEventListener('resize', updateLayoutWidth);
    updateLayoutWidth();
    return () => window.removeEventListener('resize', updateLayoutWidth);
  }, []);

  useEffect(() => {
    // Check form completion status whenever formName or fields change
    const isComplete = formName.trim() !== '' && fields.length > 0;
    setFormCompleted(isComplete);
    if (isComplete) {
      onCompletion(true);
    }
  }, [formName, fields, onCompletion]);

  const handleAddWidget = (widgetType) => {
    const newWidgetId = `${widgetType}-${Date.now()}`;
    const widgetTemplate = availableWidgets.find(widget => widget.id === widgetType);

    setWidgets(prevWidgets => [
      ...prevWidgets,
      {
        id: newWidgetId,
        type: widgetType,
        x: 0,
        y: 0,
        w: widgetTemplate.minW * gridSize,
        h: widgetTemplate.minH * gridSize,
        minW: widgetTemplate.minW * gridSize,
        minH: widgetTemplate.minH * gridSize,
        children: [],
        parent: selectedParent || null,
        properties: widgetType === 'header'
          ? { text: 'Header', fontSize: 16, color: '#000000' }
          : { color: '#000000', thickness: 2 }
      },
    ]);

    if (selectedParent) {
      setWidgets(prevWidgets =>
        prevWidgets.map(widget =>
          widget.id === selectedParent
            ? { ...widget, children: [...widget.children, newWidgetId] }
            : widget
        )
      );
    }
  };

  const handleAddField = (field) => {
    const newFieldId = `${field.type}-${Date.now()}`;

    setWidgets(prevWidgets => [
      ...prevWidgets,
      {
        id: newFieldId,
        type: 'field',
        x: 0,
        y: 0,
        w: 4 * gridSize,
        h: 4 * gridSize,
        minW: 4 * gridSize,
        minH: 4 * gridSize,
        children: [],
        parent: selectedParent || null,
        fieldConfig: field,
      },
    ]);

    if (selectedParent) {
      setWidgets(prevWidgets =>
        prevWidgets.map(widget =>
          widget.id === selectedParent
            ? { ...widget, children: [...widget.children, newFieldId] }
            : widget
        )
      );
    }
  };

  const handleRemoveWidget = (widgetId) => {
    const removeWidgetAndChildren = (id, widgets) => {
      const widgetToRemove = widgets.find(widget => widget.id === id);
      if (widgetToRemove) {
        const updatedWidgets = widgets.filter(widget => widget.id !== id);
        widgetToRemove.children.forEach(childId => {
          removeWidgetAndChildren(childId, updatedWidgets);
        });
        return updatedWidgets.filter(widget => widget.parent !== id);
      }
      return widgets;
    };

    setWidgets(prevWidgets => removeWidgetAndChildren(widgetId, prevWidgets));
  };

  const handleWidgetResize = (e, direction, ref, delta, position, id) => {
    if (!ref || !ref.offsetWidth || !ref.offsetHeight) {
      console.error('Resize reference is undefined or has invalid dimensions');
      return;
    }

    setWidgets(widgets.map(widget => {
      if (widget.id === id) {
        return {
          ...widget,
          w: ref.offsetWidth,
          h: ref.offsetHeight,
          ...position,
        };
      }
      return widget;
    }));
  };

  const handleWidgetDrag = (e, d, id) => {
    if (d == null || d.x == null || d.y == null) {
      console.error('Drag event did not provide valid position data');
      return;
    }

    setWidgets(widgets.map(widget => {
      if (widget.id === id) {
        return {
          ...widget,
          x: d.x,
          y: d.y,
        };
      }
      return widget;
    }));
  };

  const handleWidgetChange = (property, value) => {
    setSelectedWidget(prevSelectedWidget => ({
      ...prevSelectedWidget,
      properties: {
        ...prevSelectedWidget.properties,
        [property]: value,
      }
    }));

    setWidgets(widgets.map(widget => {
      if (widget.id === selectedWidget.id) {
        return {
          ...widget,
          properties: {
            ...widget.properties,
            [property]: value,
          },
        };
      }
      return widget;
    }));
  };

  const handleOpenSettings = (widget) => {
    setSelectedWidget(widget);
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
    setSelectedWidget(null);
  };

  const handleOpenWizard = () => {
    setWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
  };

  const handleSaveForm = async () => {
    const formConfiguration = {
      name: formName,
      config: JSON.stringify(widgets),
      is_custom: true,
      formSize: formSize,
    };
    console.log('Form saved:', formConfiguration);
    await createForm(formConfiguration);
  };

  const formSizeDimensions = {
    'Miniature Wide': { width: '25vw', height: '15vh' },
    'Miniature Tall': { width: '15vw', height: '25vh' },
    'Small Wide': { width: '32vw', height: '19.2vh' },
    'Small Tall': { width: '19.2vh', height: '32vw' },
    'Medium Wide': { width: '41.6vw', height: '25vh' },
    'Medium Tall': { width: '25vh', height: '35vw' },
    'Large': { width: '54vw', height: '50vh' },
    'Extra Large': { width: '70vw', height: '65vh' },
    'Full Sized': { width: '80vw', height: '85vh' },
  };

  const renderWidgetSettings = (widget) => {
    if (!widget) return null;
    if (widget.type === 'field') {
      return null;
    }
    switch (widget.type) {
      case 'header':
        return (
          <Box>
            <TextField
              label="Header Text"
              value={widget.properties.text}
              onChange={(e) => handleWidgetChange('text', e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Font Size"
              type="number"
              value={widget.properties.fontSize}
              onChange={(e) => handleWidgetChange('fontSize', parseInt(e.target.value, 10))}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Font Color"
              type="color"
              value={widget.properties.color}
              onChange={(e) => handleWidgetChange('color', e.target.value)}
              fullWidth
            />
          </Box>
        );
      case 'divider':
        return (
          <Box>
            <TextField
              label="Color"
              type="color"
              value={widget.properties.color}
              onChange={(e) => handleWidgetChange('color', e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Thickness"
              type="number"
              value={widget.properties.thickness}
              onChange={(e) => handleWidgetChange('thickness', parseInt(e.target.value, 10))}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              fullWidth
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const widgetComponents = {
    widget1: () => <Box>Content for Widget 1</Box>,
    widget2: () => <Box>Content for Widget 2</Box>,
    widget3: () => <Box>Content for Widget 3</Box>,
    header: ({ properties }) => (
      <Box>
        <Typography
          variant="h6"
          sx={{ fontSize: `${properties.fontSize}px`, color: properties.color }}
        >
          {properties.text}
        </Typography>
      </Box>
    ),
    divider: ({ properties }) => (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            borderBottom: `${properties.thickness}px solid ${properties.color}`,
          }}
        />
      </Box>
    ),
    field: ({ fieldConfig }) => {
      if (!fieldConfig) {
        console.error('Field config is missing');
        return <Box>Error: Field config is missing</Box>;
      }

      const { type, config } = fieldConfig;
      if (!config) {
        console.error('Field config properties are missing');
        return <Box>Error: Field config properties are missing</Box>;
      }

      const FieldComponent = fieldComponents[type];
      if (!FieldComponent) {
        return <Box>Unknown Field Type: {type}</Box>;
      }

      return <FieldComponent config={config} />;
    },
  };

  const renderWidgets = (parent = null) => {
    return widgets
      .filter(widget => widget.parent === parent)
      .map((widget, index) => (
        <Rnd
          key={widget.id}
          size={{ width: widget.w, height: widget.h }}
          position={{ x: widget.x, y: widget.y }}
          minWidth={widget.minW}
          minHeight={widget.minH}
          onDragStart={() => parent && setDraggingChild(true)}
          onDragStop={(e, d) => {
            handleWidgetDrag(e, d, widget.id);
            if (parent) setDraggingChild(false);
          }}
          onResizeStop={(e, direction, ref, delta, position) => handleWidgetResize(e, direction, ref, delta, position, widget.id)}
          bounds="parent"
          grid={[gridSize, gridSize]}
          disableDragging={parent ? draggingChild : false}
          style={{ border: '1px solid black', p: 1, borderRadius: 1, bgcolor: 'white', zIndex: 10 + index, overflow: 'hidden', position: 'absolute' }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {React.createElement(widgetComponents[widget.type], { properties: widget.properties, fieldConfig: widget.fieldConfig })}
            <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 30, display: 'flex' }}>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => handleRemoveWidget(widget.id)}
                sx={{ zIndex: 30 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => handleOpenSettings(widget)}
                sx={{ zIndex: 30 }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              {renderWidgets(widget.id)}
            </Box>
          </Box>
        </Rnd>
      ));
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', p: 2, backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
          label="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          fullWidth
          sx={{ maxWidth: '300px' }}
        />

        <Select
          value={formSize}
          onChange={(e) => setFormSize(e.target.value)}
          label="Form Size"
          sx={{ maxWidth: '200px', marginRight: '5%' }}
        >
          <MenuItem value="Miniature Wide">Miniature Wide</MenuItem>
          <MenuItem value="Miniature Tall">Miniature Tall</MenuItem>
          <MenuItem value="Small Wide">Small Wide</MenuItem>
          <MenuItem value="Small Tall">Small Tall</MenuItem>
          <MenuItem value="Medium Wide">Medium Wide</MenuItem>
          <MenuItem value="Medium Tall">Medium Tall</MenuItem>
          <MenuItem value="Large">Large</MenuItem>
          <MenuItem value="Extra Large">Extra Large</MenuItem>
          <MenuItem value="Full Sized">Full Sized</MenuItem>
        </Select> 
      </Box>

      <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
        <Box sx={{ width: '15%', p: 2, backgroundColor: 'lightgray', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
          <Box>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Basics</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                <List>
                  {availableWidgets.map((widget) => (
                    <ListItem key={widget.id} disablePadding>
                      <ListItemButton onClick={() => handleAddWidget(widget.id)}>
                        <ListItemText primary={`Add ${widget.name}`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Fields</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                <List>
                  {fields.map((field, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => handleAddField(field)}>
                        <ListItemText 
                          primaryTypographyProps={{ variant: 'body2' }}
                          primary={field.config.name}
                          secondary={field.type}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={{ mt: 2, mb: 4 }}>
            <Button onClick={handleOpenWizard} variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>
              Create Field
            </Button>
            <Button onClick={handleSaveForm} variant="contained" color="secondary" fullWidth>
              Save Form
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            backgroundColor: 'white',
            width: formSizeDimensions[formSize].width,
            height: formSizeDimensions[formSize].height,
            margin: '0 auto',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle at ${gridSize / 2}px ${gridSize / 2}px, lightgray 2px, transparent 0)`,
              backgroundSize: `${gridSize}px ${gridSize}px`,
              zIndex: 1,
            },
          }}
          id="grid-container"
        >
          {renderWidgets()} 
        </Box>
      </Box>

      <Dialog
        open={settingsOpen}
        onClose={handleCloseSettings}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Widget Settings</DialogTitle>
        <DialogContent>
          {renderWidgetSettings(selectedWidget)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={wizardOpen}
        onClose={handleCloseWizard}
        fullScreen
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleCloseWizard}
          aria-label="close"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <FieldWizard />
      </Dialog>
    </Box>
  );
}

export default FormBuilder;
