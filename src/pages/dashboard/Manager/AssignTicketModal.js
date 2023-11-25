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
  const [teamError, setTeamError] = useState('');
  const [technicianError, setTechnicianError] = useState('');

  const fetchAssignTicket = async (teamId) => {
    try {
      const technicians = await AssignApi.getTechnician(teamId);
      setDataTechnician(technicians);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  // const handleTeamChange = (event) => {
  //   const selectedTeamId = event.target.value;
  //   setSelectedTeamId(selectedTeamId);
  //   setTeamError('');
  //   fetchAssignTicket(selectedTeamId);
  //   setSelectedTechnicianId("");
  // };

  const handleTeamChange = (event) => {
    const teamId = event.target.value;
    setSelectedTeamId(teamId);
    setTeamError('');
    setTechnicianError('');
    setSelectedTechnicianId(""); 
    if (teamId) {
      fetchAssignTicket(teamId);
    } else {
      setDataTechnician([]);
    }
  };

  const handleTechnicianChange = (event) => {
    const selectedTechnicianId = event.target.value;
    setSelectedTechnicianId(selectedTechnicianId);
    setTechnicianError('');
  };

  const handleSubmitAssignTicket = async () => {
    if (!selectedTeamId) {
      setTeamError('Please select a Team.');
      return;
    }

    if (!selectedTechnicianId) {
      setTechnicianError('Please select a Technician.');
      return;
    }
    try {
      const data = {
        technicianId: parseInt(selectedTechnicianId, 10),
        teamId: parseInt(selectedTeamId, 10),
      };

      await createAssignTicket(ticketId, data);
      toast.success(`Assigned Ticket${ticketId} successful`);
    } catch (error) {
      console.log("Error while assigning ticket", error);
    }
    onClose();
  };

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
    <Dialog fullWidth open={open} onClose={onClose}>
      <MDBContainer className="py-5" >
        <MDBRow className="mb-4" >
          <MDBCol className="text-center">
            <h2 style={{ fontWeight: "bold", color: "#3399FF" }}>
              Assign Technician
            </h2>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label htmlFor="title" className="narrow-input" style={{ color: "#3399FF", fontWeight: "bold" }}>
              Team
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="team"
              name="team"
              className="form-select"
              onChange={handleTeamChange } // Call handleTeamChange when team is selected
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
            <label htmlFor="title" className="narrow-input" style={{ color: "#3399FF", fontWeight: "bold" }}>
              Technician
            </label>
          </MDBCol>
          <MDBCol md="10">
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
      <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
        {teamError && teamError}
      </div>
      <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
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
