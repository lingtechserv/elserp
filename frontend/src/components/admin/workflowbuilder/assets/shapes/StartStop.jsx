import React from 'react';
import { styled } from '@mui/system';

const SVGContainer = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block',
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
});

const StartStop = (props) => {
  const { bgColor = '#efc', label = 'Start/Stop' } = props;

  return (
    <SVGContainer
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 61 21"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <path
        d="M53,.5H8C3.84.5.5,4.96.5,10.5s3.35,10,7.5,10h45c4.15,0,7.5-4.46,7.5-10S57.15.5,53,.5Z"
        fill={bgColor}
        stroke="#838383"
        strokeLinecap="round"
        strokeLinejoin="round"
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
    </SVGContainer>
  );
};

export default StartStop;
