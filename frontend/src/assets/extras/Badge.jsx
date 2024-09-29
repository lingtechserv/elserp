import React from 'react';

// Badge component definition
const Badge = ({ color, size }) => {
  const badgeStyle = {
    display: 'inline-block',
    backgroundColor: color,
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return <div style={badgeStyle}></div>;
};

export default Badge;
