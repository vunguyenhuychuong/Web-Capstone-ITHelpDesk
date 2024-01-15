import React, { useEffect, useState } from "react";
import "../../../assets/css/ticket.css";
import "../../../assets/css/ServiceTicket.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import {
  ArrowBack,
  Feedback,
  Square,
  TipsAndUpdates,
} from "@mui/icons-material";
import CommentSolution from "./CommentSolution.js/CommentSolution";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import useSolutionTicketData from "./SolutionTicketData";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../helpers/FormatDate";
import {
  approveTicketSolution,
  changePublicSolution,
  deleteTicketSolution,
  rejectTicketSolution,
  submitApprovalTicketSolution,
} from "../../../app/api/ticketSolution";
import { toast } from "react-toastify";
import { getRoleName } from "../../helpers/tableComlumn";
import { useSelector } from "react-redux";
import UploadComponent from "../../helpers/UploadComponent";
import { capitalizeWord } from "../../../utils/helper";
import Gallery from "react-image-gallery";
import { getManagerList } from "../../../app/api/team";
import ConfirmDialog from "../../../components/dialog/ConfirmDialog";

const TicketSolutionDetail = () => {
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({ managerId: "", duration: 1 });
  const [selectedFile, setSelectedFile] = useState(null);
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const { loading, data, dataCategories, error, refetch } =
    useSolutionTicketData(solutionId);
  const [dataManagers, setDataManagers] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const associationsRequesterCount = 42;
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const [fileName, setFileName] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [openDurationDialog, setOpenDurationDialog] = useState(false);
  const [views, setViews] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTicketSolution = () => {
    navigate(`/home/editSolution/${solutionId}`);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setFileName(file.name);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchDataManagerList = async () => {
    try {
      const Managers = await getManagerList();
      setDataManagers(Managers);
      setFormData((prevData) => ({
        ...prevData,
        managerId: Managers[0].id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };
  useEffect(() => {
    setViews((prevViews) => prevViews + 1);
    if (userRole === 3) {
      fetchDataManagerList();
    }
  }, []);

  useEffect(() => {
    try {
      const attachmentUrls = data?.attachmentUrls;
      if (attachmentUrls && attachmentUrls.length > 0) {
        const images = attachmentUrls.map((url, index) => ({
          original: url,
          thumbnail: url,
          description: `Attachment Preview ${index + 1}`,
        }));
        setPreviewImages(images);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }, [data]);

  const handleBackTicketSolution = () => {
    navigate("/home/ticketSolution");
    refetch();
  };

  const handleClickChangePublic = async (solutionId) => {
    try {
      await changePublicSolution(solutionId);
      toast.success("Change Ticket Solution public");
      refetch();
    } catch (error) {
      console.log("Error while changing public", error);
    }
  };

  const handleDeleteSolution = async (solutionId) => {
    try {
      await deleteTicketSolution(solutionId);
      toast.success("Delete solution successfully");
      handleBackTicketSolution();
    } catch (error) {
      console.log("Error while deleting solution", error);
    }
  };

  const handleSubmitApproval = async (solutionId, managerId) => {
    try {
      await submitApprovalTicketSolution(solutionId, managerId);
      toast.success("Submitted approval successfully");
      handleApprovalDialogClose();
      refetch();
    } catch (error) {
      console.log("Error while submitting approval", error);
    }
  };

  const handleApproveTicketSolution = async (duration) => {
    try {
      await approveTicketSolution(solutionId, duration);
      toast.success("Approve Ticket Solution");
      handleDurationDialogClose();
      refetch();
    } catch (error) {
      console.log("Error while Approve ticket solution", error);
    }
  };

  const handleRejectTicketSolution = async () => {
    try {
      await rejectTicketSolution(solutionId);
      toast.success("Reject Ticket Solution");
      refetch();
    } catch (error) {
      console.log("Error while reject ticket solution ", error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleImageDialogOpen = () => {
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
  };

  const handleApprovalDialogOpen = () => {
    setOpenApprovalDialog(true);
  };

  const handleApprovalDialogClose = () => {
    setOpenApprovalDialog(false);
  };

  const handleDurationDialogOpen = () => {
    setOpenDurationDialog(true);
  };

  const handleDurationDialogClose = () => {
    setOpenDurationDialog(false);
  };
  return (
    <Grid
      container
      style={{
        border: "1px solid #ccc",
        paddingRight: "10px",
        paddingLeft: "10px",
      }}
    >
      <Grid item xs={9} style={{ paddingRight: "12px" }}>
        <Stack
          direction={"row"}
          sx={{ backgroundColor: "#EEEEEE" }}
          spacing={2}
        >
          <Stack direction={"row"} alignItems={"center"}>
            <Button>
              <ArrowBack
                onClick={handleBackTicketSolution}
                style={{ color: "#0099FF" }}
              />
            </Button>
          </Stack>
          {userRole === 2 ? (
            <Stack direction={"row"} spacing={2} py={1} alignItems={"center"}>
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "5px",
                  color: "green",
                }}
                onClick={() => handleDurationDialogOpen()}
                disabled={data.isApproved}
              >
                Approve
              </Button>
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "5px",
                  color: "#dc3545",
                }}
                onClick={() => handleRejectTicketSolution(solutionId)}
                disabled={!data.isApproved}
              >
                Reject
              </Button>
              <Stack
                sx={{
                  borderRight: "1px solid #000",
                  height: "100%",
                }}
              />
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "5px",
                }}
                onClick={() => handleOpenEditTicketSolution()}
              >
                Edit
              </Button>
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "5px",
                  color: "red",
                }}
                onClick={() => handleOpenEditTicketSolution()}
              >
                Delete
              </Button>
            </Stack>
          ) : null}

          {userRole === 3 ? (
            <Stack direction={"row"} spacing={2} py={1} alignItems={"center"}>
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "5px",
                }}
                onClick={() => handleApprovalDialogOpen()}
              >
                Submit for Approval
              </Button>
              <Stack
                sx={{
                  borderRight: "1px solid #000",
                  height: "100%",
                  display:
                    data?.createdById?.toString() === user.user.id
                      ? "flex"
                      : "none",
                }}
              />
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "5px",
                  display:
                    data?.createdById?.toString() === user.user.id
                      ? "flex"
                      : "none",
                }}
                onClick={() => handleOpenEditTicketSolution()}
              >
                Edit
              </Button>
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "5px",
                  color: "red",
                  display:
                    data?.createdById?.toString() === user.user.id
                      ? "flex"
                      : "none",
                }}
                onClick={() => setOpen(true)}
              >
                Delete
              </Button>
            </Stack>
          ) : null}
        </Stack>
        <MDBRow className="mb-4">
          <MDBCol
            md="10"
            className="mt-2"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="circular-container" style={{ marginRight: 20 }}>
              <TipsAndUpdates size="2em" style={{ color: "#FFCC33" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.8em" }}>
                <span>Topic: </span>{" "}
                <span className="bold-text">
                  {dataCategories.find(
                    (category) => category.id === data.categoryId
                  )?.name || "Unknown Category"}
                </span>
              </span>
              <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                {data.title}
              </span>
            </div>
          </MDBCol>
        </MDBRow>
        <Stack px={12}>
          {/* <div className="labelContainer">
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className="descriptionLabel"
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "#007bff",
              }}
            >
              Description
            </Typography>
            <ArrowBack className="icon" />
          </div> */}
          <TextField
            id="description"
            name="description"
            multiline
            rows={3}
            fullWidth
            variant="standard"
            value={data?.content || ""}
            disabled
            InputProps={{
              style: { fontSize: "1.5em" },
            }}
          />
          {/* <Stack width={"50%"} pt={5}>
            <UploadComponent />
          </Stack> */}
        </Stack>

        {data.attachmentUrls && (
          <Stack
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            pt={5}
          >
            <Button
              variant="contained"
              className="button"
              onClick={handleImageDialogOpen}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              See Attachment
            </Button>
          </Stack>
        )}

        <Box sx={{ width: "100%", pt: 5 }}>
          <Tabs
            onChange={handleTabChange}
            value={value}
            aria-label="Tabs where selection follows focus"
            selectionFollowsFocus
            sx={{
              "& .MuiTabs-root": {
                color: "#007bff",
              },
            }}
          >
            <Tab
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "none",
                  }}
                >
                  <Feedback sx={{ marginRight: 1 }} /> Feedback
                </div>
              }
              className="custom-tab-label"
            />
          </Tabs>
          <Box role="tabpanel" hidden={value !== 0}>
            {value === 0 ? (
              <CommentSolution data={data} refetch={refetch} />
            ) : (
              <LoadingSkeleton />
            )}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          paddingBottom: "10px",
          borderLeft: "1px solid #ccc",
          paddingLeft: "11px",
        }}
      >
        <MDBRow className="border-box" style={{ backgroundColor: "#EEEEEE" }}>
          <MDBCol md="12">
            <div className="d-flex">
              <h2
                className="heading-padding"
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#007bff",
                }}
              >
                Other Information
              </h2>
            </div>
          </MDBCol>
        </MDBRow>

        <Stack marginBottom={3} spacing={2}>
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Typography fontWeight={"bold"}> Solution ID:</Typography>
            <Typography>{data.id}</Typography>
          </Stack>
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Typography fontWeight={"bold"}> Approval Status:</Typography>
            <Typography>
              {" "}
              {data.isApproved ? (
                <>
                  <Square className="square-icon" style={{ color: "green" }} />
                  <span className="text-success">Approved</span>
                </>
              ) : (
                <>
                  <Square className="square-icon" />
                  <span className="text-danger">Not Approved</span>
                </>
              )}
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"space-between"}
            gap={3}
          >
            <Typography fontWeight={"bold"}>Review Date:</Typography>
            <Typography>{formatDate(data.reviewDate)}</Typography>
          </Stack>

          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Typography fontWeight={"bold"}>Expiry Date:</Typography>
            <Typography>{formatDate(data.expiredDate)}</Typography>
          </Stack>
        </Stack>

        <Stack
          paddingTop={3}
          marginTop={3}
          spacing={2}
          sx={{ borderTop: "1px solid #ccc" }}
        >
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Typography fontWeight={"bold"}> Created By:</Typography>
            <Stack textAlign={"end"}>
              <Typography fontWeight={"bold"} color="#3399FF">
                {data.owner && data.owner.role
                  ? capitalizeWord(getRoleName(data.owner.role))
                  : "Unknown Role"}
              </Typography>
              <Typography>
                {data.owner ? formatDate(data.owner.createdAt) : "Unknown Date"}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"space-between"}
            fontWeight={"bold"}
          >
            <Typography fontWeight={"bold"}>Last Updated By:</Typography>
            <Stack textAlign={"end"}>
              <Typography color="#3399FF" fontWeight={"bold"}>
                {data.owner && data.owner.role
                  ? capitalizeWord(getRoleName(data.owner.role))
                  : "Unknown Role"}
              </Typography>
              <Typography>
                {data.owner ? formatDate(data.modifiedAt) : "Unknown Date"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
      <Dialog
        open={openImageDialog}
        onClose={handleImageDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Images</DialogTitle>
        <DialogContent>
          <Gallery items={previewImages} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageDialogClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openApprovalDialog}
        onClose={handleApprovalDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submit Approval to Manager</DialogTitle>
        <DialogContent>
          <select
            id="maganerId"
            name="maganerId"
            className="form-select-custom"
            onChange={handleInputChange}
          >
            {dataManagers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.lastName} {manager.firstName}
              </option>
            ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApprovalDialogClose} color="inherit">
            Close
          </Button>
          <Button
            onClick={() => handleSubmitApproval(solutionId, formData.managerId)}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDurationDialog}
        onClose={handleDurationDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve this solution</DialogTitle>
        <DialogContent>
          <Typography>Solution will be valid for:</Typography>
          <Typography color="grey" variant="caption">
            *1-24 months
          </Typography>
          <TextField
            label="Duration"
            name="duration"
            type="number"
            sx={{ width: "100%", my: 5 }}
            InputProps={{ inputProps: { min: 1, max: 24 } }}
            onChange={(e) => {
              var value = parseInt(e.target.value, 10);

              if (value > 24) e.target.value = 24;
              if (value < 1) e.target.value = 1;
              handleInputChange(e);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDurationDialogClose} color="inherit">
            Close
          </Button>
          <Button
            onClick={() => handleApproveTicketSolution(formData.duration)}
            color="primary"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        content={"Are you sure want to delete this solution?"}
        open={open}
        action={() => handleDeleteSolution(solutionId)}
        handleClose={handleClose}
      />
    </Grid>
  );
};

export default TicketSolutionDetail;
