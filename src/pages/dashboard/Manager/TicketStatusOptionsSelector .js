import React, { useState } from "react";
import { TicketStatusOptions } from "../Admin/tableComlumn";

const TicketStatusOptionsSelector = ({ ticket, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(0);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    onUpdateStatus(event.target.value);
  };

  const selectedStatusOption = TicketStatusOptions.find(
    (option) => option.id === selectedStatus
  );

  return (
    <td>
    <select
      value={selectedStatus}
      onChange={handleStatusChange}
      style={selectedStatusOption.badgeStyle}
    >
      {TicketStatusOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
    {selectedStatusOption && (
      <div style={selectedStatusOption.badgeStyle}>
        {selectedStatusOption.icon}
        {selectedStatusOption.name}
      </div>
    )}
  </td>
  );
};

export default TicketStatusOptionsSelector;
