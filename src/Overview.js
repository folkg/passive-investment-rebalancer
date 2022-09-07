import React, { useContext } from "react";
import { HoldingsContext } from "./contexts/holdings.context";
import Account from "./Account";
import { Container } from "@mui/material";

function Overview() {
  const { accounts } = useContext(HoldingsContext);

  //TODO: Need all holdings-context stuff to be loaded first

  //TODO: Do we still need the loading setup here? Or will all account data already
  // be loaded with the holdings.context? When is holdings.context called first and updated later?
  return (
    <Container>
      {accounts == null
        ? "Loading..."
        : accounts.map((a) => <Account key={a.internalID} accountData={a} />)}
    </Container>
  );
}

export default Overview;
