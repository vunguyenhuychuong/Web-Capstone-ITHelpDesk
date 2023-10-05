import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import React, { useEffect, useState } from "react";
import { AddTeam, DeleteDataTeam, getAllTeam } from "../../app/api/team";
import { Close, Description, Face, LocationCity } from "@mui/icons-material";
import {
  MDBBtn,
  MDBCol,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";

const Team = () => {
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [teams, setTeams] = useState([]);
  const [data, setData] = useState({
    id: 0,
    name: "",
    location: "",
    description: "",
    managerId: 0,
    isActive: true,
    createdAt: "",
    modifiedAt: "",
    deletedAt: ""
  });

  const fetchDataTeam = async () => {
    try {
      const TeamList = await getAllTeam();
      setTeams(TeamList);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const onCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const result = await AddTeam({
        name: data.name,
        location: data.location,
        description: data.description,
        managerId: data.managerId,
      });

      if(result.isError === false) {
        setData({
          name: "",
          location: "",
          managerId: 0,
          description: ""
        });
      }
      console.log(result);
      toast.success("Team created successfully");
      setOpenAdd(false);
      fetchDataTeam();
    }catch(error) { 
      toast.error("Fail to create team");
    }
  }

  const onDeleteTeam = async (id) => {
    const shouldDelete = window.confirm("Are you sure want to delete this team");
    if(shouldDelete) {
      try{
        const result = await DeleteDataTeam(id);
        fetchDataTeam();
        if(result.isError === false) {
          toast.success("Delete successful");
        }else{
          toast.error("Delete fail");
        }
      }catch(error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchDataTeam();
  }, []);

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleOpenAdd = (e) => {
    e.preventDefault();
    setOpenAdd(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
  };

  return (
    <Wrapper style={{ backgroundColor: "#eee" }}>
      <div style={{ marginBottom: 20 }}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: 20 }}
          onClick={handleOpenAdd}
        >
          Add Team
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table arial-label="arial-label">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                >
                  <Face style={{ marginLeft: 3 }} /> Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                >
                  <LocationCity style={{ marginRight: 3 }} /> Location
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                >
                  <Description style={{ marginRight: 3 }} /> Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                >
                  ManagerID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                >
                  
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell component="th" scope="row">
                  {team.name}
                </TableCell>
                <TableCell align="left">{team.location}</TableCell>
                <TableCell align="left">{team.description}</TableCell>
                <TableCell align="left">{team.managerId}</TableCell>
                <TableCell align="left">
                  <Button variant="contained" color="secondary" onClick={() => onDeleteTeam(team.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openAdd} fullWidth maxWidth="lg">
        <DialogTitle className="text-center">
          <IconButton
            edge="end"
            onClick={handleClose}
            aria-label="close"
            color="#3b71ca"
            style={{
              position: 'absolute',
              right: '32px',
              top: '8px',
              width: '36px', // Set the width and height to create a square button
              height: '36px',
              backgroundColor: '#2196f3', // Set the background color to blue
              borderRadius: '4px', // Optional: Add border-radius for rounded corners
            }}
          >
            <Close style={{ color: 'white' }} />
          </IconButton>
          Create Team
        </DialogTitle>
        <form style={{ margin: "0px 40px" }} className="custom-dialog ">         
          <MDBRow>
            <MDBCol>
              <InputLabel>Name</InputLabel>
              <MDBInput id="name" value={data.name} onChange={handleChange} name="name" />
            </MDBCol>
            <MDBCol>
              <InputLabel>Manger ID</InputLabel>
              <MDBInput id="managerId" value={data.managerId} onChange={handleChange} name="managerId" />
            </MDBCol>
            <MDBCol>
              <InputLabel>Location</InputLabel>
              <MDBInput id="location" value={data.location} onChange={handleChange} name="location" />
            </MDBCol>
          </MDBRow>  
          <MDBRow>
            <MDBCol>
              <InputLabel>Description</InputLabel>
              <MDBInput id="description" value={data.description} onChange={handleChange} name="description" style={{height: '80px'}}/>
            </MDBCol>
          </MDBRow>  
          <div className="text-center customer-center-btn">
            <MDBBtn className="mb-4 mt-4" type="submit" onClick={onCreateTeam}>
              Add
            </MDBBtn>
          </div>
        </form>
      </Dialog>
    </Wrapper>
  );
};
export default Team;
