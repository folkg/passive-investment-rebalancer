import React from "react";
import { ListItem, Grid } from "@mui/material";

function Stock(props) {
  const { symbol, currencyCode, units, price, value } = props.stockData;

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
          {symbol}
        </Grid>
        <Grid item xs={2}>
          {units}
        </Grid>
        <Grid item xs={2}>
          {currencyFormat(price)}
        </Grid>
        <Grid item xs={3}>
          {currencyFormat(value)}
        </Grid>
        <Grid item md={3}>
          {currencyCode}
        </Grid>
      </Grid>
    </ListItem>
  );
}

function StockHeader() {
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
          Symbol
        </Grid>
        <Grid item xs={2}>
          Units
        </Grid>
        <Grid item xs={2}>
          Price
        </Grid>
        <Grid item xs={3}>
          Value
        </Grid>
        <Grid item md={3}>
          Currency
        </Grid>
      </Grid>
    </ListItem>
  );
}

export { Stock, StockHeader };
