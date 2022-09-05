// API Docs: https://app.swaggerhub.com/apis-docs/passiv/PassivAPI/v1#/

import { useEffect, createContext } from "react";
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

  const getAccounts = async () => {
    const res = await axios.get(API_URL + "accounts", {
      headers: { Authorization: `JWT ${jwt}` },
    });

    if (res.status === 200) {
      //Build the expected return data structure
      const accountData = res.data.map((a) => ({
        internalID: a.id,
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

  const getAccountBalances = async (accountId) => {
    const res = await axios.get(API_URL + `accounts/${accountId}/balances`, {
      headers: { Authorization: `JWT ${jwt}` },
    });
    console.log(res);

    if (res.status === 200) {
      //Build the expected return data structure
      const balanceData = res.data.map((a) => ({
        internalID: a.currency.id,
        currencyCode: a.currency.code,
        currencyName: a.currency.name,
        balance: a.cash,
      }));

      return balanceData;
    } else {
      return null;
    }
  };

  const getAccountPositions = async (accountId) => {
    const res = await axios.get(API_URL + `accounts/${accountId}/positions`, {
      headers: { Authorization: `JWT ${jwt}` },
    });
    console.log(res);

    if (res.status === 200) {
      //Build the expected return data structure
      //TODO: Do we need this internal ID? And are we fetching the correct one? There's lots
      const positionData = res.data.map((a) => ({
        internalID: a.symbol.id,
        symbol: a.symbol.symbol.symbol,
        description: a.symbol.symbol.description,
        currencyCode: a.symbol.symbol.currency.code,
        units: a.units,
        price: a.price,
        value: a.units * a.price,
      }));

      console.log(positionData);

      return positionData;
    } else {
      return null;
    }
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
        getAccounts,
        getAccountBalances,
        getAccountPositions,
        getPortfolioGroups,
      }}
    >
      {props.children}
    </PassivAccountContext.Provider>
  );
}
