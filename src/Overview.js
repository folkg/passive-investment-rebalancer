import React, { useState, useContext, useEffect } from "react";
import { PassivAccountContext } from "./contexts/passiv-account-provider";
import { useQuery } from "react-query"; //TODO: Uninstall
import Account from "./Account";
import { Container } from "@mui/material";

function Overview() {
  const [accounts, setAccounts] = useState(null);
  const { getAccounts } = useContext(PassivAccountContext);

  // [] option will behave like componentDidMount and run only once at startup
  // Fetch the user's accounts
  useEffect(() => {
    async function fetchAccounts() {
      setAccounts(await getAccounts());
    }
    fetchAccounts();
  }, []);

  return (
    <Container>
      {accounts == null
        ? "Loading..."
        : accounts.map((a) => <Account key={a.internalID} accountData={a} />)}
    </Container>
  );
}

export default Overview;
