import {
  Button,
  Dialog,
  DialogActions,
  Stack,
  Typography,
} from "@mui/material";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import AssignApi, {
  createAssignTicket,
  getTicketAssignedTechnician,
} from "../../../app/api/assign";
import { getAllTeams } from "../../../app/api/team";
import { toast } from "react-toastify";
import { AssignmentTurnedIn } from "@mui/icons-material";

const AssignTicketModal = ({ open, onClose, ticketId }) => {
  const [formData, setFormData] = useState({
    technicianId: "",
    teamId: "",
  });
  const [dataTeam, setDataTeam] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
  const [dataAssignedTechnician, setDataAssignedTechnician] = useState(null);
  const [teamError, setTeamError] = useState("");
  const [technicianError, setTechnicianError] = useState("");

  const fetchAssignTicket = async (teamId) => {
    try {
      const technicians = await AssignApi.getTechnician(teamId);
      setDataTechnician(technicians);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const fetchTicketAssignedTechnician = async () => {
    try {
      const assigns = await getTicketAssignedTechnician(ticketId);
      setDataAssignedTechnician(assigns);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };
  const fetchTeams = async () => {
    try {
      const teams = await getAllTeams();
      setDataTeam(teams);
    } catch (error) {
      console.log("Error while fetching teams", error);
    }
  };
  const handleTeamChange = (event) => {
    const teamId = event.target.value;
    setFormData((prevData) => ({ ...prevData, teamId: parseInt(teamId, 10) }));
    setTeamError("");
    setTechnicianError("");
    if (teamId) {
      fetchAssignTicket(teamId);
    } else {
      setDataTechnician([]);
    }
  };

  const handleTechnicianChange = (event) => {
    const selectedTechnicianId = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      technicianId: parseInt(selectedTechnicianId, 10),
    }));
    setTechnicianError("");
  };

  const handleSubmitAssignTicket = async () => {
    if (!formData.teamId) {
      setTeamError("Please select a Team.");
      return;
    }

    if (!formData.technicianId) {
      setTechnicianError("Please select a Technician.");
      return;
    }
    try {
      await createAssignTicket(ticketId, formData);
      toast.success(`Assigned ticket ${ticketId} successfully`);
    } catch (error) {
      console.log("Error while assigning ticket", error);
    }
    onClose();
  };

  useEffect(() => {
    fetchTeams();
    fetchTicketAssignedTechnician();
  }, []);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <MDBContainer className="py-3">
        <MDBRow className="mb-2">
          <MDBCol className="text-center">
            <h2 style={{ fontWeight: "bold", color: "#3399FF" }}>
              Assign Technician
            </h2>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <Stack
            spacing={1}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            border="solid 1px #c2c2c2"
            paddingY={2}
            marginY={2}
          >
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <AssignmentTurnedIn />
              <Typography fontWeight={"bold"} fontSize={"1.1rem"}>
                Current Assigning
              </Typography>
            </Stack>
            <Stack>
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <Typography fontWeight={"bold"}>Team:</Typography>
                <Typography>
                  {dataAssignedTechnician
                    ? dataAssignedTechnician.teamName
                    : "Not yet"}
                </Typography>
              </Stack>
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <Typography fontWeight={"bold"}>Technician:</Typography>
                <Typography>
                  {dataAssignedTechnician
                    ? dataAssignedTechnician.technicianFullName
                    : "Not yet"}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <MDBCol md="2" className="text-center mt-2">
            <label
              htmlFor="title"
              className="narrow-input"
              style={{ color: "#3399FF", fontWeight: "bold" }}
            >
              Team
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="team"
              name="team"
              className="form-select"
              onChange={handleTeamChange}
              value={formData.teamId}
            >
              <option value="">Select Team</option>
              {dataTeam?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label
              htmlFor="title"
              className="narrow-input"
              style={{ color: "#3399FF", fontWeight: "bold" }}
            >
              Technician
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="technician"
              name="technician"
              className="form-select"
              value={formData.technicianId}
              // onChange={(e) => setSelectedTechnicianId(e.target.value)}
              onChange={handleTechnicianChange}
            >
              <option value="">Select Technician</option>
              {dataTechnician?.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.lastName} {technician.firstName}
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>
        {teamError && teamError}
      </div>
      <div style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>
        {technicianError && technicianError}
      </div>
      <DialogActions
        style={{ justifyContent: "center", backgroundColor: "#EEEEEE" }}
      >
        <Button
          onClick={handleSubmitAssignTicket}
          color="primary"
          autoFocus
          style={{ color: "white", backgroundColor: "#007bff" }}
        >
          Assign
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          autoFocus
          style={{
            color: "white",
            backgroundColor: "#dc3545",
            marginLeft: "10px",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTicketModal;
