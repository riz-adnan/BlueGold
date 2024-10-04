import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import {auth} from '../firebase';
// Import Components
import Layout from './Layout';
import { db } from '../firebase';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';

// Import Icons
import { FaSearch } from "react-icons/fa";

// Import Context
import { AccountContext } from '../context/account';

export default function Wallet() {
    const { account, contractAddress, contractABI } = useContext(AccountContext);
    const [balance, setBalance] = useState(50.365);
    const [transactionAll, setTransactionAll] = useState([
        
    ]);
    const [transaction, setTransaction] = useState([])
    const [depositAmount, setDepositAmount] = useState(0);
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setTransaction(transactionAll.filter((transact) => transact.id.toLowerCase().includes(value.toLowerCase()) || transact.from.toLowerCase().includes(value.toLowerCase()) || transact.to.toLowerCase().includes(value.toLowerCase()) || transact.amount.toLowerCase().includes(value.toLowerCase())));
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        // Fetch from backend
    }

    const handleRedeemMoney = async () => {
        // Implement the logic to redeem the money
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const walletContract = new ethers.Contract(contractAddress, contractABI, signer);
        const balanceWei = await walletContract.checkBalance();
        const tx = await walletContract.withdraw(balanceWei);
        await tx.wait();
        console.log("Money redeemed");
        const userdoc= await doc(db, 'users', localStorage.getItem('BlueGold_uid'));
        await updateDoc(userdoc, {["transaction history"]:arrayUnion({ type: 'Withdraw', date: new Date(),  amount: balance})});


    }

    const handleVerify = async () => {
        const userid= localStorage.getItem('BlueGold_uid');
        const user = await auth.currentUser;
        console.log(user);
        if(user)
        {
            if(user.emailVerified)
            {
                alert("Email is already verified");
            }
            else{
                const response = await fetch('https://bluegold.onrender.com/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email }),
                });
                const data = await response.json();
            alert("Email link to verify email has been sent to your email");
            }
                
        }
        else{
            alert("User not logged in");
        }
    }
    const handleLogout = async () => {
        await auth.signOut();
        localStorage.removeItem('BlueGold_uid');
       
    }


        


    const handleDepositMoney = async () => {
        try {
            // Implement the logic to deposit the money
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const walletContract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await walletContract.deposit({ value: ethers.utils.parseEther(depositAmount) });
            await tx.wait();
            console.log("Money deposited");
            const userdoc= await doc(db, 'users', localStorage.getItem('BlueGold_uid'));
            await updateDoc(userdoc, {["transaction history"]:arrayUnion({ type: 'Deposit', date: new Date(),  amount: depositAmount})});
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        // Implement the logic to fetch the balance and transactions
        const fetchBalance = async () => {
            if (!window.ethereum) {
                console.log("MetaMask is not installed");
                return;
            }
            console.log("MetaMask is installed");
            console.log("check: ", ethers.providers)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const walletContract = new ethers.Contract(contractAddress, contractABI, signer);
            const balanceWei = await walletContract.checkBalance();
            const balance = ethers.utils.formatEther(balanceWei);
            setBalance(balance);
        }

        fetchBalance();
        const fetchTransactions = async () => {
            const userdoc= await doc(db, 'users', localStorage.getItem('BlueGold_uid'));
            const docSnap = await getDoc(userdoc);
            const transactions = docSnap.data()["transaction history"];
            setTransaction(transactions);
            console.log("Transactions: ", transaction);

        }
        fetchTransactions();
        
    }, [])

    return (
        <Layout>
            <main className='mt-[4rem] pt-[0.8rem] bg-gray-800 h-[100vh]'>
                <div className="lg:ml-64 lg:pl-4 lg:flex lg:flex-col lg:w-75% mt-5 mx-2">

                    {/* <!-- Buscador --> */}
                    <div className="bg-black rounded-full border-none p-3 mb-4 shadow-md">
                        <form onSubmit={handleSearch} className="flex items-center">
                            <FaSearch className="text-white w-6 h-full ml-1" type='submit' />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="ml-3 text-white focus:outline-none w-full bg-transparent"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </form>
                    </div>

                    <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className='w-1/4 p-2 mb-4 bg-gray-200 rounded-lg focus:outline-none'
                    />

                    {/* <!-- Contenedor Principal --> */}
                    <div className="lg:flex gap-4 items-stretch">
                        {/* <!-- Caja Grande --> */}
                        <div className="bg-white md:p-2 p-6 rounded-lg border border-gray-200 mb-4 lg:mb-0 shadow-md lg:w-[35%]">
                            <div className="flex justify-center items-center space-x-5 h-full">
                                <div>
                                    <p>Total Balance</p>
                                    <h2 className="text-4xl font-bold text-gray-600">{balance}</h2>
                                    <p>$ {balance * 1000}</p>
                                </div>
                                <img src="https://www.emprenderconactitud.com/img/Wallet.png" alt="wallet"
                                    className="h-24 md:h-20 w-38" />
                            </div>
                        </div>

                        {/* <!-- Caja Blanca --> */}
                        <div className="bg-white p-4 rounded-lg xs:mb-4 max-w-full shadow-md lg:w-[65%]">
                            {/* <!-- Cajas pequeñas --> */}
                            <div className="flex flex-wrap justify-between h-full">
                                {/* <!-- Caja pequeña 1 --> */}
                                <button
                                    onClick={handleDepositMoney}
                                    className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                                    <i className="fas fa-hand-holding-usd text-white text-4xl"></i>
                                    <p className="text-white">Deposit</p>
                                </button>

                                {/* <!-- Caja pequeña 2 --> */}
                                <div
                                    className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                                    <i className="fas fa-exchange-alt text-white text-4xl"></i>
                                    <p className="text-white">Transfer</p>
                                </div>

                                {/* <!-- Caja pequeña 3 --> */}
                                <button
                                    onClick={handleRedeemMoney}
                                    className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                                    <i className="fas fa-qrcode text-white text-4xl"></i>
                                    <p className="text-white">Redeem</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Tabla --> */}
                    <div className="bg-white rounded-lg p-4 shadow-md my-4">
                        <table className="w-full">
                            <thead>
                                <tr className='border-b-2 w-[100%]'>
                                    <th className='px-4 py-2 text-left'>
                                        <h2 className="text-ml font-bold text-gray-600">Type</h2>
                                    </th>
                                    
                                    <th className='px-4 py-2 text-left'><h2 className="text-ml font-bold text-gray-600">Date</h2></th>
                                    <th className='px-4 py-2 text-left'><h2 className="text-ml font-bold text-gray-600">Amount</h2></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction && transaction.length !== 0 ? ( 
                                transaction.map((transact) => (
                                    <tr className="border-b w-full">
                                        <td className="px-4 py-2 text-left align-top w-1/2">
                                            <div>
                                                <p> {transact.type}</p>
                                               
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-left align-top w-1/2">
                                            <div>
                                                <h2> 17th September</h2>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-left align-top w-1/2">
                                            <div>
                                                <h2>$ {transact.amount}</h2>
                                            </div>
                                        </td>
                                        
                                    </tr>)
                                    ))
                                    :(<tr><td colSpan='3' className='text-center'>No transactions found</td></tr> )
                                                }
                            </tbody>
                        </table>
                    </div>
                    <div class ='flex'>
                    <button type="button" class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleVerify}>Verify Email</button>
<button type="button" class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleLogout}>Logout </button>
</div>

                </div>
            </main>
        </Layout>
    )
}