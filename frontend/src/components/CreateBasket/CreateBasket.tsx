import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router";
import apiService from "../../services/apiService";
import { handleAPIError, addBasket } from "../../utils";
import { Paper, Typography, Stack, TextField, Button } from "@mui/material";
import { useNotifications } from "../../hooks/useNotifications";

interface CreateBasketProps {
  originURL: string;
}

const CreateBasket = ({ originURL }: CreateBasketProps) => {
  const [basketName, setBasketName] = useState<string>("");
  const notifications = useNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    apiService
      .generateName()
      .then((generatedName) => setBasketName(generatedName))
      .catch((error: unknown) => {
        handleAPIError(error);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const verifiedName = await apiService.createBasket(basketName);
      const generatedToken = await apiService.getToken(basketName);

      addBasket(`${verifiedName}`, generatedToken);
      notifications.show(`${verifiedName} basket was created!`, {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate(`/baskets/${basketName}`);
    } catch (error: unknown) {
      handleAPIError(error);
    }
  };

  const handleBasketNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBasketName(event.currentTarget.value);
  };

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
        <Typography variant="h3">New Basket</Typography>
        <Typography variant="body1">
          Create a basket to collect and inspect HTTP Requests
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack
            direction={{ sm: "row", xs: "column" }}
            spacing={1}
            sx={{ paddingTop: 1 }}
          >
            <TextField
              autoFocus
              required
              spellCheck={false}
              variant="outlined"
              id="new-basket-name"
              label={`${originURL}/`}
              value={basketName}
              onChange={handleBasketNameChange}
              size="medium"
              sx={{
                flexGrow: 0,
              }}
              slotProps={{
                input: {
                  sx: {
                    color: "text.secondary",
                    fontFamily: "monospace",
                  },
                },
                inputLabel: {
                  sx: {
                    color: "text.primary",
                    fontFamily: "monospace",
                  },
                  required: false, // Hide label "required" asterisk
                },
              }}
            />

            <Button type="submit" variant="contained">
              Create
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export default CreateBasket;
