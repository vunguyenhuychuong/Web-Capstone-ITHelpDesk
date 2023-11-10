import React, { useState } from "react";
import {
  Button,
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
import {
  getImpactById,
  getPriorityOption,
  getUrgencyById,
} from "../../helpers/tableComlumn";
import { formatDate } from "../../helpers/FormatDate";
import EditTicketModel from "./EditTicketModel";
import { useTicket } from "./dispatch/TicketContext";
import { UpdateTicketForTechnician } from "../../../app/api/ticket";

const Details = ({ data, loading, dataCategories, dataMode }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const reloadData = () => {
    try {
      // Pass the current data to the updateTicket function to update the context state
      UpdateTicketForTechnician(data);
    } catch (error) {
      console.error('Error while reloading data', error);
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
            value={data.description}
            disabled
          />
          <UploadComponent />
          <div className="buttonContainer">
            <Button variant="contained" className="button">
              Reply All
            </Button>
            <Button variant="contained" className="button">
              Reply
            </Button>
            <Button variant="contained" className="button">
              Forward
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
                onClick={reloadData} // Call the reloadData function when "Properties" section is clicked
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
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Requester</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {data.requester.lastName} {data.requester.firstName}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Impact</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {getImpactById(data.impact)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Status</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {data.ticketStatus}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Impact Detail
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {data.impactDetail || "Not Assigned"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Mode</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {/* {data.mode.description} */}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Urgency</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {getUrgencyById(data.urgency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Service</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {data.service.description}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Priority</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {getPriorityOption(data.priority)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Assignment</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {/* {data.assignment || "Not Assigned"} */}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>Category</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {data.impact}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>
                  Scheduled Start Time
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {formatDate(data.scheduledStartTime)}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Scheduled End Time
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {formatDate(data.scheduledEndTime)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>DueTime</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {formatDate(data.dueTime)}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Completed Time
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {formatDate(data.completedTime)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ textAlign: "right" }}>Created At</TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {formatDate(data.createdAt)}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  Modified At
                </TableCell>
                <TableCell style={{ textAlign: "left" }}>
                  {formatDate(data.modifiedAt)}
                </TableCell>
              </TableRow>

              {isEditDialogOpen && (
                <EditTicketModel
                  open={isEditDialogOpen}
                  onClose={() => setIsEditDialogOpen(false)}
                  ticketId={data.id} // Pass the ticketId to the EditTicketModel component
                  data={data} // Pass the data to the EditTicketModel component
                />
              )}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
};

export default Details;