import Employee from "./pages/Employee";
import Home from "./pages/Home";
import Inventory_detail from "./pages/Inventory_detail";
import Menu from "./pages/Menu";
import Mess from "./pages/Mess";
import MessOne from "./pages/MessOne";
import Stock from "./pages/Stock";
import Students from "./pages/Students";
import axios from "axios";
import Profile from "./pages/profile";
import Contacts from "./pages/Contacts";
import Balance_sheet from "./pages/Balance_sheet";
import Guest_sales from "./pages/Guest_sales";
import Mess_menu from "./pages/Mess_menu";
import Wastage from "./pages/Wastage";
import Contractor from "./pages/Contractor";
import Feedback from "./pages/Feedback";
import Student_attandance from "./pages/Student_attandance";
import Employee_attandance from "./pages/Employee_attandance";

const data = {
  home: {
    path: "/",
    element: <Home />,
    links: [
      {
        name: "mess",
        title: "List of messes",
        access: 1,
      },
      {
        name: "students",
        title: "List of students",
        access: 1,
      },
      {
        name: "employee",
        title: "List of empolyee",
        access: 0,
      },
      {
        name: "inventory_detail",
        title: "Invenotry Details",
        access: 0,
      },
      {
        name: "stock",
        title: "Stock Details",
        access: 0,
      },
      {
        name: "contacts",
        title: "Student Representative",
        access: 1,
      },
      {
        name: "balance_sheet",
        title: "Balance Sheet",
        access: 0,
      },
      {
        name: "guest_sales",
        title: "Guest Sales",
        access: 0,
      },
      {
        name: "mess_menu",
        title: "Mess menu",
        access: 1,
      },
      {
        name: "wastage",
        title: "Wastage details",
        access: 1,
      },
      {
        name: "contractor",
        title: "Contractor details",
        access: 0,
      },
      {
        name: "feedback",
        title: "Feedback",
        access: 1,
      },
      {
        name: "employee_attandance",
        title: "Employee attandance",
        access: 0,
      },
      {
        name: "student_attandance",
        title: "Student attandance",
        access: 1,
      },
    ],
  },
  mess: { path: "/messes", element: <Mess /> },
  students: {
    path: "/students",
    element: <Students />,
    relative: "./students",
  },
  // student_edit: {
  //   path: "students"
  // },
  employee: {
    path: "/employees",
    element: <Employee />,
    relative: "./employees",
  },
  inventory_detail: {
    path: "/inventory_detail",
    element: <Inventory_detail />,
    relative: "./inventory_detail",
  },
  stock: {
    path: "/stock",
    element: <Stock />,
    relative: "./stock",
  },
  contacts: {
    path: "/contacts",
    element: <Contacts />,
    relative: "./contacts",
  },
  balance_sheet: {
    path: "/balance_sheet",
    element: <Balance_sheet />,
    relative: "./balance_sheet",
  },
  guest_sales: {
    path: "/guest_sales",
    element: <Guest_sales />,
    relative: "./guest_sales",
  },
  mess_menu: {
    path: "/mess_menu",
    element: <Mess_menu />,
    relative: "./mess_menu",
  },
  wastage: {
    path: "/wastage",
    element: <Wastage />,
    relative: "./wastage",
  },
  contractor: {
    path: "/contractor",
    element: <Contractor />,
    relative: "./contractor",
  },
  feedback: {
    path: "/feedback",
    element: <Feedback />,
    relative: "./feedback",
  },
  student_attandance: {
    path: "/student_attandance",
    element: <Student_attandance />,
    relative: "./student_attandance",
  },
  employee_attandance: {
    path: "/employee_attandance",
    element: <Employee_attandance />,
    relative: "./employee_attandance",
  },
  profile: { path: "/profile", element: <Profile /> },
  students: {
    path: "/students",
    element: <Students />,
    relative: "./students",
  },
  student_edit: {
    path: "students",
  },
  // menu: {
  //   path: "/messes/:messid/menu",
  //   element: <Menu />,
  //   relative: "./menu",
  // },
};

export default data;
