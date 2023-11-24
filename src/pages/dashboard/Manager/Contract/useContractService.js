import { useState, useEffect } from "react";
import { getContractService } from "../../../../app/api/contract";

const useContractService = (contractId) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataContractService, setDataContractService] = useState({
    contractId: 1,
    serviceId: 1,
    contract: {
      name: "",
      description: "",
    },
    service: {
      description: "",
      type: "",
      amount: "",
      id: 1,
      email: "",
      createdAt: "",
      modifiedAt: "",
      deletedAt: "",
    },
  });

  console.log(dataContractService);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractData = await getContractService(contractId);
        setDataContractService({
          ...contractData,
        });
      } catch (error) {
        console.error("Error fetching contract data: ", error);
      }
    };

    fetchData();
  }, [contractId]);

  if (error) {
    return { error }; // Return error separately
  }
  return { loading, dataContractService, error };  // Return data separately
};

export default useContractService;
