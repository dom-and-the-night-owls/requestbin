import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useNotifications } from "../../hooks/useNotifications";
import type { Request as RequestType } from "../../types";
import apiService from "../../services/apiService";
import { handleAPIError, removeBasket } from "../../utils";
import DialogComponent from "../Dialog";
import RequestList from "../RequestList";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CodeIcon from "@mui/icons-material/Code";
import CodeOffIcon from "@mui/icons-material/Code";
import SwapVertIcon from "@mui/icons-material/SwapVert";

interface BasketProps {
  originURL: string;
}

const Basket = ({ originURL }: BasketProps) => {
  const POLLING_INTERVAL = 1000; // poll every 1 second
  const basketName = useParams().basketName ?? "";
  const notifications = useNotifications();
  const [requests, setRequests] = useState<Array<RequestType>>([]);
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [showJSON, setShowJSON] = useState(false);
  const [reverse, setReverse] = useState(true);
  const navigate = useNavigate();

  const handleCopyLinkButtonClick = async () => {
    await navigator.clipboard.writeText(`${originURL}/hook/${basketName}`);
    notifications.show("Basket URL copied to clipboard", {
      key: "clipboard",
      severity: "info",
      autoHideDuration: 2000,
    });
  };

  const handleFormatButtonClick = () => {
    setShowJSON((val) => !val);

    notifications.show("Formatted JSON", {
      key: "format",
      severity: "info",
      autoHideDuration: 2000,
    });
  };

  const handleDeleteBasketButtonClick = async () => {
    try {
      await apiService.deleteBasket(basketName);
      removeBasket(basketName);
      navigate("/");

      notifications.show(`Deleted basket /${basketName}`, {
        key: "delete",
        severity: "success",
        autoHideDuration: 2000,
      });
    } catch (error: unknown) {
      handleAPIError(error);
    }
  };

  const handleClearBasketButtonClick = async () => {
    // TODO: add a dialog here after migrating to useDialog hook?
    await apiService.clearBasket(basketName);
    setRequests(await apiService.getRequests(basketName));

    notifications.show(`Basket "${basketName}" successfully cleared.`, {
      key: "clear",
      severity: "success",
      autoHideDuration: 2000,
    });
  };

  const handleReverseButtonClick = () => {
    setReverse((val) => !val);

    notifications.show(`Reversed list order`, {
      key: "reverse",
      severity: "info",
      autoHideDuration: 2000,
    });
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await apiService.getRequests(basketName);
        setRequests(reverse ? requests.toReversed() : requests);
      } catch (error: unknown) {
        handleAPIError(error);
      }
    };

    fetchRequests();
    const intervalId = setInterval(fetchRequests, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [basketName, reverse]);

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: "1500px",
        minWidth: "100%",
        flexGrow: 1,
        padding: 2,
      }}
    >
      <Container>
        <Grid
          container
          spacing={{ xs: 1, sm: 2 }}
          columns={{ xs: 4, sm: 12 }}
          sx={{ paddingBottom: 2, minWidth: "100%" }}
        >
          <Grid size="auto" sx={{ minWidth: "40px" }}>
            <Tooltip
              arrow
              title={`${requests.length} requests in basket`}
              placement="right-start"
            >
              <Badge badgeContent={requests.length} color="primary">
                <Typography variant="h5">Basket:</Typography>
                <Typography
                  variant="h5"
                  color="secondary"
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    fontFamily: "monospace",
                  }}
                >
                  /{basketName}
                </Typography>
              </Badge>
            </Tooltip>
          </Grid>

          <Grid size="grow"></Grid>
          <Grid size="auto" sx={{ textAlign: "right" }}>
            <ButtonGroup variant="text">
              <Tooltip arrow title="Copy basket link" placement="top">
                <Button onClick={handleCopyLinkButtonClick}>
                  <ContentCopyIcon fontSize="small" />
                </Button>
              </Tooltip>

              <Tooltip arrow title={`Reverse order`} placement="top">
                <Button color="success" onClick={handleReverseButtonClick}>
                  <SwapVertIcon />
                </Button>
              </Tooltip>

              <Tooltip arrow title="Format JSON" placement="top">
                <Button
                  color="info"
                  variant={showJSON ? "contained" : "text"}
                  onClick={handleFormatButtonClick}
                  sx={{ width: "40px" }}
                >
                  {showJSON ? <CodeOffIcon /> : <CodeIcon />}
                </Button>
              </Tooltip>

              <Tooltip arrow title="Clear basket" placement="top">
                <Button color="warning" onClick={handleClearBasketButtonClick}>
                  <ClearAllIcon />
                </Button>
              </Tooltip>

              <Tooltip arrow title="Delete basket" placement="top">
                <Button
                  color="error"
                  onClick={() => setDeleteDialogState(true)}
                >
                  <DeleteForeverIcon />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        </Grid>

        <Divider />
        <RequestList
          originURL={originURL}
          basketName={basketName}
          requests={requests}
          showJSON={showJSON}
        />
      </Container>

      <DialogComponent
        prompt="Are you sure you want to delete this Basket?"
        dialogState={deleteDialogState}
        setDialogState={setDeleteDialogState}
        handleConfirm={handleDeleteBasketButtonClick}
      />
    </Paper>
  );
};

export default Basket;
