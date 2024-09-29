import React from 'react';
import { styled } from '@mui/system';

const Container = styled('div')({
  width: '100%',
  height: '100%',
  position: 'relative', // Ensures the text is positioned relative to this container
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

const SVGContainer = styled('svg')({
  width: '100%',  // Ensures the SVG fills the parent container
  height: '100%', // Ensures the SVG fills the parent container
  display: 'block', // Ensures the SVG fills the parent container
});

const Junction = (props) => {
  const { bgColor = '#ccffd5', label = 'Junction' } = props;
  const strokeColor = '#838383';

  return (
    <Container>
      <SVGContainer
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        preserveAspectRatio="none"
        {...props}
      >
        <circle
          cx="32"
          cy="32"
          r="31.5"
          fill={bgColor}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g>
          <path
            d="M10,10l44,44"
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M54,10L10,54"
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="0.5em"
          fill="black"
        >
          {label}
        </text>
      </SVGContainer>
    </Container>
  );
};

export default Junction;
