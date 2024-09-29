import React, { useRef, useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Popover,
  TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/system';
import { Rnd } from 'react-rnd';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { SketchPicker } from 'react-color';
import Document from './assets/shapes/Document';
import StartStop from './assets/shapes/StartStop';
import Action from './assets/shapes/Action';
import Decision from './assets/shapes/Decision';
import InputOutput from './assets/shapes/InputOutput';
import ManualInput from './assets/shapes/ManualInput';
import Preparation from './assets/shapes/Preparation';
import Connector from './assets/shapes/Connector';
import Or from './assets/shapes/Or';
import Junction from './assets/shapes/Junction';
import Merge from './assets/shapes/Merge';
import Collate from './assets/shapes/Collate';
import Sort from './assets/shapes/Sort';
import Database from './assets/shapes/Database';
import Swimlanes from './assets/structure/Swimlanes';
import FormBuilder from '../formbulder/FormBuilder';
import InputOutputConfiguration from './assets/configurations/InputOutputConfiguration';
import ActionConfiguration from './assets/configurations/ActionConfiguration'; // Import ActionConfiguration component

const drawerWidth = 240;

const GridContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  backgroundColor: '#f0f0f0',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
});

const Grid = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '500%',
  height: '500%',
  backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  transformOrigin: 'center center',
});

const shapesList = [
  { component: StartStop, name: 'Start/Stop', useCase: 'Indicates the start or end of the process.' },
  { component: Action, name: 'Action', useCase: 'Represents a specific action or step in the process.' },
  { component: Document, name: 'Document', useCase: 'Indicates a document or report.' },
  { component: Decision, name: 'Decision', useCase: 'A decision point that branches the flow.' },
  { component: InputOutput, name: 'Input/Output', useCase: 'Indicates data input or output.' },
  { component: Database, name: 'Database', useCase: 'Represents a database or storage.' },
];

const structureList = [
  { component: Swimlanes, name: 'Swimlanes', useCase: 'Divides activities into lanes based on responsibility.' },
];

