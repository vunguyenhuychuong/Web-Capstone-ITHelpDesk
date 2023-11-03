import React from "react";
import moment from "moment";

const DateValidation = ({ reviewDate, expiredDate }) => {
  const isReviewDateBeforeExpiredDate = moment(reviewDate).isBefore(expiredDate);
  const isSameDay = moment(reviewDate).isSame(expiredDate, 'day');

  if (!isReviewDateBeforeExpiredDate || (isSameDay && moment(reviewDate).isSameOrAfter(expiredDate, 'hour'))) {
    return (
        <div style={{
            color: "red",
            textAlign: "center", // Center the text horizontally
          }}>
            Review Date must be earlier than Expired Date.
          </div>
    );
  }

  return null;
};

export default DateValidation;