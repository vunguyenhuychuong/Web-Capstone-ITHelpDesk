import { useEffect } from "react";
import { getTicketSolutionById } from "../../../app/api/ticketSolution";
import { useState } from "react";


const useSolutionTicketData = (solutionId) => {
    // const [error, setError] = useState(null);
    const [data, setData] = useState(null);
  
    useEffect(() => {
      let isMounted = true;
      const fetchData = async () => {
        try {
          const solutionTicketData = await getTicketSolutionById(solutionId);
          if (isMounted) {
            setData(solutionTicketData);
          }
        } catch (error) {
          console.error("Error fetching ticket data: ", error);
        //   if(isMounted){
        //       setError(error);
        //   }
        }
      };
  
      fetchData();
      return () => {
          isMounted = false;
        };
      }, [solutionId]);
    
      return { data }; // Return data separately
  };
  
  export default useSolutionTicketData;