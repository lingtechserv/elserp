import { useState } from 'react';

const useShapes = () => {
  const [shapes, setShapes] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [connectMode, setConnectMode] = useState(false); // Added state for connect mode
  const [lineType, setLineType] = useState('solid');
  const [startShape, setStartShape] = useState(null); // New state to store the first selected shape in connect mode

  // Function to add a shape
  const addShape = (shape) => {
    setShapes((prevShapes) => [...prevShapes, shape]);
  };
  
  const removeShape = (shapeId) => {
    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== shapeId));
    setArrows((prevArrows) => prevArrows.filter((arrow) => arrow.start !== shapeId && arrow.end !== shapeId));
    if (selectedShape && selectedShape.id === shapeId) {
      setSelectedShape(null);
    }
  };
  
  const updateShape = (shapeId, newProperties) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) => (shape.id === shapeId ? { ...shape, ...newProperties } : shape))
    );
  };

  // Function to add an arrow between two shapes
  const addArrow = (startShapeId, endShapeId) => {
    setArrows((prevArrows) => [
      ...prevArrows,
      { start: startShapeId, end: endShapeId, type: lineType }
    ]);
  };

  return {
    shapes,
    setShapes,
    arrows,
    setArrows,
    selectedShape,
    setSelectedShape,
    connectMode,
    setConnectMode,
    lineType,
    setLineType,
    startShape,
    setStartShape,
    addShape,
    removeShape,
    updateShape,
    addArrow,
  };
};

export default useShapes;
