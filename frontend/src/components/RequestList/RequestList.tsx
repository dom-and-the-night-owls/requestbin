import type { Request as RequestType } from "../../types";
import Request from "../../components/Request";
import EmptyBasketContent from "../EmptyBasketContent";
import Grid from "@mui/material/Grid";

interface RequestListProps {
  originURL: string;
  basketName: string;
  requests: Array<RequestType>;
  showJSON: boolean;
}

const RequestList = ({
  originURL,
  basketName,
  requests,
  showJSON,
}: RequestListProps) => {
  if (!requests.length) {
    return <EmptyBasketContent originURL={originURL} basketName={basketName} />;
  }

  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 2 }}
      columns={{ xs: 4, sm: 12 }}
      sx={{ paddingTop: 1 }}
    >
      {requests.map((request) => (
        <Request
          key={request.sentAt}
          originURL={originURL}
          showJSON={showJSON}
          {...request}
        />
      ))}
    </Grid>
  );
};

export default RequestList;
