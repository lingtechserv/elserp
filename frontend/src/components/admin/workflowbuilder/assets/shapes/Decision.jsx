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

const Decision = (props) => {
  // Destructure and provide default values for props
  const { bgColor = '#fec', label = 'Decision', fontSize = '12' } = props;
  const strokeColor = '#838383'; // Default stroke color for the diamond

  return (
    <SVGContainer
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      preserveAspectRatio="none"
      {...props}
    >
      {/* Diamond shape representing the Decision shape */}
      <path
        d="M32,0.5L0.5,32l31.5,31.5L63.5,32L32,0.5Z"
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Text label centered in the diamond */}
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

export default Decision;
