import type { Request as RequestType } from "../../types";
import Request from "../../components/Request";
import EmptyBasketContent from "../EmptyBasketContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

interface RequestListProps {
  basketName: string;
  requests: Array<RequestType>;
}

const RequestList = ({ basketName, requests }: RequestListProps) => {
  return (
    <List>
      {requests.length ? (
        requests.map((request, i) => (
          <ListItem key={i}>
            <Request {...request} basketName={basketName} />
          </ListItem>
        ))
      ) : (
        <EmptyBasketContent basketName={basketName} />
      )}
    </List>
  );
};

export default RequestList;
