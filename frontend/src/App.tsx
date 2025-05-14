import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import apiService from "./services/requestBinAPI";
import { handleAPIError } from "./utils.ts";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import theme from "./theme.ts";
import CssBaseline from "@mui/material/CssBaseline";
import Nav from "./components/Nav";
import Basket from "./components/Basket";
import Baskets from "./components/Baskets";
import CreateBasket from "./components/CreateBasket";
import MyBasketsFab from "./components/MyBasketsFab";

function App() {
  const [baskets, setBaskets] = useState<Array<string>>([]);
  const [drawerState, setDrawerState] = useState(false);
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // load initial state
  useEffect(() => {
    apiService
      .getBaskets()
      .then((baskets) => setBaskets(baskets))
      .catch((error: unknown) => {
        handleAPIError(error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Container maxWidth="xl" sx={{ minWidth: "350px" }}>
          <CssBaseline />
          <Nav />

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              paddingTop: 3,
              // create space dynamically for Nav
              ...theme.mixins.toolbar,
            }}
          >
            <Stack
              direction="row"
              sx={{
                gap: 3,
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <CreateBasket
                      setBaskets={setBaskets}
                      setSnackbarMessage={setSnackbarMessage}
                      setSnackbarOpen={setSnackbarOpen}
                    />
                  }
                />
                <Route path="baskets">
                  <Route
                    path=":basketName"
                    element={
                      <Basket
                        setSnackbarMessage={setSnackbarMessage}
                        setSnackbarOpen={setSnackbarOpen}
                        baskets={baskets}
                      />
                    }
                  />
                </Route>
              </Routes>

              <Baskets
                baskets={baskets}
                drawerState={drawerState}
                setDrawerState={setDrawerState}
              />
            </Stack>
          </Box>
        </Container>
      </BrowserRouter>

      <MyBasketsFab setDrawerState={setDrawerState} isMobile={isMobile} />

      <Box
        className="bg-image"
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -10,
          width: "100%",
          height: "100%",
          backgroundColor: "background.default",
          backgroundImage: `radial-gradient(${theme.palette.primary.light} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      ></Box>
    </ThemeProvider>
  );
}

export default App;
