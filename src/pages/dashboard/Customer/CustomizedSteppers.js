import * as React from "react";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { Box, Button, StepButton, StepLabel } from "@mui/material";
import { ColorlibConnector, ColorlibStepIcon } from "./StepperDecorate";
import { useState } from "react";
import Step1 from "./StepForm/Step1";
import Step2 from "./StepForm/Step2";
import Step3 from "./StepForm/Step3";
import { CheckCircle, FastForward, FastRewind } from "@mui/icons-material";

const steps = ['Select Category', 'Fill Request', 'Complete And Send'];


export default function CustomizedSteppers({
  data,
  handleInputChange,
  handleFileChange,
  handleSubmitTicket,
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [dataCategories, setDataCategories] = useState([]);

  const totalSteps = steps.length;
  console.log(data);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepButton onClick={handleStep(index)}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Step1 data={data} handleInputChange={handleInputChange} dataCategories={dataCategories}/>
      )}

       {activeStep === 1 && (
        <Step2
          data={data}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
        />
      )} 

       {activeStep === 2 && (
        <Step3 data={data} handleSubmit={handleSubmitTicket} />
      )}  
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          <FastRewind />
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={activeStep === totalSteps - 1 ? handleComplete : handleNext}>
          {activeStep === totalSteps - 1 ? <CheckCircle /> : <FastForward />}
        </Button>
      </Box>
    </Stack>
  );
}
