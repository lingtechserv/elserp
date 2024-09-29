import React from 'react';
import { styled } from '@mui/system';

const SVGContainer = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block', // Ensures the SVG fills the parent container
  cursor: 'pointer',
});

const ManualInput = (props) => {
  const { bgColor = '#dfc', label = 'Manual Input' } = props;
  const strokeColor = '#838383';

  return (
    <SVGContainer
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 61 37"
      {...props}
    >
      <path
        d="M.5,13.21L60.5.5v36H.5V13.21Z"
        fill={bgColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="0.5em" // Ensures font size is responsive
        fill="black"
      >
        {label}
      </text>
    </SVGContainer>
  );
};

export default ManualInput;
