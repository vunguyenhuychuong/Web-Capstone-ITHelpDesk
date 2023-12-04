import React from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";
import { database } from "../../../firebase";
import { useState } from "react";
import { useEffect } from "react";
import { onValue, push, ref } from "firebase/database";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { getDataUser, getUserById } from "../../../app/api";
import { getTechnicianList } from "../../../app/api/team";
import ChatContent from "../chatContent/ChatContent";
import { update } from "firebase/database";

const ChatList = () => {
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const userId = user.user.id;
  console.log(userId);
  console.log(userRole);
  const [conversations, setConversations] = useState([]);
  const conversationsRef = ref(database, "conversations");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [dataCustomer, setDataCustomer] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessages] = useState("");
  const messagesRef = ref(database, "messages");

  const handleSelectConversation = (selectedUser) => {
    setSelectedConversation(selectedUser);
    handleCloseDialog();

    const conversationId = selectedUser.participants[0].id;
  };

  const fetchDataSelect = async () => {
    try {
      const fetchCustomer = await getDataUser();
      const fetchTechnician = await getTechnicianList();
      setDataCustomer(fetchCustomer);
      setDataTechnician(fetchTechnician);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataSelect();
  }, []);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const createNewChat = async () => {
    console.log("Selected Customer ID:", selectedCustomerId);
  console.log("Selected Technician ID:", selectedTechnicianId);
    if (selectedCustomerId && selectedTechnicianId) {
      try {
        const customer = await getUserById(selectedCustomerId);
        const technician = await getUserById(selectedTechnicianId);
  
        const newChat = {
          participants: [
            {
              id: selectedCustomerId,
              avatarUrl: customer.avatarUrl,
              username: customer.username,
              role: customer.role,
              firstName: customer.firstName,
              lastName: customer.lastName,
              messages: [], // Initialize an empty array for messages
            },
            {
              id: selectedTechnicianId,
              avatarUrl: technician.avatarUrl,
              username: technician.username,
              role: technician.role,
              firstName: technician.firstName,
              lastName: technician.lastName,
              messages: [], // Initialize an empty array for messages
            },
          ],
        };
  
        const newChatRef = push(conversationsRef, newChat);
        await newChatRef;
  
        setConversations((prevConversations) => [
          ...prevConversations,
          { id: newChatRef.key, ...newChat },
        ]);
  
        handleCloseDialog();
      } catch (error) {
        console.error("Error creating a new chat:", error);
      }
    } else {
      console.error("Error: Customer or Technician not selected");
    }
  };
  

  const sendMessage = () => {
    if (newMessage.trim() !== "" && selectedConversation) {
      console.log("Selected Conversation:", selectedConversation);

      // Add a check to ensure there are participants and the first participant has an id
      if (
        selectedConversation.participants &&
        selectedConversation.participants.length > 0 &&
        selectedConversation.participants[0].id
      ) {
        const newMessageObject = {
          text: newMessage,
          timestamp: new Date().toISOString(),
          avatarUrl: user.user.avatarUrl,
          username: user.user.username,
        };

        // Update the way you get the conversationId
        const conversationId = selectedConversation.id;
        console.log("Conversation ID:", conversationId);

        const updatedParticipants = selectedConversation.participants.map(
          (participant) => {
            if (participant.id === user.user.id) {
              console.log("Participant ID:", participant.id);
              console.log("Participant Messages:", participant.messages);
              return {
                ...participant,
                messages: participant.messages
                  ? [...participant.messages, newMessageObject]
                  : [newMessageObject],
              };
            }
            return participant;
          }
        );

        console.log("Updated Participants:", updatedParticipants);

        const updateObject = {
          [`conversations/${conversationId}/participants`]: updatedParticipants,
        };

        console.log("Update Object:", updateObject);

        update(ref(database), updateObject);

        setMessages((prevMessages) => [
          ...prevMessages,
          { key: newMessageObject.timestamp, ...newMessageObject },
        ]);

        setNewMessages("");
      } else {
        console.error("Error: Participants or Participant ID is undefined");
      }
    } else {
      console.error("Error: New message is empty or Conversation is undefined");
    }
  };

  useEffect(() => {
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.values(data);
        setMessages(messagesArray);
      }
    });

    const unsubscribeConversations = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const conversationsArray = Object.values(data);
        if (conversationsArray) {
          const userConversations = conversationsArray.filter(
            (conversation) =>
              conversation.participants &&
              conversation.participants.some(
                (participant) => participant.id === Number(user.user.id)
              )
          );

          setConversations(userConversations);
          setLoading(false);
        }
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeConversations();
    };
  }, [user.user.id]);

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

  return (
    <>
      <div className="main__chatlist">
        <button className="btn" onClick={handleOpenDialog}>
          <i className="fa fa-plus"></i>
          <span>New conversation</span>
        </button>
        <div className="chatlist__heading">
          <h2>Chats</h2>
          <button className="btn-nobg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
        </div>
        <div className="chatList__search">
          <div className="search_wrap">
            <input type="text" placeholder="Search Here" required />
            <button className="search-btn">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
        <div className="chatlist__items">
          {conversations.map((conversation, index) => (
            <ChatListItems
              key={conversation.id}
              animationDelay={index + 1}
              active={conversation.active ? "active" : ""}
              isOnline={conversation.isOnline ? "active" : ""}
              participants={conversation.participants}
              onSelectConversation={() =>
                handleSelectConversation(conversation)
              }
            />
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          {userRole === 3 ? (
            <div>
              <InputLabel htmlFor="customer-id">Select Customer</InputLabel>
              <Select
                label="Select Customer"
                id="customer-id"
                variant="outlined"
                value={selectedCustomerId || ""}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                {dataCustomer.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.lastName} {customer.firstName} - {customer.id}
                  </MenuItem>
                ))}
              </Select>
            </div>
          ) : null}

          <div>
            <InputLabel htmlFor="technician-id">Select Technician</InputLabel>
            <Select
              label="Select Technician"
              id="technician-id"
              variant="outlined"
              value={selectedTechnicianId || user.user.id}
              onChange={(e) => setSelectedTechnicianId(e.target.value)}
            >
              {dataTechnician.map((technician) => (
                <MenuItem key={technician.id} value={technician.id}>
                  {technician.lastName} {technician.firstName} - {technician.id}
                </MenuItem>
              ))}
            </Select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={createNewChat} variant="contained">
            Save
          </Button>
          <Button onClick={handleCloseDialog} variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {selectedConversation && (
        <ChatContent
          selectedConversation={selectedConversation}
          messages={messages}
          sendMessage={sendMessage}
          setNewMessages={setNewMessages}
        />
      )}
    </>
  );
};

export default ChatList;
