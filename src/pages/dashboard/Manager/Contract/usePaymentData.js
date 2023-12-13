import { useState, useEffect } from "react";
import { getPaymentContract } from "../../../../app/api/contract";

const usePaymentData = (contractId) => {
  const [error, setError] = useState(null);
  const [dataPayment, setDataPayment] = useState({
    contractId: "",
    description: "",
    numberOfTerms: 0,
    firstDateOfPayment: "",
    duration: 0,
    initialPaymentAmount: 0,
    isFullyPaid: "",
    paymentFinishTime: "",
    note: "",
    contract: "",
    id: 1,
    createdAt: "",
    modifiedAt: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentData = await getPaymentContract(contractId);
        console.log(paymentData);
        setDataPayment(paymentData);
      } catch (error) {
        console.log("Error fetching contract data: ", error);
      }
    };
    fetchData();
  }, [contractId]);

  if (error) {
    return { error }; // Return error separately
  }
  return { dataPayment }; // Return data separately
};

export default usePaymentData;
