import React, { useContext } from "react";
import { HoldingsContext } from "./contexts/holdings.context";
import { Stock, StockHeader } from "./Stock";
import { Cash, CashHeader } from "./Cash";
import { CssBaseline, Paper, List, Divider, Typography } from "@mui/material";

function Account(props) {
  const { getAccountHoldings } = useContext(HoldingsContext);

  const { internalID, accountName, accountNum } = props.accountData;
  const { stocks, cash, stockValue, cashValue } =
    getAccountHoldings(internalID);

  const currencyFormat = (num) => {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  //TODO: Do we still need the loading setup here? Or will all account data already
  // be loaded with the holdings.context? When is holdings.context called first and updated later?
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
