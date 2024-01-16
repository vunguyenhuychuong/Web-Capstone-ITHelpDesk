import {
  Cancel,
  CheckCircle,
  Close,
  Create,
  Email,
  Info,
  Pending,
} from "@mui/icons-material";
import { FaImages, FaUser, FaPhoneAlt } from "react-icons/fa";

export const headCells = [
  {
    id: "avatar",
    numeric: false,
    disablePadding: true,
    label: "Avatar",
    icon: <FaImages />,
  },
  {
    id: "Name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    icon: <FaUser />,
  },
  {
    id: "Email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    icon: <Email />,
  },
  {
    id: "Phone",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
    icon: <FaPhoneAlt />,
  },
  {
    id: "Role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "Edit",
    numeric: false,
    disablePadding: false,
  },
  {
    id: "Delete",
    numeric: false,
    disablePadding: false,
  },
];

export const roleOptions = [
  { id: 0, name: "Admin" },
  { id: 1, name: "Customer" },
  { id: 2, name: "Manager" },
  { id: 3, name: "Technical Staff" },
  { id: 4, name: "Accountant" },
];

export const genderOptions = [
  { id: 0, name: "Male" },
  { id: 1, name: "Female" },
];

export const getGenderById = (id) => {
  const gender = genderOptions.find((option) => option.id === id);
  return gender ? gender.name : "Unknown Gender";
};

export const priorityOption = [
  { id: 0, name: "Low" },
  { id: 1, name: "Normal" },
  { id: 2, name: "Medium" },
  { id: 3, name: "High" },
  { id: 4, name: "Critical" },
];

export const getPriorityOption = (priorityId) => {
  const priority = priorityOptions.find((option) => option.id === priorityId);
  return priority ? priority.name : "Unknown Priority";
};

export const priorityOptions = [
  { id: 0, name: "Low", colorClass: "bg-primary", fontSize: "14px" },
  { id: 1, name: "Normal", colorClass: "bg-info", fontSize: "14px" },
  { id: 2, name: "Medium", colorClass: "bg-secondary", fontSize: "14px" },
  { id: 3, name: "High", colorClass: "bg-warning", fontSize: "14px" },
  { id: 4, name: "Critical", colorClass: "bg-danger", fontSize: "14px" },
];

export const getPriorityOptionById = (priorityId) => {
  return (
    priorityOptions.find((option) => option.id === priorityId) || {
      name: "Unknown",
      colorClass: "bg-secondary",
    }
  );
};

export const TypeOptions = [
  { id: 0, name: "Offline" },
  { id: 1, name: "Online" },
];

export const roleColors = {
  0: "#FF6699",
  1: "#6699FF",
  2: "#33CC99",
  3: "#FFCC33",
  4: "#FF33FF",
};

export const getRoleNameById = (roleId) => {
  const role = roleOptions.find((option) => option.id === roleId);
  return role ? role.name : "Unknown Role";
};

export const getRoleName = (role) => {
  switch (role) {
    case 0:
      return "admin";
    case 1:
      return "customer";
    case 2:
      return "manager";
    case 3:
      return "technician";
    case 4:
      return "accountant";
    default:
      return "";
  }
};

export const UrgencyOptions = [
  { id: 0, name: "Low" },
  { id: 1, name: "Medium" },
  { id: 2, name: "High" },
  { id: 3, name: "Urgent" },
];

export const getUrgencyById = (urgencyId) => {
  const urgency = UrgencyOptions.find((option) => option.id === urgencyId);
  return urgency ? urgency.name : "Unknown Urgency";
};

export const ImpactOptions = [
  { id: 0, name: "Low" },
  { id: 1, name: "Medium" },
  { id: 2, name: "High" },
];

export const getImpactById = (impactId) => {
  const impact = ImpactOptions.find((option) => option.id === impactId);
  return impact ? impact.name : "Unknown Impact";
};

export const ticketStatus = [
  { id: 0, name: "Open" },
  { id: 1, name: "Assigned" },
  { id: 2, name: "Progress" },
  { id: 3, name: "Resolved" },
  { id: 4, name: "Closed" },
  { id: 5, name: "Cancelled" },
];

export const getStatusNameById = (statusId) => {
  const statusObject = ticketStatus.find((status) => status.id === statusId);
  return statusObject ? statusObject.name : "Unknown";
};

