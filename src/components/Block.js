import { Box, Paper } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function Block({ block }) {
  return (
    <React.Fragment>
      <Paper>
        {block &&
          Object.keys(block).map((ele) => (
            <Box sx={{ m: 1 }}>
              {ele == "link" ? (
                <Link to={block[ele]} relative="path">
                  Link
                </Link>
              ) : (
                <>
                  <strong>{ele} : </strong> {block[ele]}
                </>
              )}
            </Box>
          ))}
      </Paper>
    </React.Fragment>
  );
}

export default Block;
