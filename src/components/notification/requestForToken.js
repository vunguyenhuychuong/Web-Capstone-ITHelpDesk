import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: 'BH6PcYd2lwt9hZlgs6I6MiIltEWbPL7WKI_pdF9q0ha1sQYJxZufC44it69gF1n47YYXLXUyNSkGvn_uQleUF0M' })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};