export const TicketStatusOptions = [
  {
    id: 0,
    displayStatusId: [],
    name: "Open",
    iconClass: "info-icon",
    icon: <Info style={{ color: "#3399FF" }} />,
    badgeStyle: {
      backgroundColor: "white",
      border: "2px solid #3399FF",
      borderRadius: "16px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
    },
  },
  {
    id: 1,
    displayStatusId: [0],
    name: "Assigned",
    iconClass: "info-icon",
    icon: <Create style={{ color: "#FF9933" }} />,
    badgeStyle: {
      backgroundColor: "white",
      border: "2px solid #FF9933",
      borderRadius: "16px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
    },
  },
  {
    id: 2,
    displayStatusId: [1, 3],
    name: "In Progress",
    iconClass: "info-icon",
    icon: <Pending style={{ color: "#339999" }} />,
    badgeStyle: {
      backgroundColor: "white",
      border: "2px solid #339999",
      borderRadius: "16px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
    },
  },
  {
    id: 3,
    displayStatusId: [2],
    name: "Resolved",
    iconClass: "info-icon",
    icon: <CheckCircle style={{ color: "#33CC33" }} />,
    badgeStyle: {
      backgroundColor: "white",
      border: "2px solid #33CC33",
      borderRadius: "16px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
    },
  },
  {
    id: 4,
    displayStatusId: [],
    name: "Close",
    iconClass: "info-icon",
    icon: <Close style={{ color: "#555555" }} />,
    badgeStyle: {
      backgroundColor: "white",
      border: "2px solid #555555",
      borderRadius: "16px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
    },
  },
  {
    id: 5,
    displayStatusId: [],
    name: "Cancelled",
    iconClass: "info-icon",
    icon: <Cancel style={{ color: "#CC3333" }} />,
    badgeStyle: {
      backgroundColor: "white",
      border: "2px solid #CC3333",
      borderRadius: "16px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
    },
  },
];

export const getPriorityBadge = (priorityId) => {
  if (priorityId === 0) {
    return <span className="badge bg-primary rounded-pill">Low</span>;
  } else if (priorityId === 1) {
    return <span className="badge bg-info rounded-pill">Normal</span>;
  } else if (priorityId === 2) {
    return <span className="badge bg-secondary rounded-pill">Medium</span>;
  } else if (priorityId === 3) {
    return <span className="badge bg-warning rounded-pill">High</span>;
  } else {
    return <span className="badge bg-danger rounded-pill">Critical</span>;
  }
};

const Process = {};

for (let i = 1; i <= 100; i++) {
  Process[i] = `${i}%`;
}

export const numberOfTerms = [
  { id: 0, name: "1 month" },
  { id: 1, name: "2 months" },
  { id: 2, name: "3 months" },
  { id: 3, name: "4 months" },
  { id: 4, name: "5 months" },
  { id: 5, name: "6 months" },
  { id: 6, name: "7 months" },
  { id: 7, name: "8 months" },
  { id: 7, name: "9 months" },
  { id: 8, name: "10 months" },
  { id: 10, name: "11 months" },
  { id: 11, name: "12 months" },
  { id: 12, name: "13 months" },
  { id: 13, name: "14 months" },
  { id: 14, name: "15 months" },
  { id: 15, name: "16 months" },
  { id: 16, name: "17 months" },
  { id: 17, name: "18 months" },
  { id: 18, name: "19 months" },
  { id: 19, name: "20 months" },
  { id: 20, name: "21 months" },
  { id: 21, name: "22 months" },
  { id: 22, name: "23 months" },
  { id: 23, name: "24 months" },
];

export const numberOfDuration = [
  { id: 0, name: "3 months" },
  { id: 1, name: "6 months" },
  { id: 2, name: "9 months" },
  { id: 3, name: "12 months" },
  { id: 4, name: "15 months" },
  { id: 5, name: "18 months" },
  { id: 6, name: "21 months" },
  { id: 7, name: "24 months" },
  { id: 8, name: "27 months" },
  { id: 9, name: "30 months" },
  { id: 10, name: "33 months" },
  { id: 11, name: "36 months" },
];

export const statusContract = [
  { id: 0, name: "Pending" },
  { id: 1, name: "Active" },
  { id: 2, name: "Inactive" },
  { id: 3, name: "Expired" },
];

export const getStatusContract = (statusId) => {
  const status = statusContract.find((option) => option.id === statusId);
  return status ? status.name : "Unknown Status";
};

export const getNameFromCode = (code, array) => {
  const item = array.find((item) => item.code === code);
  return item ? item.name : "";
};

export default Process;
