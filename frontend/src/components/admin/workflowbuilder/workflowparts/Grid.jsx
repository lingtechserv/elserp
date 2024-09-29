import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Rnd } from 'react-rnd';
import Xarrow from 'react-xarrows';
import CloseIcon from '@mui/icons-material/Close';

const Grid = ({
  gridRef,
  shapes = [],
  setShapes,
  selectedShape,
  setSelectedShape,
  handleShapeSelect,
  handleRemoveShape,
  arrows = [],
  setArrows,
  structures = [],
  connectMode,
  startShape,
  setStartShape,
  addArrow,
}) => {
  // Ensure initial state for all shapes is valid
  const initializeShape = (shape) => ({
    ...shape,
    x: shape.x || 0,
    y: shape.y || 0,
    width: shape.width || 100,
    height: shape.height || 100,
  });

  const validatedShapes = shapes.map(initializeShape);

  return (
    <Box
      ref={gridRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        zIndex: 1,
      }}
    >
      {/* Render structure items */}
      {structures.map((structure, index) => {
        const { component: StructureComponent, x, y, width, height, id, ...structureProps } = structure;
        return (
          <Rnd
            key={id || `structure-${index}`}
            id={id}
            default={{ x: x || 0, y: y || 0, width: width || 100, height: height || 100 }}
            bounds="parent"
            style={{
              zIndex: 2,
            }}
            onDragStop={(e, d) => {
              if (!isNaN(d.x) && !isNaN(d.y)) {
                setShapes((prevShapes) =>
                  prevShapes.map((s) =>
                    s.id === id ? { ...s, x: d.x, y: d.y } : s
                  )
                );
              } else {
                console.warn('Invalid drag coordinates detected for structure:', id, d);
              }
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newWidth = parseInt(ref.style.width, 10);
              const newHeight = parseInt(ref.style.height, 10);
              if (!isNaN(newWidth) && !isNaN(newHeight)) {
                setShapes((prevShapes) =>
                  prevShapes.map((s) =>
                    s.id === id
                      ? {
                          ...s,
                          width: newWidth,
                          height: newHeight,
                          ...position,
                        }
                      : s
                  )
                );
              } else {
                console.warn('Invalid resize dimensions detected for structure:', id, { newWidth, newHeight });
              }
            }}
          >
            <StructureComponent {...structureProps} />
          </Rnd>
        );
      })}

      {/* Render shapes */}
      {validatedShapes.map((shape) => {
        const { component: Component, x, y, width, height, id, bgColor, ...shapeProps } = shape;
        return (
          <Rnd
            key={id}
            id={id}
            default={{ x: x || 0, y: y || 0, width: width || 100, height: height || 100 }}
            bounds="parent"
            onDragStop={(e, d) => {
              if (!isNaN(d.x) && !isNaN(d.y)) {
                setShapes((prevShapes) =>
                  prevShapes.map((s) =>
                    s.id === id ? { ...s, x: d.x, y: d.y } : s
                  )
                );
              } else {
                console.warn('Invalid drag coordinates detected for shape:', id, d);
              }
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newWidth = parseInt(ref.style.width, 10);
              const newHeight = parseInt(ref.style.height, 10);
              if (!isNaN(newWidth) && !isNaN(newHeight)) {
                setShapes((prevShapes) =>
                  prevShapes.map((s) =>
                    s.id === id
                      ? {
                          ...s,
                          width: newWidth,
                          height: newHeight,
                          ...position,
                        }
                      : s
                  )
                );
              } else {
                console.warn('Invalid resize dimensions detected for shape:', id, { newWidth, newHeight });
              }
            }}
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            style={{
              zIndex: 3,
            }}
            onClick={() => {
              if (connectMode) {
                if (startShape) {
                  // If there's already a start shape, draw an arrow
                  if (startShape.id !== shape.id) {
                    addArrow(startShape.id, shape.id);
                    setStartShape(null); // Reset after drawing
                  }
                } else {
                  // Select the first shape
                  setStartShape(shape);
                }
              } else {
                handleShapeSelect(shape)(); // Ensure this is called correctly
              }
            }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveShape(id); // Use shape ID for removal
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Rnd>
        );
      })}

      {/* Render arrows */}
      {arrows.map((arrow, index) => (
        <Xarrow
          key={`${arrow.start}-${arrow.end}-${index}`}
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
    </Box>
  );
};

export default Grid;
