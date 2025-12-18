import {
  Button,
  CardActionArea,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Block from "./Block";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const clickableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    cursor: "pointer",
  },
}));

function Lists({ title, rows }) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(Object.keys(rows[0]));
  }, [title, rows]);

  return (
    <React.Fragment>
      <Typography variant="h3" align="center">
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              {columns.map((col) =>
                col != "link" ? (
                  <StyledTableCell align="center">{col}</StyledTableCell>
                ) : (
                  <StyledTableCell align="center"></StyledTableCell>
                )
              )}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((col) =>
                  col != "link" ? (
                    <StyledTableCell align="center">{row[col]}</StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">
                      <Link to={row[col]} relative="path">
                        <Button variant="outlined">Detail</Button>
                      </Link>
                    </StyledTableCell>
                  )
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

export default Lists;
