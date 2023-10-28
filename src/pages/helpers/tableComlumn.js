import { Cancel, CheckCircle, Create, DoDisturb, Email, HighlightOff, Info, Pending } from "@mui/icons-material";
import {
  FaImages,
  FaUser,
  FaPhoneAlt,
} from "react-icons/fa";

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
  { id: 4, name: "Sale Staff" },
];

export const genderOptions = [
  { id: 0, name: "Male" },
  { id: 1, name: "Female" },
];

export const priorityOption = [
  { id: 0, name: "Low" },
  { id: 1, name: "Normal" },
  { id: 2, name: "Medium"},
  { id: 3, name: "High"},
  { id: 4, name: "Critical"},
];

export const priorityOptions = [
  { id: 0, name: "Low", colorClass: "bg-primary", fontSize: '14px' },
  { id: 1, name: "Normal", colorClass: "bg-info", fontSize: '14px' },
  { id: 2, name: "Medium", colorClass: "bg-secondary", fontSize: '14px' },
  { id: 3, name: "High", colorClass: "bg-warning", fontSize: '14px' },
  { id: 4, name: "Critical", colorClass: "bg-danger", fontSize: '14px' },
];

export const getPriorityOptionById = (priorityId) => {
  return priorityOptions.find((option) => option.id === priorityId) || {
    name: "Unknown",
    colorClass: "bg-secondary",
  };
};

export const getRoleName = (role) => {
  switch (role) {
    case 0:
      return 'admin';
    case 1:
      return 'customer';
    case 2:
      return 'manager';
    case 3:
      return 'technician';
    case 4:
      return 'accountant';
    default:
      return ''; // Default class or empty string for unknown roles
  }
};



export const UrgencyOptions = [
  {id: 0, name: "Low"},
  {id: 1, name: "Medium"},
  {id: 2, name: "High"},
  {id: 3, name: "Urgent"},
];

export const ImpactOptions = [
  {id: 0, name: "Low"},
  {id: 1, name: "Medium"},
  {id: 2, name: "High"},
]

export const TicketStatusOptions = [
  {
    id: 0,
    name: "Open",
    icon: <Info style={{ color: '#3399FF' }} />,
    badgeStyle: {
      backgroundColor: 'white',
      border: '2px solid #3399FF',
      borderRadius: '16px',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
    }
  },
  {
    id: 1,
    name: "Assigned",
    icon: <Create style={{ color: '#FF9933' }} />,
    badgeStyle: {
      backgroundColor: 'white',
      border: '2px solid #FF9933',
      borderRadius: '16px',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
    }
  },
  {
    id: 2,
    name: "In Progress",
    icon: <Pending style={{ color: '#339999' }} />,
    badgeStyle: {
      backgroundColor: 'white',
      border: '2px solid #339999',
      borderRadius: '16px',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
    }
  },
  {
    id: 3,
    name: "Resolved",
    icon: <CheckCircle style={{ color: '#33CC33' }} />,
    badgeStyle: {
      backgroundColor: 'white',
      border: '2px solid #33CC33',
      borderRadius: '16px',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
    }
  },
  {
    id: 4,
    name: "Closed",
    icon: <HighlightOff style={{ color: '#888888' }} />,
    badgeStyle: {
      backgroundColor: 'white',
      border: '2px solid #888888',
      borderRadius: '16px',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
    }
  },
  {
    id: 5,
    name: "Cancelled",
    icon: <Cancel style={{ color: '#CC3333' }} />,
    badgeStyle: {
      backgroundColor: 'white',
      border: '2px solid #CC3333',
      borderRadius: '16px',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
    }
  }
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


