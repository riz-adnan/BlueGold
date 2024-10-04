import React, { createContext, useState, useEffect } from 'react';

// Import the WalletStorage contract ABI
import WalletStorage from '../contracts/WalletStorage.json';
const { ethers } = require('ethers');

const contractAddress = '0x43Fc0784204D63B847049feBd26836433b48350A';
const contractABI = WalletStorage.abi;

// Create the AccountContext
export const AccountContext = createContext();


// AccountProvider component to provide the context to other components
export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState('0x0');

  return (
    <AccountContext.Provider value={{ account, setAccount, contractAddress, contractABI, ethers, WalletStorage }}>
      {children}
    </AccountContext.Provider>
  );
};
