import { useState, useEffect } from "react";
import { getTicketByTicketId } from "../../../app/api/ticket";

const useTicketData = (ticketId) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    requesterId: 0,
    title: "",
    description: "",
    modeId: 1,
    serviceId: 1,
    impactDetail: "",
    ticketStatus: 0,
    priority: 0,
    impact: 0,
    urgency: 0,
    categoryId: 1,
    attachmentUrl: [],
    scheduledStartTime: "",
    scheduledEndTime: "",
    dueTime: "",
    createdAt: "",
    modifiedAt: "",
    deletedAt: "",
    dueTime: "",
    completedTime: "",
    requester: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      role: 1,
    },
    category: {
      assignedTechnical: "",
    },
    service: {
      type: "",
      description: "",
    },
  });
  const fetchData = async () => {
    try {
      const ticketData = await getTicketByTicketId(ticketId);
      setData({
        ...ticketData,
      });
    } catch (error) {
      console.error("Error fetching ticket data: ", error);

      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {};
  }, [ticketId]);

  if (error) {
    return { error }; // Return error separately
  }
  return { data, fetchData }; // Return data separately
};

export default useTicketData;
