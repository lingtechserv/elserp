import React from 'react';
import { styled } from '@mui/system';

const SVGContainer = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block',
  cursor: 'pointer',
});

const Document = (props) => {
  const { bgColor = '#F78451', label = 'Document', isCompleted = false } = props;
  const strokeColor = '#838383';

  return (
    <SVGContainer xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 65" {...props}>
      <path
        d="M.5.5v54.74c7.4,5.25,17.02,10.5,27.37,9,10.36-1.5,23.67-13.5,38.47-14.25,11.84-.6,21.7,6.75,25.15,10.5V.5H.5Z"
        fill={bgColor}
        stroke={strokeColor}
        strokeMiterlimit={10}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="8"
        fill="black"
      >
        {label}
      </text>

      {!isCompleted && <circle cx="85" cy="7" r="5" fill="red" />}
    </SVGContainer>
  );
};

export default Document;
