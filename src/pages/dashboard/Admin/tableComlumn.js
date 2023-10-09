import { Email } from "@mui/icons-material";
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
  { id: "Low", name: 0 },
  { id: "Normal", name: 1 },
  { id: "Medium", name: 2},
  { id: "High", name: 3},
  { id: "Critical", name: 4},
];

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
} 


