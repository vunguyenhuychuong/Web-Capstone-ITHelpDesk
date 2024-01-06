import * as React from "react";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { Box, Button, StepButton, StepLabel } from "@mui/material";
import { ColorlibConnector, ColorlibStepIcon } from "./StepperDecorate";
import Step1 from "./StepForm/Step1";
import Step2 from "./StepForm/Step2";
import Step3 from "./StepForm/Step3";
import { CheckCircle, FastForward, FastRewind } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const steps = ["Select Category", "Fill Request", "Complete And Send"];

export default function CustomizedSteppers({
  data,
  handleInputChange,
  handleFileChange,
  handleSubmitTicket,
  imagePreviewUrl,
  isImagePreviewOpen,
  setIsImagePreviewOpen,
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();
  const totalSteps = steps.length;
  const handleNext = () => {
    if (activeStep === 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 0) {
      if (data.title && data.description) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.warning("Please fill in all required fields before proceeding.", {
          autoClose: 3000,
          hideProgressBar: false,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    handleNext();
  };

  const handleGoBack = () => {
    const isFormFilled = Object.values(data).every((value) => value !== "");

    if (isFormFilled) {
      navigate(`home/mains`);
    } else {
      toast.warning("Please fill in the form before submit", {
        autoClose: 3000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepButton onClick={handleStep(index)}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Step1
          data={data}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          imagePreviewUrl={imagePreviewUrl}
          isImagePreviewOpen={isImagePreviewOpen}
          setIsImagePreviewOpen={setIsImagePreviewOpen}
        />
      )}

      {activeStep === 1 && (
        <Step2
          data={data}
          handleSubmit={handleSubmitTicket}
          imagePreviewUrl={imagePreviewUrl}
          isImagePreviewOpen={isImagePreviewOpen}
          setIsImagePreviewOpen={setIsImagePreviewOpen}
        />
      )}

       {activeStep === 2 && (
        <Step3
        />
      )}  

      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          <FastRewind />
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={activeStep === totalSteps - 1 ? handleComplete : handleNext}
        >
          {activeStep === totalSteps - 1 ? (
            <CheckCircle onClick={() => handleGoBack()} />
          ) : (
            <FastForward />
          )}
        </Button>
      </Box>
    </Stack>
  );
}
