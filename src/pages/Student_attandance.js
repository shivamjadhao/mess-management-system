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

function Student_attandance() {
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
  console.log(user);
  useEffect(() => {
    const mess_id = searchParams.get("mess_id");
    axios
      .get(base_url + `/visit?${mess_id ? "mess_id=" + mess_id : ""}`)
      .then((response) => {
        response.data[0] != undefined
          ? setData((prev) => ({
              title: mess_id ? `Student attendance` : `Student attendance`,
              rows: response.data.map((ele) => ({
                "roll_number":ele["roll_number"],
                "date":ele["date"],
                "slot":ele["slot"],
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
        </>
      )}
    </React.Fragment>
  );
}

export default Student_attandance;
