// API Docs: https://app.swaggerhub.com/apis-docs/passiv/PassivAPI/v1#/

import { useEffect, useState, createContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import axios from "axios";

//https://cors-anywhere.herokuapp.com/corsdemo
const CORS_BASE = "https://cors-anywhere.herokuapp.com/"; //for development only
const API_URL = CORS_BASE + "https://api.passiv.com/api/v1/";
const LOGIN_URL = "auth/login";

export const PassivAccountContext = createContext();

export function PassivAccountProvider(props) {
  // JWT will be retrieved from localstorage and set to JWT, if it exists. Otherwise it will be initialized as empty string.
  const [jwt, setJwt] = useLocalStorageState("jwt");
  const [accounts, setAccounts] = useLocalStorageState(null);
  const [stocks, setStocks] = useState(null);
  const [cash, setCash] = useState(null);

  // [] option will behave like componentDidMount and run only once at startup
  useEffect(() => {
    // Create an interceptor that looks for a new JWT. Refresh token if required.
    axios.interceptors.response.use((res) => {
      const newToken = res.headers["X-New-Token"];

      if (newToken) {
        // set the new JWT in state and sync to localstorage
        setJwt(newToken);
      }

      return res;
    });
  }, []);

  useEffect(() => {
    // Fetch the account data and holdings
    const fetchData = async () => {
      const accountData = await fetchAccounts();
      setAccounts(accountData);
      const stockData = await fetchAccountPositions(accountData);
      setStocks(stockData);
      const cashData = await fetchAccountBalances(accountData);
      setCash(cashData);
    };

    fetchData();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(API_URL + LOGIN_URL, {
        email,
        password,
      });
      const { token } = res.data;
      console.log(token);
      if (token) {
        // set the JWT in state and sync to localstorage
        setJwt(token);
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
    return false;
  };

  const isTokenValid = () => {
    if (jwt == null) {
      return false;
    } else {
      try {
        const expiryDate = JSON.parse(window.atob(jwt.split(".")[1]));
        if (expiryDate.exp * 1000 < Date.now()) {
          logout();
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
      return true;
    }
  };

  const logout = () => {
    setJwt("");
  };

  const getAPIStatus = async () => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `JWT ${jwt}` },
    });
    return res.status === 200;
  };

  const verifyTokenStatus = async () => {
    const res = await axios.post(
      API_URL + "auth/verify",
      { token: jwt },
      {
        headers: { Authorization: `JWT ${jwt}` },
      }
    );

    return res.status === 200;
  };

  const fetchAccounts = async () => {
    const res = await axios.get(API_URL + "accounts", {
      headers: { Authorization: `JWT ${jwt}` },
    });

    if (res.status === 200) {
      //Build the expected return data structure
      const accountData = res.data.map((a) => ({
        accountId: a.id,
        accountNum: a.number,
        accountName: a.name,
        accountType: a.meta.type,
        institutionName: a.institution_name,
      }));
      return accountData;
    } else {
      return null;
    }
  };

  const fetchAccountBalances = async (accountData) => {
    // loop each account
    let cashItems = [];
    for (const acc of accountData) {
      //fetch balances for the account
      const res = await axios.get(
        API_URL + `accounts/${acc.accountId}/balances`,
        {
          headers: { Authorization: `JWT ${jwt}` },
        }
      );
      //create a cashData object with the response
      if (res.status === 200) {
        const cashData = res.data.map((a) => ({
          accountId: acc.accountId,
          currencyId: a.currency.id,
          currencyCode: a.currency.code,
          currencyName: a.currency.name,
          balance: a.cash,
        }));
        //add the new cashData to the existing object
        cashItems.push(...cashData);
      } // end if
    } // end for
    return cashItems;
  };

  const fetchAccountPositions = async (accountData) => {
    // loop each account
    let stockItems = [];

    for (const acc of accountData) {
      //fetch positions for the account
      const res = await axios.get(
        API_URL + `accounts/${acc.accountId}/positions`,
        {
          headers: { Authorization: `JWT ${jwt}` },
        }
      );
      //create a stockData object with the response
      if (res.status === 200) {
        const stockData = res.data.map((a) => ({
          accountId: acc.accountId,
          stockId: a.symbol.id,
          symbol: a.symbol.symbol.symbol,
          description: a.symbol.symbol.description,
          currencyCode: a.symbol.symbol.currency.code,
          units: a.units,
          price: a.price,
          value: a.units * a.price,
        }));
        //add the new cashData to the existing object
        stockItems.push(...stockData);
      } //end if
    } //end for loop
    return stockItems;
  };

  const getAccountHoldings = (accountId) => {
    let accountStocks, accountCash, stockValue, cashValue;

    if (stocks == null) {
      accountStocks = null;
      stockValue = 0;
    } else {
      accountStocks = stocks.filter((s) => s.accountId === accountId);
      stockValue = accountStocks.reduce((p, c) => p + c.value, 0);
    }

    if (cash == null) {
      accountCash = null;
      cashValue = 0;
    } else {
      accountCash = cash.filter((c) => c.accountId === accountId);
      cashValue = accountCash.reduce((p, c) => p + c.balance, 0);
    }

    return { stocks: accountStocks, cash: accountCash, stockValue, cashValue };
  };

  const getPortfolioGroups = async () => {
    const res = await axios.get(API_URL + `portfolioGroups`, {
      headers: { Authorization: `JWT ${jwt}` },
    });
    console.log(res);
  };

  const getCalculatedTrades = async (portfolioGroupId) => {
    const res = await axios.get(
      API_URL + `portfolioGroups/${portfolioGroupId}/calculatedtrades`,
      {
        headers: { Authorization: `JWT ${jwt}` },
      }
    );
    console.log(res);
  };

  const getTradeObject = async (
    portfolioGroupId,
    calculatedTradeId,
    tradeId
  ) => {
    const res = await axios.get(
      API_URL +
        `/portfolioGroups/${portfolioGroupId}/calculatedtrades/${calculatedTradeId}/modify/${tradeId}`,
      {
        headers: { Authorization: `JWT ${jwt}` },
      }
    );
    console.log(res);
  };

  const modifyTrade = async (portfolioGroupId, calculatedTradeId, tradeId) => {
    //TODO: How to patch a trade? Need to include something in the body.
    const res = await axios.patch(
      API_URL +
        `/portfolioGroups/${portfolioGroupId}/calculatedtrades/${calculatedTradeId}/modify/${tradeId}`,
      {
        headers: { Authorization: `JWT ${jwt}` },
      }
    );
    console.log(res);
  };

  const placeTrades = async (portfolioGroupId, calculatedTradeId) => {
    //TODO: How to post the trade? Need to include something in the body.
    const res = await axios.post(
      API_URL +
        `/portfolioGroups/${portfolioGroupId}/calculatedtrades/${calculatedTradeId}/placeOrders`,
      {
        headers: { Authorization: `JWT ${jwt}` },
      }
    );
    console.log(res);
  };

  const getExchangeRates = async () => {
    const res = await axios.get(API_URL + `currencies/rates`, {
      headers: { Authorization: `JWT ${jwt}` },
    });
    console.log(res);
  };

  return (
    <PassivAccountContext.Provider
      value={{
        login,
        logout,
        isLoggedIn: isTokenValid(),
        getAPIStatus,
        verifyTokenStatus,
        getPortfolioGroups,
        accounts,
        getAccountHoldings,
      }}
    >
      {props.children}
    </PassivAccountContext.Provider>
  );
}
