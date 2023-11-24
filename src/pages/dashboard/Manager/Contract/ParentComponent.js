import { Details } from "@mui/icons-material";
import useContractData from "./useContractData";
import useContractService from "./useContractService";

const ParentComponent = ({ contractId }) => {
    const { loading: loadingService, dataContractService, error: errorService } = useContractService(contractId);
    const { data: contractData, error: errorData } = useContractData(contractId);
  
    if (errorService || errorData) {
      return <div>Error: {errorService ? errorService.message : errorData.message}</div>;
    }
  
    if (loadingService || !contractData) {
      return <div>Loading...</div>;
    }
  
    return <Details data={contractData} loading={loadingService} dataContractService={dataContractService} />;
  };
  
  export default ParentComponent;