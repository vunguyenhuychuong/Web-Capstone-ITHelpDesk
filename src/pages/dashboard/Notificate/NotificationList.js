import React from "react";
import { useEffect } from "react";
import { getAllNotification } from "../../../app/api/notification";
import { useState } from "react";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import "../../../assets/css/notification.css";
import { formatDate } from "../../helpers/FormatDate";
import LoadingImg from "../../../assets/images/empty email.png";

const NotificationList = ({ notifications }) => {
  const [dataListNotification, setDataListNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchDataListNotification = async () => {
    try {
      const response = await getAllNotification();
      console.log(response);

      // Assuming response is an array, update the state
      if (Array.isArray(response)) {
        setDataListNotification(response);
      } else {
        console.error("Invalid data format received from the API");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataListNotification();
  }, []);

  return (
    <div className="notification-list-container">
      {loading ? (
        // Display LoadingImg when data is still loading
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "100px",
          }}
        >
          <img
            src={LoadingImg}
            alt="No Pending"
            style={{ maxWidth: "350px", maxHeight: "220px" }}
          />
          <p
            style={{
              marginTop: "10px",
              fontSize: "16px",
              color: "#666",
            }}
          >
            No Notification 
          </p>
        </div>
      ) : (
        <Paper elevation={3}>
          <List>
            {dataListNotification.map((notification) => (
              <ListItem key={notification.id}>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {notification.body}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                      >
                        Created At: {formatDate(notification.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default NotificationList;
