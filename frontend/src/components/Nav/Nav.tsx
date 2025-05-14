import { Link } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

const Nav = () => {
  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: 1,
      }}
    >
      <Toolbar>
        <Button color="inherit" component={Link} to={"/"}>
          RequestBin
        </Button>
        <Button
          color="inherit"
          href="https://github.com/dom-and-the-night-owls/requestbin"
        >
          github
        </Button>
        <Button
          color="inherit"
          href="https://github.com/dom-and-the-night-owls/requestbin/wiki"
        >
          documentation
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
