import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Lists from "../components/Lists";
import { base_url } from "../constants";
import data from "../Sources";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSearchParams } from "react-router-dom";

const ListData = {
  title: "List of Messes",
  blocks: [{ val1: "a", val2: "b" }],
};

function EditForm({ setEditData, editData, edit, setEdit }) {
  return (
    <Box>
      {edit == 2 && (
        <Box display="flex" alignItems="center" p={1}>
          <Typography display="inline" variant="h6" sx={{ width: "150px" }}>
            {"Roll Number"} :
          </Typography>
          <TextField
            type="number"
            id="standard-basic"
            defaultValue={editData["Roll Number"]}
            required={true}
            onChange={(event) => {
              setEditData((prev) => ({
                ...prev,
                "Roll Number": event.target.value,
              }));
            }}
          />
        </Box>
      )}
      {edit != 2 && (
        <Typography display="inline" variant="h6" sx={{ width: "150px" }}>
          {"Roll Number"} : {editData["Roll Number"]}
        </Typography>
      )}
      <Box display="flex" alignItems="center" p={1}>
        <Typography display="inline" variant="h6" sx={{ width: "150px" }}>
          {"Name"} :
        </Typography>
        <TextField
          id="standard-basic"
          defaultValue={editData["Name"]}
          required={true}
          onChange={(event) => {
            setEditData((prev) => ({ ...prev, Name: event.target.value }));
          }}
        />
      </Box>
      <Box display="flex" alignItems="center" p={1}>
        <Typography display="inline" variant="h6" sx={{ width: "150px" }}>
          {"Email"} :
        </Typography>
        <TextField
          id="standard-basic"
          defaultValue={editData["Email"]}
          required={true}
          onChange={(event) => {
            setEditData((prev) => ({ ...prev, Email: event.target.value }));
          }}
        />
      </Box>
      <Box display="flex" alignItems="center" p={1}>
        <Typography display="inline" variant="h6" sx={{ width: "150px" }}>
          {"Gender"} :
        </Typography>
        <TextField
          id="standard-basic"
          defaultValue={editData["Gender"]}
          required={true}
          onChange={(event) => {
            setEditData((prev) => ({ ...prev, Gender: event.target.value }));
          }}
        />
      </Box>
      <Box display="flex" alignItems="center" p={1}>
        <Typography display="inline" variant="h6" sx={{ width: "150px" }}>
          {"Mess_id"} :
        </Typography>
        <TextField
          id="standard-basic"
          defaultValue={editData["Mess_id"]}
          required={true}
          type="number"
          onChange={(event) => {
            setEditData((prev) => ({ ...prev, Mess_id: event.target.value }));
          }}
        />
      </Box>
      <Box>
        <Button
          variant="contained"
          sx={{ margin: "10px" }}
          onClick={() => {
            edit == 1
              ? axios
                  .post(base_url + `/students/update`, {
                    ...editData,
                  })
                  .then(() => {
                    setEdit(0);
                  })
              : axios
                  .post(base_url + `/students/add`, {
                    ...editData,
                  })
                  .then(() => {
                    setEdit(0);
                  });
          }}
        >
          Subit
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setEdit(0);
          }}
          sx={{ margin: "10px" }}
        >
          Cancle
        </Button>
      </Box>
    </Box>
  );
}

function Students() {
  const [data, setData] = useState({
    title: "",
    rows: [{}],
  });
  let [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [edit, setEdit] = useState(0);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [localStorage.getItem("user")]);
  console.log(user)
  useEffect(() => {
    const mess_id = searchParams.get("mess_id");
    axios
      .get(base_url + `/students?${mess_id ? "mess_id=" + mess_id : ""}`)
      .then((response) => {
        response.data[0] != undefined
          ? setData((prev) => ({
              title: mess_id
                ? `Students in ${
                    response.data[0] && response.data[0]["Mess Name"]
                  } Mess`
                : `List of all Students`,
              rows: response.data.map((ele) => ({
                "Roll Number": ele["Roll Number"],
                Name: ele["Name"],
                Email: ele["Email"],
                Gender: ele["Gender"],
                Mess: ele["Mess Name"],
                Edit: (
                  <IconButton
                    color="primary"
                    component="label"
                    variant="contained"
                    sx={{ border: "1px solid" }}
                    onClick={() => {
                      setEditData({ ...ele });
                      setEdit(1);
                    }}
                    disabled={user != "Employee"}
                  >
                    <EditIcon />
                  </IconButton>
                ),
                Delete: (
                  <IconButton
                    color="primary"
                    component="label"
                    variant="contained"
                    sx={{ border: "1px solid" }}
                    disabled={user != "Employee"}
                    onClick={() => {
                      {
                        axios
                          .get(
                            base_url +
                              `/students/delete?roll_no=${ele["Roll Number"]}`
                          )
                          .then((response) => {
                            console.log(response);
                            setLoad((prev) => !prev);
                          })
                          .catch((error) => console.log(error));
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                ),
              })),
            }))
          : setData({ title: "", rows: [{}] });
        console.log(response.data);
      });
  }, [searchParams.get("mess_id"), load, edit, user]);

  return (
    <React.Fragment>
      {edit ? (
        <EditForm
          editData={editData}
          setEditData={setEditData}
          edit={edit}
          setEdit={setEdit}
        ></EditForm>
      ) : (
        <>
          <Lists {...data} />
          <Button
            variant="contained"
            sx={{ margin: "10px" }}
            fullWidth={true}
            onClick={() => {
              setEdit(2);
              setEditData({});
            }}
          >
            Add New Student
          </Button>
        </>
      )}
    </React.Fragment>
  );
}

export default Students;
