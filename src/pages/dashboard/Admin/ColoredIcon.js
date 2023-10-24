import React from 'react';

const ColoredIcon = ({ icon, color }) => {
  return (
    <div className={`bg-${color} rounded-circle p-2`}>
      {React.cloneElement(icon, { style: { color: 'white' } })}
    </div>
  );
};

export default ColoredIcon;