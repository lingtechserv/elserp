import React from 'react';
import { styled } from '@mui/system';

const SVGContainer = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block', // Ensures the SVG fills the parent container
  cursor: 'pointer',
});

const Preparation = (props) => {
  const { bgColor = '#fdc', label = 'Preparation' } = props;
  const strokeColor = '#838383';

  return (
    <SVGContainer
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 36"
      {...props}
    >
      <path
        d="M8.9,35.5L.5,18,8.9.5h46.2l8.4,17.5-8.4,17.5H8.9Z"
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

export default Preparation;
