import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import data from "../Sources";

function Home() {
  const [user, setUser] = useState("");
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [localStorage.getItem("user")]);
  return (
    <React.Fragment>
      {data["home"]["links"].map((ele) => {
        return (
          <>
            {user == "Employee" ? (
              <Typography>
                <Link
                  to={
                    data[ele["name"]]["relative"] || data[ele["name"]]["path"]
                  }
                  relative="path"
                >
                  {ele["title"]}
                </Link>
              </Typography>
            ) : (
              <>
                {ele["access"] == 1 ? (
                  <Typography>
                    <Link
                      to={
                        data[ele["name"]]["relative"] ||
                        data[ele["name"]]["path"]
                      }
                      relative="path"
                    >
                      {ele["title"]}
                    </Link>
                  </Typography>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        );
      })}
    </React.Fragment>
  );
}

export default Home;
