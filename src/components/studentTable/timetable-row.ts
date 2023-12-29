import { TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TimetableRow = styled(TableRow)(() => ({
  border: "none",
  "& > td": {
    textAlign: "center",
    padding: "2px",
    borderRight: "1px solid #aaaaaa60",
    borderBottom: "1px solid #aaaaaa60",
    verticalAlign: "top",
  },
  "&:first-child > td": {
    borderTop: "1px solid #aaaaaa60",
  },
  "& > td:first-child": {
    borderLeft: "1px solid #aaaaaa60",
    padding: 0,
  },
  "&:first-child > td:first-child": {
    borderTopLeftRadius: "6px",
  },
  "&:first-child > td:last-child": {
    borderTopRightRadius: "6px",
  },
  "&:last-child > td:first-child": {
    borderBottomLeftRadius: "6px",
  },
  "&:last-child > td:last-child": {
    borderBottomRightRadius: "6px",
  },
  "&:nth-child(2n + 1) > td": {
    backgroundColor: "#88888820",
  },
}));
