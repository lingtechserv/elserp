import React, { useRef, useState, useEffect } from 'react';
import { AppBar, Button, Modal, Toolbar, Drawer, CssBaseline, Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, IconButton, ToggleButton, ToggleButtonGroup, TextField, Popover } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/system';
import { Rnd } from 'react-rnd';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { SketchPicker } from 'react-color';
import StartStop from './assets/shapes/StartStop';
import Action from './assets/shapes/Action';
import Document from './assets/shapes/Document';
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
import FormBuilder from '../formbulder/FormBuilder'; // Ensure this is correctly imported
import ActionConfiguration from '../workflowbuilder/assets/configurations/ActionConfiguration'; // Assuming you have an ActionConfiguration component

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
  { component: StartStop, name: 'Start/Stop', useCase: 'Indicates the start or end of the process.  When building out your process, this is required to open and terminate the workflow.' },
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
  const [openActionConfig, setOpenActionConfig] = useState(false);
  const [currentActionConfig, setCurrentActionConfig] = useState({});
  const [openDecisionConfig, setOpenDecisionConfig] = useState(false);
  const [currentDecisionConfig, setCurrentDecisionConfig] = useState({});

  const handleOpenDecisionConfig = () => {
    setCurrentDecisionConfig(selectedShape?.decisionConfig || {});
    setOpenDecisionConfig(true);
  };
  
  const handleSaveDecisionConfig = (config) => {
    setShapes(shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, decisionConfig: config, isCompleted: true } : shape
    ));
    setSelectedShape({ ...selectedShape, decisionConfig: config, isCompleted: true });
    setOpenDecisionConfig(false);
  };
  
  const handleCancelDecisionConfig = () => {
    setOpenDecisionConfig(false);
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
      isCompleted: false, // Initial completion state
    };
    setShapes([...shapes, newItem]);
  };

  const handleRemoveShape = (index) => () => {
    const shapeId = shapes[index].id;
    setShapes(shapes.filter((_, i) => i !== index));
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

  const handleCustomPropertyChange = (prop) => (value) => {
    setShapes(shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, [prop]: value } : shape
    ));
    setSelectedShape({ ...selectedShape, [prop]: value });
  };

  const handleConnectModeToggle = (event, newMode) => {
    setConnectMode(newMode === 'connect');
    setSelectedShape(null);
  };

  const handleShapeSelect = (shape) => () => {
    if (connectMode) {
      if (selectedShape) {
        if (selectedShape.id !== shape.id) {
          setArrows([...arrows, { start: selectedShape.id, end: shape.id, type: lineType }]);
        }
        setSelectedShape(null);
      } else {
        setSelectedShape(shape);
      }
    } else {
      setSelectedShape(shape);
      if (shape.name === 'Action') {
        handleOpenActionConfig();
      } else if (shape.name === 'Decision') {
        setCurrentDecisionConfig(shape.decisionConfig || {});
        setOpenDecisionConfig(true);
      }
    }
  };
  

  const handleLineTypeChange = (event, newLineType) => {
    setLineType(newLineType);
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

  const handleInfoClick = (event, useCase) => {
    event.stopPropagation();
    setInfoAnchorEl(event.currentTarget);
    setInfoContent(useCase);
  };

  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };

  const openInfoPopover = Boolean(infoAnchorEl);

  const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState(null);

  const handleColorBoxClick = (event) => {
    setColorPopoverAnchorEl(event.currentTarget);
  };

  const handleColorPopoverClose = () => {
    setColorPopoverAnchorEl(null);
  };

  const openColorPopover = Boolean(colorPopoverAnchorEl);

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

  const handleOpenActionConfig = () => {
    setCurrentActionConfig(selectedShape?.actionConfig || {});
    setOpenActionConfig(true);
  };

  const handleSaveActionConfig = (config) => {
    setShapes(shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, actionConfig: config, isCompleted: true } : shape
    ));
    setSelectedShape({ ...selectedShape, actionConfig: config, isCompleted: true });
    setOpenActionConfig(false);
  };

  const handleCancelActionConfig = () => {
    setOpenActionConfig(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Workflow Builder
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexGrow: 1,
              width: '300px',
            }}
          >
            {connectMode && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  p: 0.5,
                  borderRadius: 1,
                  mr: 2,
                }}
              >
                <ToggleButtonGroup
                  size="small"
                  value={lineType}
                  exclusive
                  onChange={handleLineTypeChange}
                  aria-label="line type"
                >
                  <ToggleButton value="solid" sx={{ fontSize: '0.8rem' }}>
                    Solid
                  </ToggleButton>
                  <ToggleButton value="dotted" sx={{ fontSize: '0.8rem' }}>
                    Dotted
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}
            <ToggleButtonGroup
              size="small"
              value={connectMode ? 'connect' : 'none'}
              exclusive
              onChange={handleConnectModeToggle}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                p: 0.5,
              }}
            >
              <ToggleButton value="connect" sx={{ fontSize: '0.8rem' }}>
                Connect
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Shapes</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                    <IconButton onClick={(e) => handleInfoClick(e, shape.useCase)}>
                      <InfoIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Structure</Typography>
            </AccordionSummary>
            <AccordionDetails>
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'relative',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Toolbar />
        <Xwrapper>
          <GridContainer ref={gridRef}>
            <Grid />
            {shapes.map((shape, index) => {
              const { component: Component, x, y, width, height, id, bgColor, ...shapeProps } = shape;
              return (
                <Rnd
                  key={id}
                  id={id}
                  default={{ x, y, width, height }}
                  bounds="parent"
                  onDragStop={(e, d) =>
                    setShapes(
                      shapes.map((s, i) =>
                        i === index ? { ...s, x: d.x, y: d.y } : s
                      )
                    )
                  }
                  onResizeStop={(e, direction, ref, delta, position) => {
                    setShapes(
                      shapes.map((s, i) =>
                        i === index
                          ? {
                              ...s,
                              width: ref.style.width,
                              height: ref.style.height,
                              ...position,
                            }
                          : s
                      )
                    );
                  }}
                  onClick={handleShapeSelect(shape)}
                >
                  <Component bgColor={bgColor} {...shapeProps} />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 1000,
                      backgroundColor: 'rgba(255, 0, 0, 0.7)',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '4px',
                    }}
                    onClick={handleRemoveShape(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Rnd>
              );
            })}
            {arrows.map((arrow, index) => (
              <Xarrow
                key={index}
                start={arrow.start}
                end={arrow.end}
                path="smooth"
                curveness={0.5}
                showHead={true}
                color="black"
                strokeWidth={2}
                dashness={
                  arrow.type === 'dotted'
                    ? { strokeLen: 10, nonStrokeLen: 5 }
                    : false
                }
              />
            ))}
          </GridContainer>
        </Xwrapper>
      </Box>

      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Typography variant="h6" noWrap component="div" sx={{ padding: 2 }}>
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginRight: '8px' }}>
                  Color
                </Typography>
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
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <SketchPicker
                  color={selectedShape.bgColor || '#ffffff'}
                  onChangeComplete={handleColorChange}
                />
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
                      backgroundColor: selectedShape.isCompleted
                        ? 'green'
                        : 'red',
                    }}
                  >
                    {selectedShape.isCompleted ? 'Completed' : 'Open Form'}
                  </Button>
                  <Modal
                    open={openFormBuilder}
                    onClose={handleCloseFormBuilder}
                    aria-labelledby="form-builder-modal"
                    aria-describedby="modal-to-open-form-builder"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                      }}
                    >
                      <IconButton
                        aria-label="close"
                        onClick={handleCloseFormBuilder}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1300,
                          color: 'white',
                          border: '2px solid white',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <CloseIcon />
                      </IconButton>

                      <FormBuilder onCompletion={handleFormCompletion} />
                    </Box>
                  </Modal>
                </>
              )}

              {selectedShape.name === 'Action' && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleOpenActionConfig}
                    sx={{
                      width: '100%',
                      height: '40px',
                      marginTop: '10px',
                      backgroundColor: selectedShape.isCompleted
                        ? 'green'
                        : 'red',
                    }}
                  >
                    {selectedShape.isCompleted ? 'Completed' : 'Configure Action'}
                  </Button>
                  <Modal
                    open={openActionConfig}
                    onClose={handleCancelActionConfig}
                    aria-labelledby="action-config-modal"
                    aria-describedby="modal-to-open-action-config"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <IconButton
                        aria-label="close"
                        onClick={handleCancelActionConfig}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1300,
                          color: 'white',
                          border: '2px solid white',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <CloseIcon />
                      </IconButton>

                      <ActionConfiguration
                        config={currentActionConfig}
                        onSave={handleSaveActionConfig}
                        onCancel={handleCancelActionConfig}
                      />
                    </Box>
                  </Modal>
                </>
              )}
            </Box>
          )}
        </Box>
      </Drawer>
{selectedShape.name === 'Decision' && (
  <>
    <Button
      variant="contained"
      onClick={handleOpenDecisionConfig}
      sx={{
        width: '100%',
        height: '40px',
        marginTop: '10px',
        backgroundColor: selectedShape.isCompleted ? 'green' : 'red',
      }}
    >
      {selectedShape.isCompleted ? 'Completed' : 'Configure Decision'}
    </Button>
    <Modal
      open={openDecisionConfig}
      onClose={handleCancelDecisionConfig}
      aria-labelledby="decision-config-modal"
      aria-describedby="modal-to-open-decision-config"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCancelDecisionConfig}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1300,
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* DecisionConfiguration component will be similar to ActionConfiguration */}
        <DecisionConfiguration
          config={currentDecisionConfig}
          onSave={handleSaveDecisionConfig}
          onCancel={handleCancelDecisionConfig}
        />
      </Box>
    </Modal>
  </>
)}

      <Popover
        open={openInfoPopover}
        anchorEl={infoAnchorEl}
        onClose={handleInfoClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">{infoContent}</Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default WorkflowBuilder;
