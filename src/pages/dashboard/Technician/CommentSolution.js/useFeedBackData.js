

import { useState, useEffect } from "react";
import { getTicketByTicketId } from "../../../app/api/ticket";
import { getDetailFeedBack } from "../../../../app/api/feedback";

const useTicketData = (feedBackId) => {
  const [error, setError] = useState(null);
  const [dataFeedBack, setDataFeedBack] = useState({
    id: 0,
    userId: 1,
    solutionId: 1,
    comment: "",
    isPublic: true,
    createdAt: "",
    modifiedAt: "",
    feedbackReplies: {
        id: 1,
        userId: 1,
        solutionId: 1,
        comment: "",
        isPublic: false,
        createdAt: "",
        modifiedAt: "",
        feedbackReplies: "",
        user: "",
    },
    user: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        avatarUrl: "",
        address: "",
        role: 1,
        phoneNumber: "",
        isActive: true,
    },
    service: {
        type: "",
        description: "",
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const feedBackData = await getDetailFeedBack(feedBackId);
        if (isMounted) {
          setData({
            ...feedBackData,
          });
        }
      } catch (error) {
        console.error("Error fetching ticket data: ", error);
        if(isMounted){
            setError(error);
        }
      }
    };

    fetchData();
    return () => {
        isMounted = false;
      };
    }, [feedBackId]);
  
    if (error) {
      return { error }; // Return error separately
    }
    return { data }; // Return data separately
};

export default useTicketData;
