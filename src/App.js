import { Box, Button, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
// import GoogleLogin from '@leecheuk/react-google-login';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Wrapper from "./components/Wrapper";
import data from "./Sources";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { base_url } from "./constants";

const router = createBrowserRouter(
  Object.keys(data).map((page) => {
    return {
      path: data[page].path,
      element: <Wrapper>{data[page].element}</Wrapper>,
    };
  })
);

function App() {
  
  return (
    <React.Fragment>
      <GoogleOAuthProvider clientId="410155678992-e8a9atgc87eu17ujopv2odu60jf5ppjv.apps.googleusercontent.com">
        <RouterProvider router={router}></RouterProvider>
        {/* {user ? (
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
        )} */}
      </GoogleOAuthProvider>
    </React.Fragment>
  );
}

export default App;
