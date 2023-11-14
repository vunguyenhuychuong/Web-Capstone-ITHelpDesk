import React from "react";
import { useEffect } from "react";
import { getAllNotification } from "../../../app/api/notification";
import { useState } from "react";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import "../../../assets/css/notification.css";

const NotificationList = ({ notifications }) => {
  const [dataListNotification, setDataListNotification] = useState([]);

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
    }
  };

  useEffect(() => {
    fetchDataListNotification();
  }, []);

  return (
    <div className="notification-list-container">
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
                      Created At: {notification.createdAt}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default NotificationList;
