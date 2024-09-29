import React from 'react';
import { styled } from '@mui/system';

const SVGContainer = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block', // Ensures the SVG fills the parent container
  cursor: 'pointer',
});

const Database = (props) => {
  const { bgColor = '#ccf', label = 'Database' } = props;
  const strokeColor = '#838383';

  return (
    <SVGContainer
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 36"
      {...props}
    >
      <path
        d="M.5,4.88c0,2.19,13.86,4.38,31.5,4.38s31.5-2.19,31.5-4.38v26.25c0,2.19-13.86,4.38-31.5,4.38S.5,33.31.5,31.12V4.88Z"
        fill={bgColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M63.5,4.88c0,2.19-13.86,4.38-31.5,4.38S.5,7.06.5,4.88,14.36.5,32,.5s31.5,2.19,31.5,4.38Z"
        fill={bgColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M.5,7.06c0,2.19,13.86,4.38,31.5,4.38s31.5-2.19,31.5-4.38"
        fill="none"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M.5,9.25c0,2.19,13.86,4.38,31.5,4.38s31.5-2.19,31.5-4.38"
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

export default Database;
