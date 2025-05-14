import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { Request as RequestType } from "../../types";
import apiService from "../../services/requestBinAPI";
import { handleAPIError } from "../../utils";
import RequestList from "../RequestList";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DialogComponent from "./../Dialog/Dialog";

interface BasketProps {
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  baskets: Array<string>;
}

const Basket = ({
  setSnackbarMessage,
  setSnackbarOpen,
  baskets,
}: BasketProps) => {
  const basketName = useParams().basketName ?? "";
  const [requests, setRequests] = useState<Array<RequestType>>([]);
  const [dialogState, setDialogState] = useState(false);
  const navigate = useNavigate();

  const handleCopyLinkButtonClick = async () => {
    // TODO: fix link
    await navigator.clipboard.writeText(
      `https://placeholder.com/hook/${basketName}`
    );
    setSnackbarMessage("Basket URL copied to clipboard");
    setSnackbarOpen(true);
  };

  const handleDeleteBasketButtonClick = async () => {
    try {
      await apiService.deleteBasket(basketName);
      setSnackbarMessage(`Deleted basket /${basketName}`);
      setSnackbarOpen(true);
      navigate("/");
      // This is to delete from local
      const index = baskets.indexOf(basketName);
      baskets.splice(index, 1);
    } catch (error: unknown) {
      handleAPIError(error);
    } finally {
    }
  };

  useEffect(() => {
    apiService
      .getRequests(basketName)
      .then((mockBaskets) => {
        setRequests(mockBaskets);
      })
      .catch((error: unknown) => {
        navigate("/");
        handleAPIError(error);
      });
  }, [basketName]);

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        padding: 2,
      }}
    >
      <Container>
        <Stack
          direction="row"
          sx={{
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">
            Basket:
            <Tooltip arrow title="Copy basket link" placement="top">
              <Button
                sx={{ flexGrow: 0, color: "info.main" }}
                onClick={handleCopyLinkButtonClick}
              >
                <Typography variant="h5" sx={{ paddingRight: 1 }}>
                  <code>/{basketName}</code>
                </Typography>
                <ContentCopyIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Typography>

          <Tooltip arrow title="Delete basket" placement="top">
            <Button color="error" onClick={() => setDialogState(true)}>
              <DeleteForeverIcon />
            </Button>
          </Tooltip>

          <DialogComponent
            dialogState={dialogState}
            setDialogState={setDialogState}
            handleDeleteBasketButtonClick={handleDeleteBasketButtonClick}
          />

          <Typography variant="subtitle2">
            {requests.length} requests
          </Typography>
        </Stack>

        <Divider />
        <RequestList basketName={basketName} requests={requests} />
      </Container>
    </Paper>
  );
};

export default Basket;
