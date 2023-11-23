import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import "../../../assets/css/detailTicket.css";
import { ArrowBack, CreditScore } from "@mui/icons-material";
import UploadComponent from "../../helpers/UploadComponent";
import PropTypes from "prop-types";
import "../../../assets/css/homeManager.css";
import {
  getImpactById,
  getPriorityOption,
  getUrgencyById,
  ticketStatus,
} from "../../helpers/tableComlumn";
import { formatDate } from "../../helpers/FormatDate";
import EditTicketModel from "./EditTicketModel";
import { UpdateTicketForTechnician } from "../../../app/api/ticket";
import { useSelector } from "react-redux";

const Details = ({ data, loading }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const reloadData = () => {
    try {
      UpdateTicketForTechnician(data);
    } catch (error) {
      console.error("Error while reloading data", error);
    }
  };

  const handleImageDialogOpen = () => {
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
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
              variant="subtitle1"
              color="textSecondary"
              className="descriptionLabel"
            >
              Description
            </Typography>
            <ArrowBack className="icon" />
          </div>
          <TextField
            id="description"
            name="description"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            disabled
          />
          <UploadComponent />
          <div className="buttonContainer">
            <Button variant="contained" className="button">
              Reply All
            </Button>

          </div>
          <div className="labelContainer">
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className="descriptionLabel"
            >
              <div
                className="descriptionLabel"
                style={{ cursor: "pointer", color: "blue" }}
                onClick={reloadData}
              >
                Properties <CreditScore /> <span>Reload</span>
              </div>{" "}
              <CreditScore />{" "}
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={handleEditClick}
              >
                Edit
              </span>
            </Typography>
          </div>
          <Table>
            <TableBody>
              <TableRow className="hoverCell">
                <TableCell style={{ textAlign: "right" }}>Requester</TableCell>
                <TableCell style={{ textAlign: "left" }}>

                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Impact</TableCell>
                <TableCell style={{ textAlign: "left" }}>

                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Status</TableCell>
                <TableCell style={{ textAlign: "left" }}>

                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Impact Detail
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Mode</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {/* {data.mode.description} */}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Urgency</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Service</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Priority</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Assignment</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Category</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>
                  Scheduled Start Time
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Scheduled End Time
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>DueTime</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Completed Time
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Created At</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Modified At
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </Grid>
      </Grid>

    </div>
  );
};

export default Details;