const WorkflowBuilder = () => {
  const [scale, setScale] = useState(1);
  const gridRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [connectMode, setConnectMode] = useState(false);
  const [lineType, setLineType] = useState('solid');
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const [infoContent, setInfoContent] = useState('');
  const [openFormBuilder, setOpenFormBuilder] = useState(false);
  const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState(null);
  const [openInputOutputConfig, setOpenInputOutputConfig] = useState(false);
  const [openActionConfig, setOpenActionConfig] = useState(false); // New state for ActionConfiguration

  const handleOpenFormBuilder = () => {
    setOpenFormBuilder(true);
  };

  const handleCloseFormBuilder = () => {
    setOpenFormBuilder(false);
  };

  const handleFormCompletion = (completed) => {
    setShapes(shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, isCompleted: completed } : shape
    ));
    setSelectedShape({ ...selectedShape, isCompleted: completed });
  };

  const handleShapeSelect = (shape) => () => {
    if (connectMode) {
      if (!selectedShape) {
        setSelectedShape(shape);
      } else {
        const arrow = {
          id: `arrow-${Date.now()}`,
          start: selectedShape.id,
          end: shape.id,
          type: lineType,
        };
        setArrows([...arrows, arrow]);
        setSelectedShape(null);
      }
    } else {
      setSelectedShape(shape);
    }
  };

  const handleItemClick = (item) => () => {
    const id = `item-${Date.now()}`;
    const newItem = {
      ...item,
      id,
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      bgColor: 'rgba(0, 0, 255, 0.5)',
      label: item.name,
      isCompleted: false,
    };
    setShapes([...shapes, newItem]);
  };

  const handleRemoveShape = (shapeId) => () => {
    setShapes(shapes.filter((shape) => shape.id !== shapeId));
    setArrows(arrows.filter(arrow => arrow.start !== shapeId && arrow.end !== shapeId));
    if (selectedShape && selectedShape.id === shapeId) {
      setSelectedShape(null);
    }
  };

  const handlePropertyChange = (prop) => (event) => {
    const value = event.target.value;
    setShapes(shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, [prop]: value } : shape
    ));
    setSelectedShape({ ...selectedShape, [prop]: value });
  };

  const handleColorChange = (color) => {
    if (!selectedShape) return;
    const newColor = color.hex;
    const updatedShapes = shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, bgColor: newColor } : shape
    );
    setShapes(updatedShapes);
    setSelectedShape({ ...selectedShape, bgColor: newColor });
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const { clientX, clientY, deltaY } = event;
    const scaleAmount = -deltaY * 0.001;
    const newScale = Math.min(Math.max(scale + scaleAmount, 0.5), 2);

    const rect = gridRef.current.getBoundingClientRect();
    const offsetX = (clientX - rect.left) - rect.width / 2;
    const offsetY = (clientY - rect.top) - rect.height / 2;

    setScale(newScale);
    setPosition(prevPosition => ({
      x: prevPosition.x - offsetX * scaleAmount / newScale,
      y: prevPosition.y - offsetY * scaleAmount / newScale,
    }));
  };

  const handleMouseDown = (event) => {
    setDragging(true);
    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const dx = event.clientX - lastMousePosition.x;
      const dy = event.clientY - lastMousePosition.y;
      setLastMousePosition({ x: event.clientX, y: event.clientY });
      setPosition(prevPosition => {
        const newPosition = { x: prevPosition.x + dx, y: prevPosition.y + dy };
        const gridBounds = {
          left: (gridRef.current.offsetWidth * (1 - scale)) / 2,
          right: -(gridRef.current.offsetWidth * (scale - 1)) / 2,
          top: (gridRef.current.offsetHeight * (1 - scale)) / 2,
          bottom: -(gridRef.current.offsetHeight * (scale - 1)) / 2,
        };

        return {
          x: Math.min(Math.max(newPosition.x, gridBounds.right), gridBounds.left),
          y: Math.min(Math.max(newPosition.y, gridBounds.bottom), gridBounds.top),
        };
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleConnectModeToggle = (event, newMode) => {
    setConnectMode(newMode === 'connect');
    setSelectedShape(null);
  };

  const handleLineTypeChange = (event, newLineType) => {
    setLineType(newLineType);
  };

  const handleInfoClick = (event, useCase) => {
    event.stopPropagation();
    setInfoAnchorEl(event.currentTarget);
    setInfoContent(useCase);
  };

  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };

  const handleColorBoxClick = (event) => {
    setColorPopoverAnchorEl(event.currentTarget);
  };

  const handleColorPopoverClose = () => {
    setColorPopoverAnchorEl(null);
  };

  const handleOpenInputOutputConfig = () => {
    setOpenInputOutputConfig(true);
  };

  const handleCancelInputOutputConfig = () => {
    setOpenInputOutputConfig(false);
  };

  const handleSaveInputOutputConfig = (newConfig) => {
    setShapes(shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, ioConfig: newConfig, isCompleted: true } : shape
    ));
    setSelectedShape({ ...selectedShape, ioConfig: newConfig, isCompleted: true });
    setOpenInputOutputConfig(false);
  };

  const handleOpenActionConfig = () => { // Open Action Configuration
    setOpenActionConfig(true);
  };

  const handleCancelActionConfig = () => { // Close Action Configuration
    setOpenActionConfig(false);
  };

  const handleSaveActionConfig = (newConfig) => {
    setShapes(shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, actionConfig: newConfig, isCompleted: true } : shape
    ));
    setSelectedShape({ ...selectedShape, actionConfig: newConfig, isCompleted: true });
    setOpenActionConfig(false);
  };

  const openInfoPopover = Boolean(infoAnchorEl);
  const openColorPopover = Boolean(colorPopoverAnchorEl);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Workflow Builder
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1 }}>
            <ToggleButtonGroup size="small" value={connectMode ? 'connect' : 'none'} exclusive onChange={handleConnectModeToggle}>
              <ToggleButton value="connect" sx={{ fontSize: '0.8rem' }}>Connect</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Drawer for Shapes and Structure */}
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Shapes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {shapesList.map((shape) => (
                  <ListItem key={shape.name} button onClick={handleItemClick({ name: shape.name, component: shape.component, bgColor: 'rgba(0, 0, 255, 0.5)', label: shape.name })}>
                    <ListItemText primary={shape.name} />
                    <IconButton onClick={(e) => handleInfoClick(e, shape.useCase)}>
                      <InfoIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Adding Structure List to the Drawer */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Structure</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {structureList.map((structure) => (
                  <ListItem key={structure.name} button onClick={handleItemClick({ name: structure.name, component: structure.component, bgColor: 'rgba(0, 255, 0, 0.5)', label: structure.name })}>
                    <ListItemText primary={structure.name} />
                    <IconButton onClick={(e) => handleInfoClick(e, structure.useCase)}>
                      <InfoIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <Toolbar />
        <Xwrapper>
          <GridContainer ref={gridRef} sx={{ border: connectMode ? '2px solid blue' : 'none' }}>
            <Grid />
            {shapes.map((shape) => {
              const { component: Component, x, y, width, height, id, bgColor, ...shapeProps } = shape;
              return (
                <Rnd key={id} id={id} default={{ x, y, width, height }} bounds="parent" onDragStop={(e, d) => setShapes(shapes.map((s) => (s.id === id ? { ...s, x: d.x, y: d.y } : s)))} onResizeStop={(e, direction, ref, delta, position) => setShapes(shapes.map((s) => (s.id === id ? { ...s, width: ref.style.width, height: ref.style.height, ...position } : s)))} style={{ border: connectMode ? '2px dashed blue' : 'none' }} onClick={handleShapeSelect(shape)}>
                  <Component bgColor={bgColor} {...shapeProps} />
                  <IconButton size="small" sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1000, backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white', borderRadius: '50%', padding: '4px' }} onClick={handleRemoveShape(id)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Rnd>
              );
            })}
            {arrows.map((arrow, index) => (
              <Xarrow
                key={arrow.id}
                start={arrow.start}
                end={arrow.end}
                path="smooth"
                curveness={0.5}
                showHead={true}
                color="black"
                strokeWidth={2}
                dashness={arrow.type === 'dotted' ? { strokeLen: 10, nonStrokeLen: 5 } : false}
                onClick={() => handleRemoveArrow(arrow.id)}
                passProps={{
                  onMouseEnter: (e) => {
                    e.target.style.cursor = 'pointer'; // Change cursor on hover
                  },
                }}
              />
            ))}
          </GridContainer>
        </Xwrapper>
      </Box>

      {/* Right Drawer for Properties */}
      <Drawer variant="permanent" anchor="right" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto', padding: 2 }}>
          <Typography variant="h6" noWrap component="div">
            Properties
          </Typography>
          {selectedShape && (
            <Box sx={{ padding: 2 }}>
              <TextField
                label="Title"
                value={selectedShape.label || ''}
                onChange={(e) => handlePropertyChange('label')(e)}
                fullWidth
                margin="normal"
              />
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Typography variant="subtitle1" sx={{ marginRight: '8px' }}>Color</Typography>
                <Box
                  sx={{
                    width: '40px',
                    height: '20px',
                    backgroundColor: selectedShape.bgColor || '#ffffff',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                  }}
                  onClick={handleColorBoxClick}
                />
              </Box>
              <Popover
                open={openColorPopover}
                anchorEl={colorPopoverAnchorEl}
                onClose={handleColorPopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <SketchPicker color={selectedShape.bgColor || '#ffffff'} onChangeComplete={handleColorChange} />
              </Popover>

              {selectedShape.name === 'Document' && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleOpenFormBuilder}
                    sx={{
                      width: '100%',
                      height: '40px',
                      marginTop: '10px',
                      backgroundColor: selectedShape.isCompleted ? 'green' : 'red',
                    }}
                  >
                    {selectedShape.isCompleted ? 'Completed' : 'Open Form'}
                  </Button>
                </>
              )}

              {selectedShape.name === 'Input/Output' && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleOpenInputOutputConfig}
                    sx={{
                      width: '100%',
                      height: '40px',
                      marginTop: '10px',
                      backgroundColor: selectedShape.isCompleted ? 'green' : 'red',
                    }}
                  >
                    {selectedShape.isCompleted ? 'Configured' : 'Configure I/O'}
                  </Button>
                </>
              )}

              {selectedShape.name === 'Action' && ( // Added configuration for Action shapes
                <>
                  <Button
                    variant="contained"
                    onClick={handleOpenActionConfig}
                    sx={{
                      width: '100%',
                      height: '40px',
                      marginTop: '10px',
                      backgroundColor: selectedShape.isCompleted ? 'green' : 'red',
                    }}
                  >
                    {selectedShape.isCompleted ? 'Configured' : 'Configure Action'}
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Form Builder Modal */}
      <Modal open={openFormBuilder} onClose={handleCloseFormBuilder} aria-labelledby="form-builder-modal" aria-describedby="modal-to-open-form-builder">
        <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'background.paper', boxShadow: 24, overflow: 'auto' }}>
          <IconButton aria-label="close" onClick={handleCloseFormBuilder} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1300, color: 'white', border: '2px solid white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <CloseIcon />
          </IconButton>
          <FormBuilder onCompletion={handleFormCompletion} />
        </Box>
      </Modal>

      {/* Input/Output Configuration Modal */}
      <Modal open={openInputOutputConfig} onClose={handleCancelInputOutputConfig} aria-labelledby="io-config-modal" aria-describedby="modal-to-open-io-config">
        <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'background.paper', boxShadow: 24, overflow: 'auto' }}>
          <IconButton aria-label="close" onClick={handleCancelInputOutputConfig} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1300, color: 'white', border: '2px solid white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <CloseIcon />
          </IconButton>
          <InputOutputConfiguration config={selectedShape?.ioConfig || {}} onSave={handleSaveInputOutputConfig} onCancel={handleCancelInputOutputConfig} />
        </Box>
      </Modal>

      {/* Action Configuration Modal */}
      <Modal open={openActionConfig} onClose={handleCancelActionConfig} aria-labelledby="action-config-modal" aria-describedby="modal-to-open-action-config">
        <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'background.paper', boxShadow: 24, overflow: 'auto' }}>
          <IconButton aria-label="close" onClick={handleCancelActionConfig} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1300, color: 'white', border: '2px solid white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <CloseIcon />
          </IconButton>
          <ActionConfiguration config={selectedShape?.actionConfig || {}} onSave={handleSaveActionConfig} onCancel={handleCancelActionConfig} />
        </Box>
      </Modal>

      {/* Popover for shape info */}
      <Popover open={openInfoPopover} anchorEl={infoAnchorEl} onClose={handleInfoClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">{infoContent}</Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default WorkflowBuilder;
