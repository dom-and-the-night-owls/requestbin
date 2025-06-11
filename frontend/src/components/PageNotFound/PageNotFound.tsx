import { useNavigate, useLocation } from "react-router";
import { Paper, Typography, Stack, Button } from "@mui/material";

const PageNotFound = () => {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  const url = [pathname, search, hash].join("");

  const handleClick = () => navigate("/");

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: "600px",
        flexGrow: 1,
        padding: 4,
        margin: "0 auto",
      }}
    >
      <Stack spacing={2} sx={{ alignItems: "center" }}>
        <Typography variant="h3">404 - Page Not Found</Typography>
        <Typography variant="body1">The page {url} does not exist.</Typography>

        <Button variant="contained" onClick={handleClick}>
          Go home
        </Button>
      </Stack>
    </Paper>
  );
};

export default PageNotFound;
