import React, { useState, useContext, useEffect } from "react";
import { PassivAccountContext } from "./contexts/passiv-account-provider";
import { Stock, StockHeader } from "./Stock";
import { Cash, CashHeader } from "./Cash";
import { CssBaseline, Paper, List, Divider, Typography } from "@mui/material";

function Account(props) {
  const [stocks, setStocks] = useState(null);
  const [cash, setCash] = useState(null);
  const [stockValue, setStockValue] = useState(null);
  const [cashValue, setCashValue] = useState(null);
  const { getAccountPositions, getAccountBalances } =
    useContext(PassivAccountContext);

  const { internalID, accountName, accountNum } = props.accountData;

  const currencyFormat = (num) => {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  //TODO: Total value needs to select for the proper currency

  // [] option will behave like componentDidMount and run only once at startup
  // Fetch the account's holdings
  useEffect(() => {
    async function fetchHoldings() {
      const tempStocks = await getAccountPositions(internalID);
      setStocks(tempStocks);
      const tempCash = await getAccountBalances(internalID);
      setCash(tempCash);

      setCashValue(cash.reduce((p, c) => p + c.balance, 0));
      setStockValue(stocks.reduce((p, c) => p + c.value, 0));
    }
    fetchHoldings();
  }, []);

  return (
    <Paper
      elevation={6}
      sx={{ padding: "1rem 2rem", margin: " 1.5rem auto", maxWidth: "md" }}
    >
      <CssBaseline />
      <Typography variant="h5" sx={{ margin: "0 1rem 1rem 1rem" }}>
        {accountName} ({accountNum})
      </Typography>
      {!(cashValue == null || stockValue == null) ? (
        <Paper
          variant="outlined"
          sx={{
            margin: " 1.5rem",
            minWidth: "max-content",
            maxWidth: "35%",
            marginLeft: 0,
          }}
        >
          <Typography
            variant="inherit"
            sx={{ margin: "1rem 1rem", fontWeight: "fontWeightBold" }}
          >
            Total Value: {currencyFormat(cashValue + stockValue)}
          </Typography>
          <Typography
            variant="inherit"
            sx={{ margin: "1rem 1rem", fontWeight: "fontWeightBold" }}
          >
            Cash: {currencyFormat(cashValue)}
          </Typography>
          <Typography
            variant="inherit"
            sx={{ margin: "1rem 1rem", fontWeight: "fontWeightBold" }}
          >
            Stocks: {currencyFormat(stockValue)}
          </Typography>
        </Paper>
      ) : (
        ""
      )}
      <Paper variant="outlined" sx={{ margin: " 1.5rem auto" }}>
        <List padding="1">
          <StockHeader />
          {stocks == null
            ? "Loading..."
            : stocks.map((s, idx) => (
                <React.Fragment key={s.internalID}>
                  <Stock stockData={s} />
                  {idx < stocks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ margin: " 1.5rem auto" }}>
        <List>
          <CashHeader />
          {cash == null
            ? "Loading..."
            : cash.map((c, idx) => (
                <React.Fragment key={c.internalID}>
                  <Cash cashData={c} />
                  {idx < cash.length - 1 && <Divider />}
                </React.Fragment>
              ))}
        </List>
      </Paper>
    </Paper>
  );
}

export default Account;
