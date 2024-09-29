import React from 'react';
import { styled } from '@mui/system';

const SVGContainer = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block', // Ensures the SVG fills the parent container
  cursor: 'pointer',
  padding: 0, // Ensure no padding
  margin: 0,  // Ensure no margin
  boxSizing: 'border-box', // Include border in element's total width and height
});

const Sort = (props) => {
  const { bgColor = '#ccffd5', label = 'Sort', fontSize = '12' } = props;
  const strokeColor = '#838383';

  return (
    <SVGContainer
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M32,.5L.5,32l31.5,31.5,31.5-31.5L32,.5Z"
        fill={bgColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1,32h62"
        fill="none"
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

export default Sort;
