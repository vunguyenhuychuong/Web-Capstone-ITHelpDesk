import React from 'react';
import { useEffect } from 'react';
import { getAllNotification } from '../../../app/api/notification';
import { useState } from 'react';
import { Paper } from '@mui/material';
import { formatAMPM } from '../../helpers/FormatAMPM';
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
  }

  useEffect(() => {
    fetchDataListNotification();
  }, []);

  return (
    <div className="notification-list-container">
    <h2 className="notification-list-mainTitle">Notifications</h2>
    <Paper elevation={3}>
      <ul>
        {dataListNotification.map((notification) => (
          <li key={notification.id} className="notification-list-notification">
            <h3 className="notification-list-title">{notification.title}</h3>
            <p>{notification.body}</p>
            <span className="notification-list-createdAt">
              Created At: {formatAMPM(notification.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </Paper>
  </div>
  );
};

export default NotificationList;