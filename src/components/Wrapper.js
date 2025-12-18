import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, redirect, useLocation } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { base_url } from "../constants";

function Wrapper({ children }) {
  let location = useLocation();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [localStorage.getItem("user")]);

  // const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const responseGoogle = (error) => {
    console.log("ERROR FROM GOOGLE", error);
  };

  const signin = (response) => {
    // const decode = jwt_decode(response["credential"]);
    // const newUser = decode;
    // console.log(newUser["email"]);
    // axios
    //   .get(base_url + "/return_auth?email=" + newUser["email"])
    //   .then((response) => {
    //     console.log(response.data)
    //     if (response.data != "Invalid mail id") {
    //       setUser(response.data);
    //       localStorage.setItem("user", response.data);
    //     }
    //   });
      localStorage.setItem("user", "Employee")
  };
  console.log(user);
  return (
    <React.Fragment>
      {user ? (
        <>
          <Box backgroundColor="black" color="white" p={2} display="flex">
            <Link to="/">
              <Button
                sx={{ color: "white", borderColor: "white" }}
                variant="outlined"
              >
                Home
              </Button>
            </Link>
            {/* <Box p={1} />
            <Link to="/students">
              <Button
                sx={{ color: "white", borderColor: "white" }}
                variant="outlined"
              >
                List Of Students
              </Button>
            </Link> */}
            <Box flexGrow={1} />
            <Typography sx={{ margin: "5px" }}>Loged In as {user}</Typography>
            <Button
              sx={{ color: "white", borderColor: "white" }}
              variant="outlined"
              onClick={() => {
                localStorage.clear();
                setUser(null);
                redirect("/");
              }}
            >
              Logout
            </Button>
          </Box>
          <Container>
            <Box sx={{ pt: 10, pb: 10 }}>{children}</Box>
          </Container>
        </>
      ) : (
        <GoogleLogin
          buttonText="Login"
          onSuccess={signin}
          onFailure={responseGoogle}
          isSignedIn={true}
          render={(renderProps) => (
            <Button
              variant="contained"
              onClick={renderProps.onClick}
              // className={classes.button}
              disabled={renderProps.disabled}
              size={"large"}
            >
              Login with your IITGn Email ID
            </Button>
          )}
        />
      )}
    </React.Fragment>
  );
}

export default Wrapper;
