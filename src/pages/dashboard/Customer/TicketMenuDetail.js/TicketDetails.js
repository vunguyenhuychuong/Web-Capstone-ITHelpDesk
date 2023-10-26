import React, { useEffect, useState } from "react";
import "../../../../assets/css/ticket.css";
import "../../../../assets/css/ServiceTicket.css";
import "../../../../assets/css/EditTicket.css";
import { Grid, Stack } from "@mui/material";
import { MDBCol, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import useTicketData from "../../Manager/useTicketData";
import { ImpactOptions, TicketStatusOptions } from "../../Admin/tableComlumn";
import { formatDate } from "../../../helpers/FormatDate";

const TicketDetails = ({ ticketId }) => {
  const { data, loading, setData } = useTicketData(ticketId);
 ;
  return (
    <Grid container style={{ paddingLeft: "10px", paddingRight: "20px" }}>
      <Grid item xs={12}>
        <MDBCol md="12">
          <Stack spacing={2} direction="row">
            <MDBTable bordered>
              <MDBTableBody>
                <tr>
                  <th className="gray-background align-right">Requester</th>
                  <th className="align-left">
                    {data.requester.lastName} {data.requester.firstName}
                  </th>
                  <th className="gray-background align-right">Impact</th>
                  <th className="align-left">
                    {ImpactOptions[data.impact]?.name || "-"}
                  </th>
                </tr>
                <tr>
                  <th className="gray-background align-right">Status </th>
                  <th className="align-left">
                    {TicketStatusOptions[data.ticketStatus]?.name || "-"}
                  </th>
                  <th className="gray-background align-right">Impact Detail</th>
                  <th className="align-left">{data.impactDetail || "-"}</th>
                </tr>
                <tr>
                  <td className="gray-background align-right">Mode </td>
                  <td className="align-left"></td>
                  <td className="gray-background align-right">Urgency</td>
                  <td className="align-left">Not Assign</td>
                </tr>
                <tr>
                  <td className="gray-background align-right">Service Type</td>
                  <td className="align-left">Not Assign </td>
                  <td className="gray-background align-right">Priority </td>
                  <td className="align-left">Not Assign</td>
                </tr>
                <tr>
                  <td className="gray-background align-right">
                    E-mail Id(To Notify){" "}
                  </td>
                  <td className="align-left">{data.requester.email || "-"}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="gray-background align-right">
                    Assign Technician{" "}
                  </td>
                  <td className="align-left">{data.category.assignedTechnical || "-"}</td>
                  <td className="gray-background align-right">Create Date</td>
                  <td className="align-left">{formatDate(data.createdAt)}</td>
                </tr>
                <tr>
                  <td className="gray-background align-right">
                    ScheduledStartTime{" "}
                  </td>
                  <td className="align-left">{formatDate(data.scheduledStartTime || "-")}</td>
                  <td className="gray-background align-right">
                    ScheduledEndTime{" "}
                  </td>
                  <td className="align-left">{formatDate(data.scheduledEndTime || "-")}</td>
                </tr>
                <tr>
                  <td className="gray-background align-right">Due Time </td>
                  <td className="align-left">{formatDate(data.dueTime || "-")}</td>
                  <td className="gray-background align-right">
                    Completed Time{" "}
                  </td>
                  <td className="align-left">{formatDate(data.completedTime || "-")}</td>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </Stack>
        </MDBCol>
      </Grid>
    </Grid>
  );
};

export default TicketDetails;
