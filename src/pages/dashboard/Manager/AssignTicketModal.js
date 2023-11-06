import { Button, Dialog, DialogActions } from "@mui/material";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import AssignApi, { createAssignTicket } from "../../../app/api/assign";
import { getAllTeams } from "../../../app/api/team";
import { toast } from "react-toastify";

const AssignTicketModal = ({ open, onClose, ticketId }) => {
  const [dataTeam, setDataTeam] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");

  const fetchAssignTicket = async (teamId) => {
    try {
      const technicians = await AssignApi.getTechnician(teamId);
      setDataTechnician(technicians);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };


  const handleTeamChange = (event) => {
    const selectedTeamId = event.target.value;
    setSelectedTeamId(selectedTeamId);
    fetchAssignTicket(selectedTeamId);
    setSelectedTechnicianId(""); 
  };

  const handleSubmitAssignTicket = async () => {
    try{
      const data = {
        technicianId: parseInt(selectedTechnicianId, 10),
        teamId: parseInt(selectedTeamId, 10),
      };

      const res = await createAssignTicket(ticketId, data);
      console.log(res);
      toast.success(`Assigned Ticket${ticketId} successful`);
    }catch(error){
      console.log("Error while assigning ticket", error);
    }
    onClose();
  }

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await getAllTeams();
        setDataTeam(teams);
      } catch (error) {
        console.log("Error while fetching teams", error);
      }
    };
    fetchTeams();
  }, []);

  return (
    <Dialog maxWidth="lg" fullWidth open={open} onClose={onClose}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Assign Technician</h2>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label htmlFor="title" className="narrow-input">
              Team
            </label>
          </MDBCol>
          <MDBCol md="5">
            <select
              id="team"
              name="team"
              className="form-select"
              onChange={handleTeamChange} // Call handleTeamChange when team is selected
              value={selectedTeamId} // Set the selected team ID in the dropdown
            >
              <option value="">Select Team</option>
              {dataTeam.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label htmlFor="title" className="narrow-input">
              Technician
            </label>
          </MDBCol>
          <MDBCol md="5">
            <select
              id="technician"
              name="technician"
              className="form-select"
              value={selectedTechnicianId}
              onChange={(e) => setSelectedTechnicianId(e.target.value)}
            >
              <option value="">Select Technician</option>
              {dataTechnician.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.lastName} {technician.firstName}
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <DialogActions>
        <Button onClick={handleSubmitAssignTicket} color="primary" autoFocus>
          Assign
        </Button>
        <Button onClick={onClose} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTicketModal;
