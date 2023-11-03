import { useCallback, useEffect } from "react";
import { getTicketSolutionById } from "../../../app/api/ticketSolution";
import { useState } from "react";
import { getDataCategories } from "../../../app/api/category";

const useSolutionTicketData = (solutionId) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [dataCategories, setDataCategories] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const solutionTicketData = await getTicketSolutionById(solutionId);
      const categoryData = await getDataCategories();
      setData(solutionTicketData);
      setDataCategories(categoryData);
    } catch (error) {
      console.error("Error fetching ticket data: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [solutionId]);

  useEffect(() => {
    fetchData();
  }, [solutionId , fetchData ]);

  const refetch = () => {
    fetchData();
  };

  return { loading, data, dataCategories, error, refetch }; // Return data separately
};

export default useSolutionTicketData;
