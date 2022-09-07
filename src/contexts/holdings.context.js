import { useContext, useState, useEffect, createContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import {
  PassivAccountProvider,
  PassivAccountContext,
} from "./passiv-account-provider";

export const HoldingsContext = createContext();

export function HoldingsProvider(props) {
  const { getAccounts, getAccountPositions, getAccountBalances } =
    useContext(PassivAccountContext);

  const [accounts, setAccounts] = useLocalStorageState(null);
  const [stocks, setStocks] = useState(null);
  const [cash, setCash] = useState(null);
  const [stockValue, setStockValue] = useState(null);
  const [cashValue, setCashValue] = useState(null);

  // [] option will behave like componentDidMount and run only once at startup
  // Fetch the accounts and holdings
  useEffect(() => {
    async function fetchAccounts() {
      setAccounts(await getAccounts());
      console.log("fetch accounts");
    }

    //TODO: Loop through all accounts and get all holdings for all accounts
    async function fetchHoldings() {
      const tempStocks = await getAccountPositions();
      setStocks(tempStocks);
      const tempCash = await getAccountBalances();
      setCash(tempCash);

      //TODO: Total value needs to select for the proper currency

      setCashValue(cash.reduce((p, c) => p + c.balance, 0));
      setStockValue(stocks.reduce((p, c) => p + c.value, 0));
    }

    fetchAccounts();
    fetchHoldings();
  }, []);

  //TODO: Fetch these from the state variable instead of fetching each time
  const getAccountHoldings = async (internalID) => {
    const stocks = await getAccountPositions(internalID);
    const cash = await getAccountBalances(internalID);

    const stockValue = stocks.reduce((p, c) => p + c.value, 0);
    const cashValue = cash.reduce((p, c) => p + c.balance, 0);

    return { stocks, cash, stockValue, cashValue };
  };

  return (
    <PassivAccountProvider>
      <HoldingsContext.Provider value={{ accounts, getAccountHoldings }}>
        {props.children}
      </HoldingsContext.Provider>
    </PassivAccountProvider>
  );
}
