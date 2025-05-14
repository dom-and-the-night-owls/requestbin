import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

interface MyBasketsFabProps {
  setDrawerState: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

const MyBasketsFab = ({ setDrawerState, isMobile }: MyBasketsFabProps) => {
  return (
    <Tooltip arrow title="My Baskets" placement="left">
      <Fab
        color="secondary"
        onClick={() => setDrawerState((state) => !state)}
        sx={{
          position: "fixed",
          zIndex: 3,
          ...(isMobile ? { bottom: 30 } : { top: 30 }),
          right: 30,
        }}
        aria-label="basket"
      >
        <ShoppingBasketIcon />
      </Fab>
    </Tooltip>
  );
};

export default MyBasketsFab;
