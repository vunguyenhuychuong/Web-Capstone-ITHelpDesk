import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import "../../../assets/css/detailTicket.css";
import { ArrowBack, Cached, Close, CreditScore } from "@mui/icons-material";
import UploadComponent from "../../helpers/UploadComponent";
import PropTypes from "prop-types";
import "../../../assets/css/homeManager.css";
import { getImpactById, getPriorityOption } from "../../helpers/tableComlumn";
import { formatDate } from "../../helpers/FormatDate";
import EditTicketModel from "./EditTicketModel";
import { UpdateTicketForTechnician } from "../../../app/api/ticket";
import { useSelector } from "react-redux";
import { Editor } from "primereact/editor";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Details = ({
  data,
  loading,
  dataCategories,
  refetch,
  isEditDialogOpen,
  setIsEditDialogOpen,
}) => {
  const [reloadDataFlag, setReloadDataFlag] = useState(false);
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const images =
    data?.attachmentUrls?.map((url, index) => ({
      original: url,
      thumbnail: url,
      description: `Attachment Preview ${index + 1}`,
    })) || [];

  const handleReloadData = () => {
    setReloadDataFlag(true);
  };

  const reloadData = async () => {
    try {
      setReloadDataFlag(true);
      await UpdateTicketForTechnician(data);
    } catch (error) {
      console.error("Error while reloading data", error);
    } finally {
      setReloadDataFlag(false);
    }
  };

  Details.propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" className="gridContainer">
        <Grid item xs={12}>
          <div className="labelContainer">
            <Typography
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "#007bff",
              }}
            >
              Description
            </Typography>
            <ArrowBack className="icon" />
          </div>
          <TextField
            id="description"
            name="description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={data?.description || ""}
            disabled
            InputProps={{
              style: { fontSize: "1.5em" },
            }}
          />
          {/* <Editor
            id="description"
            name="description"
            value={data?.description || ""}
            disabled
            // onTextChange={(e) =>
            //   handleInputChange({
            //     target: { name: "description", value: e.htmlValue },
            //   })
            // }
            style={{ height: "220px" }}
          /> */}
          {/* <UploadComponent /> */}
          {data.attachmentUrls?.length > 0 && (
            <Stack
              width={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              py={5}
            >
              <Button
                variant="contained"
                className="button"
                onClick={() => setIsImagePreviewOpen(true)}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                See Attachments
              </Button>
            </Stack>
          )}

          <div className="labelContainer">
            {" "}
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
              Properties
            </Typography>
            <Stack flexDirection={"row"} alignItems={"center"}>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                sx={{
                  cursor: "pointer",
                  color: "blue",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={refetch}
              >
                <Cached />
                <Typography>
                  {reloadDataFlag ? "Reloading..." : "Reload"}
                </Typography>
              </Stack>
              {/* {userRole === 3 && (
                <CreditScore
                  style={{
                    marginLeft: "10px",
                  }}
                />
              )}
              {userRole === 3 && (
                <span
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    marginLeft: "10px",
                  }}
                  onClick={handleEditClick}
                >
                  Edit
                </span>
              )} */}
            </Stack>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Requester
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {data.requester
                    ? `${data.requester.lastName} ${data.requester.firstName}`
                    : "Manager"}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Impact
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {getImpactById(data.impact)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Type
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {data && data.type ? data.type : "N/A"}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Impact Detail
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {data && data.impactDetail ? data.impactDetail : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Mode
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {data && data.mode && data.mode.description
                    ? data.mode.description
                    : "Mode N/A"}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Priority
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {getPriorityOption(data.priority)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Service
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {data && data.service && data.service.description
                    ? data.service.description
                    : "Service N/A"}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Category
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {dataCategories.find(
                    (category) => category.id === data.categoryId
                  )?.name || "Unknown Priority"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Location
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {data.address}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Scheduled Start Time
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {formatDate(data.scheduledStartTime)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Completed Time
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {formatDate(data.completedTime)}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Scheduled End Time
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {formatDate(data.scheduledEndTime)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Created At
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {formatDate(data.createdAt)}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#007bff",
                    paddingRight: "16px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Modified At
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {formatDate(data.modifiedAt)}
                </TableCell>
              </TableRow>
              {isEditDialogOpen && userRole === 3 && (
                <EditTicketModel
                  open={isEditDialogOpen}
                  onClose={() => setIsEditDialogOpen(false)}
                  ticketId={data.id}
                  data={data}
                  reloadDetailsData={handleReloadData}
                  refetchDetail={refetch}
                />
              )}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <Dialog
        open={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setIsImagePreviewOpen(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Gallery items={images} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Details;
