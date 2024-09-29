import React, { useState } from 'react';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';

const LaneContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  position: 'relative',
  border: '1px solid #ccc',
});

const Lane = styled(Box)(({ bgColor, selected }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderTop: '1px solid #ccc',
  backgroundColor: selected ? '#a0c4ff' : bgColor || '#f0f0f0',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
}));

const LaneLabel = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderBottom: '1px solid #ccc',
  padding: '4px 0',
  fontWeight: 'bold',
});

const Swimlanes = ({ label = 'Swimlane', bgColor, children }) => {
  const [selected, setSelected] = useState(false);

  const handleLaneClick = () => {
    setSelected(!selected);
  };

  return (
    <LaneContainer>
      <Lane bgColor={bgColor} selected={selected} onClick={handleLaneClick}>
        <LaneLabel>{label}</LaneLabel>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            style: { ...child.props.style, position: 'absolute' },
          })
        )}
      </Lane>
    </LaneContainer>
  );
};

export default Swimlanes;
