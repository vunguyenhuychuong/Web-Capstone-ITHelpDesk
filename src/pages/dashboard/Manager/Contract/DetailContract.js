import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "../../../../assets/css/ticket.css";
import "../../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FaFileContract } from "react-icons/fa";
import {
  ArrowBack,
  ChatOutlined,
  Paid,
  ReceiptLong,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import AssignTicketModal from "../AssignTicketModal";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { formatDate } from "../../../helpers/FormatDate";
import { Box } from "@mui/system";
import LoadingSkeleton from "../../../../components/iconify/LoadingSkeleton";
import { useSelector } from "react-redux";
import useContractData from "./useContractData";
import PaymentContract from "./PaymentContract";
import Details from "./Details";
import { getStatusContract } from "../../../helpers/tableComlumn";
import ReactImageGallery from "react-image-gallery";
import ConfirmDialog from "../../../../components/dialog/ConfirmDialog";
import { deleteContract } from "../../../../app/api/contract";

const DetailContract = () => {
  const { contractId } = useParams();
  const {
    data,
    loading,
    setData,
    fetchData: refetch,
  } = useContractData(contractId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTicket = (contractId) => {
    navigate(`/home/editContract/${contractId}`);
  };

  const handleDeleteContract = async (contractId) => {
    try {
      await deleteContract(contractId);
      // await refetch();
      handleCloseConfirm();
      handleGoBack();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseAssignTicket = () => {
    setDialogOpen(false);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleOpenImagePreview = () => {
    setIsImagePreviewOpen(true);
  };

  const handleCloseImagePreview = () => {
    setIsImagePreviewOpen(false);
  };
  const handleGoBack = () => {
    if (userRole === 2) {
      navigate(`/home/contractList`);
    } else if (userRole === 4) {
      navigate(`/home/contractList`);
    }
  };
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
  useEffect(() => {
    setValue(0);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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

            {data.status !== 1 && (
              <>
                <Button
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                  }}
                  onClick={() => handleOpenEditTicket(contractId)}
                >
                  Edit
                </Button>

                <Button
                  color="error"
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                  }}
                  onClick={() => setOpenConfirm(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </Stack>

          <MDBRow className="mb-2">
            <MDBCol
              md="12"
              className="mt-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                className="circular-container"
                style={{ marginRight: "10px" }}
              >
                <FaFileContract size="2em" color="#007bff" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                  #{data.id} {data.name || "null Name"}
                </span>
                <span>
                  Contract number:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {data.contractNumber}
                  </span>
                </span>
                <span style={{ fontSize: "1rem" }}>
                  Status:{" "}
                  <Chip
                    label={getStatusContract(data.status)?.name}
                    sx={{
                      color: "white",
                      backgroundColor: getStatusContract(data.status)?.color,
                    }}
                  />
                  <span className="bold-text"></span>{" "}
                  <ChatOutlined color="#007bff" />
                  <span className="bold-text"> Valid till:</span>{" "}
                  {formatDate(data.endDate)}
                </span>
              </div>
            </MDBCol>
            <Stack direction="row" justifyContent={"center"}>
              {data?.attachmentUrls && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOpenImagePreview}
                  style={{ marginTop: "2rem", width: "50%" }}
                >
                  View Attachments
                </Button>
              )}
            </Stack>
          </MDBRow>
          <Box sx={{ width: "100%" }}>
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
                    <ReceiptLong sx={{ marginRight: 1 }} /> Contract Details
                  </div>
                }
                className="custom-tab-label"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textTransform: "none",
                    }}
                  >
                    <Paid sx={{ marginRight: 1 }} /> Payment
                  </div>
                }
                className="custom-tab-label"
              />
            </Tabs>
            <Box role="tabpanel" hidden={value !== 0}>
              {value === 0 ? (
                <Details data={data} loading={loading || false} />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
            <Box role="tabpanel" hidden={value !== 1}>
              {value === 1 ? (
                <PaymentContract
                  dataPayment={data}
                  loading={loading || false}
                />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={isImagePreviewOpen}
        onClose={handleCloseImagePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Attachment Image Preview</DialogTitle>
        <DialogContent>
          <ReactImageGallery items={previewImages} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImagePreview} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <AssignTicketModal
        open={dialogOpen}
        onClose={handleCloseAssignTicket}
        ticketId={contractId}
      />
      <ConfirmDialog
        content={"Are you sure want to delete this contract?"}
        open={openConfirm}
        action={() => handleDeleteContract(contractId)}
        handleClose={handleCloseConfirm}
      />
    </>
  );
};

export default DetailContract;
