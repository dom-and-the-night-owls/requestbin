import { Link } from "react-router";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import ArchiveIcon from "@mui/icons-material/Archive";

interface BasketsProps {
  baskets: Array<string>;
  drawerState: boolean;
  setDrawerState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Baskets = ({ baskets, drawerState, setDrawerState }: BasketsProps) => {
  return (
    <Drawer
      anchor="right"
      open={drawerState}
      onClose={() => setDrawerState(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 200,
          paddingTop: 3,
        },
      }}
    >
      <Stack
        direction="column"
        sx={{
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6">My Baskets</Typography>

        <List dense={true} onClick={() => setDrawerState(false)}>
          {baskets.toReversed().map((basketName) => (
            <ListItem
              key={basketName}
              component={Link}
              to={`/baskets/${basketName}`}
              divider={true}
              sx={{
                color: "primary.main",
                "&:hover": {
                  color: "secondary.main",
                  textDecoration: "underline",
                },
              }}
            >
              <ListItemIcon>
                <ArchiveIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText>/{basketName}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Drawer>
  );
};

export default Baskets;
