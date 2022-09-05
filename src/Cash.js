import React from "react";
import { ListItem, Grid } from "@mui/material";

function Cash(props) {
  const { currencyCode, currencyName, balance } = props.cashData;

  const currencyFormat = (num) => {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  return (
    <ListItem>
      <Grid
        container
        direction="row"
        spacing={2}
        sx={{
          textAlign: "start",
        }}
      >
        <Grid item xs={2}>
          {currencyCode}
        </Grid>
        <Grid item xs={4}>
          {currencyName}
        </Grid>
        <Grid item xs={6}>
          {currencyFormat(balance)}
        </Grid>
      </Grid>
    </ListItem>
  );
}

function CashHeader() {
  return (
    <ListItem>
      <Grid
        container
        direction="row"
        spacing={2}
        sx={{
          textAlign: "start",
          fontWeight: "fontWeightBold",
        }}
      >
        <Grid item xs={2}>
          Currency
        </Grid>
        <Grid item xs={4}>
          Name
        </Grid>
        <Grid item xs={6}>
          Value
        </Grid>
      </Grid>
    </ListItem>
  );
}

export { Cash, CashHeader };
