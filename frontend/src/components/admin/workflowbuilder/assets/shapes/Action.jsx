import React from 'react';
import { styled } from '@mui/system';

// Styled SVG container to ensure the SVG fills the parent container and has proper styling
const SVGContainer = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block', // Ensures the SVG fills the parent container
  cursor: 'pointer',
  padding: 0, // Ensure no padding
  margin: 0,  // Ensure no margin
  boxSizing: 'border-box', // Include border in element's total width and height
});

const Action = (props) => {
  // Destructure and provide default values for props
  const { bgColor = '#ccffd5', label = 'Action', fontSize = '12' } = props;
  const strokeColor = '#838383'; // Default stroke color for the rectangle

  return (
    <SVGContainer
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      preserveAspectRatio="none"
      {...props}
    >
      {/* Rectangle representing the Action shape */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth="2"
        rx="4" // Rounded corners
        ry="4" // Rounded corners
      />
      {/* Text label centered in the rectangle */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={`${fontSize}px`}
        fill="black"
      >
        {label}
      </text>
    </SVGContainer>
  );
};

export default Action;
