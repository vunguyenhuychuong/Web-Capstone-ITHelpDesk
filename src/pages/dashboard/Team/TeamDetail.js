import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ArrowBack, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CircularLoading from "../../../components/iconify/CircularLoading";
import { truncateUrl } from "../../helpers/FormatText";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import { getTeamById } from "../../../app/api/team";
import {
  createTeamMemberAssign,
  deleteTeamMember,
  getMemberSelect,
  getTeamMemberById,
} from "../../../app/api/teamMember";
import moment from "moment";

const TeamDetail = () => {
  const { teamId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [dataMember, setDataMember] = useState([]);
  const [dataSelectMembers, setDataSelectMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [data, setData] = useState({
    id: null,
    description: "",
    location: "",
    name: "",
    manager: null,
    modifiedAt: "",
    createdAt: "",
    category: null,
    isActive: true,
  });
  const [editedData, setEditedData] = useState({
    memberId: 1,
    teamId: 1,
    expertises: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    memberId: "",
    teamId: "",
    expertises: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenDialog = async () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const res = await getTeamById(teamId);
      setData((prevData) => ({
        ...prevData,
        id: res.id,
        description: res.description,
        location: res.location,
        name: res.name,
        manager: res.manager,
        modifiedAt: res.modifiedAt,
        createdAt: res.createdAt,
        category: res.category,
        isActive: res.isActive,
        // customerAdminId: res.customerAdminId,
      }));
    } catch (error) {
      toast.error("Can not get Team");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectTeamMemberList = async () => {
    try {
      const res = await getMemberSelect(teamId);
      if (!res || res.length === 0) {
      } else {
        setDataSelectMembers(res);
        if (res?.length > 0) {
          setEditedData((prev) => ({ ...prev, memberId: res[0]?.id }));
        }
      }
    } catch (error) {
      console.log("Error fetching member data: ", error);
    }
  };

  const fetchTeamMemberList = async () => {
    try {
      const res = await getTeamMemberById(teamId);
      if (!res || res.length === 0) {
      } else {
        setDataMember(res);
      }
    } catch (error) {
      console.log("Error fetching member data: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const handleSubmitMember = async () => {
    try {
      setIsSubmitting(true);
      const errors = {};
      if (!editedData.memberId) {
        errors.memberId = "Member is required";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      const res = await createTeamMemberAssign(editedData);
      if (res) {
        fetchTeamMemberList();
        fetchSelectTeamMemberList();
      }
    } catch (error) {
      console.error("Error deleting company member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    const shouldDelete = window.confirm(
      "Are you sure want to remove this member?"
    );
    if (shouldDelete) {
      try {
        const res = await deleteTeamMember(memberId);
        if (res) {
          fetchTeamMemberList();
          fetchSelectTeamMemberList();
        }
      } catch (error) {
        console.error("Error deleting company member:", error);
      } finally {
      }
    }
  };

  const handleSelectMember = (memberId) => {
    if (selectedMemberIds.includes(memberId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== memberId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, memberId]);
    }
  };

  const handleSelectAllMemberes = () => {
    if (selectedMemberIds.length === dataMember.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(dataMember?.map((member) => member.id));
    }
  };

  const handleDeleteSelectedMemberes = () => {
    try {
      if (selectedMemberIds.length === 0) {
        console.log("No selected memberes to delete.");
        return;
      }
      let currentIndex = 0;
      const deleteNextMember = () => {
        if (currentIndex < selectedMemberIds.length) {
          const memberId = selectedMemberIds[currentIndex];
          deleteTeamMember(memberId)
            .then(() => {
              console.log(`Member with ID ${memberId} deleted successfully`);
              currentIndex++;
              deleteNextMember();
            })
            .catch((error) => {
              console.error(
                `Error deleting member with ID ${memberId}: `,
                error
              );
              toast.error(`Error deleting member with ID ${memberId}: `, error);
            });
        } else {
          setSelectedMemberIds([]);
          toast.success("Selected memberes deleted successfully");
          fetchTeamMemberList();
          fetchSelectTeamMemberList();
        }
      };
      deleteNextMember();
    } catch (error) {
      console.error("Failed to delete selected members: ", error);
      toast.error("Failed to delete selected members, Please try again later");
    }
  };

  const handleOpenEditTeam = (teamId) => {
    navigate(`/home/editTeam/${teamId}`);
  };

  const handleGoBack = () => {
    navigate(`/home/team`);
  };
  useEffect(() => {
    setValue(0);
  }, []);

  useEffect(() => {
    fetchTeamData();
    fetchTeamMemberList();
    fetchSelectTeamMemberList();
  }, [teamId]);

  if (loading) {
    return <CircularLoading></CircularLoading>;
  }

  return (
    <>
      <Grid
        container
        style={{
          border: "1px solid #ccc",
          paddingRight: "10px",
          paddingLeft: "10px",
        }}
      >
        <Grid
          item
          style={{
            flex: 1,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            sx={{
              backgroundColor: "#EEEEEE",
              padding: 0.75,
            }}
            spacing={2}
          >
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
              }}
              onClick={handleGoBack}
            >
              <ArrowBack />
            </Button>

            {/* <Button
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
              }}
              onClick={() => handleOpenEditTeam(teamId)}
            >
              Edit
            </Button> */}
          </Stack>

          <Typography
            variant="h5"
            sx={{ borderBottom: "solid 1px #000", py: 1 }}
          >
            Team Detail
          </Typography>
          {!data.id ? (
            <CircularLoading />
          ) : (
            <Stack direction={"row"}>
              <Stack
                spacing={1}
                width={"50%"}
                sx={{ borderRight: "solid 1px #000" }}
                p={2}
              >
                <span>
                  Team Name:
                  <span style={{ fontWeight: "bold" }}>{data?.name}</span>
                </span>
                <span>
                  Category:
                  <span style={{ fontWeight: "bold" }}>
                    {data.category?.name}
                  </span>
                </span>
                <span>
                  Description:
                  <span style={{ fontWeight: "bold" }}>
                    {data?.description}
                  </span>
                </span>
                <span>
                  Location:
                  <span style={{ fontWeight: "bold" }}>{data?.location}</span>
                </span>
              </Stack>
              <Stack spacing={1} width={"50%"} p={2}>
                <span>
                  Manager:
                  <span style={{ fontWeight: "bold" }}>
                    {data.manager?.firstName} {data.manager?.lastName}
                  </span>
                </span>
                <span>
                  Created At:
                  <span style={{ fontWeight: "bold" }}>
                    {data.createdAt
                      ? moment(data.createdAt).format("MM/DD/YYYY hh:mm A")
                      : "-"}
                  </span>
                </span>
                <span>
                  Last Updated At:
                  <span style={{ fontWeight: "bold" }}>
                    {data.modifiedAt
                      ? moment(data?.modifiedAt).format("MM/DD/YYYY hh:mm A")
                      : "-"}
                  </span>
                </span>
              </Stack>
            </Stack>
          )}
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            p={2}
            sx={{
              background: "#EEEEEE",
              borderBottom: "2px solid #CCCCCC",
              minWidth: "60vw",
              width: "100%",
            }}
          >
            <Typography colSpan={4} variant="h6">
              Team's Members
            </Typography>

            <Button
              variant="contained"
              onClick={() => {
                handleOpenDialog();
              }}
            >
              Add
            </Button>

            {/* <Button
                  variant="contained"
                  onClick={() => {
                    setEditedData({
                      address: dataAddress.address,
                      phoneNumber: dataAddress.phoneNumber,
                    });
                    setIsEditing(true);

                    handleOpenEditDialog();
                  }}
                >
                  Edit
                </Button> */}
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenConfirm(true)}
            >
              Remove
            </Button>
          </Stack>
          <Stack
            style={{
              minWidth: "60vw",
              width: "100%",
              marginBottom: "10px",
              border: "1px solid #000",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      width: "30px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMemberIds?.length === dataMember?.length}
                      onChange={handleSelectAllMemberes}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      width: "30px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  ></TableCell>

                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Full Name
                  </TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Phone Number
                  </TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataMember?.map((teamMember) => {
                  const isSelected = selectedMemberIds.includes(teamMember.id);
                  return (
                    <TableRow key={teamMember.id}>
                      <TableCell
                        sx={{
                          marginTop: "10px",
                          textAlign: "center",
                          width: "30px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        <input
                          style={{ width: 10, height: 10 }}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectMember(teamMember.id)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          marginTop: "10px",
                          textAlign: "center",
                          width: "30px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        <img
                          src={
                            teamMember?.member?.avatarUrl ??
                            "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                          }
                          alt="Member Avatar"
                          style={{ width: 50, height: "auto" }}
                        />
                      </TableCell>

                      <TableCell
                        style={{
                          marginTop: "10px",
                          width: "150px",
                          textAlign: "center",
                        }}
                      >
                        {teamMember?.member?.firstName}{" "}
                        {teamMember?.member?.lastName}
                      </TableCell>
                      <TableCell
                        style={{
                          marginTop: "10px",
                          width: "150px",
                          textAlign: "center",
                        }}
                      >
                        {teamMember?.member?.email}
                      </TableCell>
                      <TableCell
                        style={{
                          marginTop: "10px",
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        {teamMember?.member?.phoneNumber}
                      </TableCell>
                      <TableCell
                        style={{
                          marginTop: "10px",
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          color="error"
                          onClick={() => {
                            handleDeleteMember(teamMember.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Stack>
          <Dialog
            open={openDialog}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Add"} New Member</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="h6">Member:</Typography>
                    <Select
                      labelId="select-label"
                      id="select-member"
                      name="memberId"
                      value={editedData.memberId}
                      onChange={handleInputChange}
                      style={{ width: "100%" }}
                    >
                      {dataSelectMembers.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  {fieldErrors.memberId && (
                    <div style={{ color: "red" }}>{fieldErrors.memberId}</div>
                  )}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="h6">Expertise:</Typography>
                    <TextField
                      value={editedData.expertises}
                      onChange={handleInputChange}
                      name={"expertises"}
                    />
                  </Stack>
                  {fieldErrors.expertises && (
                    <div style={{ color: "red" }}>{fieldErrors.expertises}</div>
                  )}
                </Stack>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubmitMember}>
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
              <Button onClick={handleCloseDialog} color="error">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
};

export default TeamDetail;
