import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface DialogComponentProps {
  dialogState: boolean;
  setDialogState: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteBasketButtonClick: () => void;
}

const DialogComponent = ({
  dialogState,
  setDialogState,
  handleDeleteBasketButtonClick,
}: DialogComponentProps) => {
  return (
    <Dialog
      open={dialogState}
      onClose={() => setDialogState(false)}
      aria-labelledby="delete-basket"
    >
      <DialogTitle id="delete-basket">
        Are you sure you want to delete this Basket?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Deleting this is permanent.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogState(false)} autoFocus>
          Disagree
        </Button>
        <Button
          onClick={() => {
            setDialogState(false);
            handleDeleteBasketButtonClick();
          }}
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
