import React, { useEffect, useState, useContext } from 'react';
import { db } from '../firebase'; // Adjust the import based on your Firebase setup
import { collection, getDocs, addDoc, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { FaPlus } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
// import { Modal } from 'react-bootstrap'; // Or any other modal library you prefer
import ModalComp from './ModalComp.jsx'
import MiniModalComp from './MiniModalComp.jsx'
// Required for Bootstrap modal styling
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is included
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Cards from './Cards.jsx';

// Import Context
import { AccountContext } from '../context/account';


const CaseBattle = () => {
    const { ethers, contractAddress, contractABI } = useContext(AccountContext);

    // Define states
    const [battles, setBattles] = useState([]);
    const [chests, setChests] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedChests, setSelectedChests] = useState([]);
    const [playType, setPlayType] = useState('');
    const [userUid, setUserUid] = useState(null);
    const [value, setValue] = useState([null, '']);
    const navigate = useNavigate();

    

    useEffect(() => {
        // Fetch user UID from localStorage
        const uid = localStorage.getItem('BlueGold_uid');
        if (uid) {
            setUserUid(uid);
        }

        // Fetch open battles
        const fetchBattles = async () => {
            const roomsCollection = collection(db, 'rooms');
            const roomSnapshot = await getDocs(roomsCollection);
            const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBattles(roomList);
        };

        fetchBattles();
    }, []);

    const handleRemoveChest = (chest) => {
        setSelectedChests(prev => prev.filter(item => item.name !== chest.name || item.quantity > 1));

    };

    useEffect(() => {
        // Fetch chests
        const fetchChests = async () => {
            const chestsCollection = collection(db, 'chests');
            const chestSnapshot = await getDocs(chestsCollection);
            const chestList = chestSnapshot.docs.map(doc => doc.data());
            setChests(chestList);
        };

        fetchChests();
    }, []);

    const v11Battle = () => {
        console.log("The selected battle type shown is 1v1")
        return (
            <>
                <ul className="flex flex-row flex-wrap w-full gap-6">
                    <li>
                        <input type="radio" id="hosting-big" name="hosting" value="hosting-big" className="hidden peer" />
                        <label for="hosting-big" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="flex flex-row items-center justify-center gap-2">
                                <IoMdPerson className='w-[5rem]' />
                            </div>
                        </label>
                    </li>
                </ul>
            </>
        )
    }

    const v22Battle = () => {
        return (
            <>
                <h3 className='mt-2 mb-2 font-bold'>Team 1</h3>
                <ul className="flex flex-row flex-wrap w-full gap-6">
                    {Array.from({ length: 2 - value[2] }).map((_, index) => (
                        <li key={index}>
                            <input type="radio" id={`hosting-1-${index}`} name="hosting" value={value[1]} onChange={() => setValue(prevValue => {
                                const newValue = [...prevValue];  // Copy the previous state
                                newValue[1] = `1${index}`;  // Update the first element
                                return newValue;  // Return the updated array
                            })} className="hidden peer" required />
                            <label for={`hosting-1-${index}`} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <IoMdPerson className='w-[5rem]' />
                                </div>
                            </label>
                        </li>
                    ))}
                </ul>
                <h3 className='mt-4 mb-2 font-bold'>Team 2</h3>
                <ul className="grid w-full gap-6 md:grid-cols-2">
                    {Array.from({ length: 2 - value[3] }).map((_, index) => (
                        <li key={index}>
                            <input type="radio" id={`hosting-1-${index}`} name="hosting" value={value[1]} onChange={() => setValue(prevValue => {
                                const newValue = [...prevValue];  // Copy the previous state
                                newValue[1] = `2${index}`;  // Update the first element
                                return newValue;  // Return the updated array
                            })} className="hidden peer" required />
                            <label for={`hosting-1-${index}`} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="flex flex-row items-center gap-2">
                                    <IoMdPerson className='w-[5rem]' />
                                </div>
                            </label>
                        </li>
                    ))}
                </ul>
            </>
        )
    }

    const way3battle = () => {
        return (
            <>
                <ul className="flex flex-row flex-wrap w-full gap-6">
                    {Array.from({ length: 3 - value[0].player.length }).map((_, index) => (
                        <li key={index}>
                            <input type="radio" id="hosting-small" name="hosting" value={`hosting-small-${index}`} className="hidden peer" required />
                            <label for="hosting-small" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <IoMdPerson className='w-[5rem]' />
                                </div>
                            </label>
                        </li>
                    ))}
                </ul>
            </>
        )
    }

    const way4battle = () => {
        return (
            <>
                <ul className="flex flex-row flex-wrap w-full gap-6">
                    {Array.from({ length: 4 - value[0].player.length }).map((_, index) => (
                        <li key={index}>
                            <input type="radio" id="hosting-small" name="hosting" value={`hosting-small-${index}`} className="hidden peer" required />
                            <label for="hosting-small" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <IoMdPerson className='w-[5rem]' />
                                </div>
                            </label>
                        </li>
                    ))}
                </ul>
            </>
        )
    }

    const handleCreateBattle = async () => {
        console.log('userUid', userUid);
        console.log('playType', playType);
        console.log('selectedChests', selectedChests);
        if (userUid && playType && selectedChests.length > 0) {
            const playersCount = playType === '1v1' ? 2 : playType === '2v2' ? 4 : 3;
            console.log('playersCount', playersCount);

            let sum = 0;
            selectedChests.map(chest => {
                sum += Number(chest.cost);
            });
            const totalCost = sum;
            console.log('totalCost', totalCost);
            const costPerPlayer = totalCost / playersCount;
            const slots = 12 * selectedChests.length / playersCount;
            /* eslint-disable no-restricted-globals */
            let check = confirm('THe battle creation prize will be $' + costPerPlayer + " Do you want to continue?");
            if (check) {
                const docref = await addDoc(collection(db, 'rooms'), {
                    host: userUid,
                    chests: selectedChests,
                    cost: costPerPlayer,
                    prize: totalCost,
                    players: playersCount,
                    typeOfGame: playType,
                    player: [{ id: userUid, score: 0, team: 1 }],
                    slots: slots,
                    active: true
                });

                // Contract Code
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const walletContract = new ethers.Contract(contractAddress, contractABI, signer);
                const tx = await walletContract.playGame(costPerPlayer, docref.id);
                await tx.wait();
                console.log('tx', tx);
                navigate(`/case-battle/room/${docref.id}`);
            }


            setModalVisible(false);
        }
    };

    const handleJoinBattle = async (battle) => {
        // Check if battle has available seats
        console.log('battle', battle);
        const battleRef = doc(db, 'rooms', battle.id);
        const battle2 = (await getDoc(battleRef)).data();
        console.log('battle', battle2);
        const joinseats = battle2.players;
        const seat_taken = battle2.player.length;
        console.log('joinseats', joinseats);    
       if(battle2.active === false){
              alert("This battle already ended");
                return;
        }

        if (battle2.player.length >= battle2.players) {
            alert("No available seats in this battle.");
            return;
        }

        let teamAssignment = null;
        console.log('battle', battle);
        let team1Players, team2Players;
        // If it's a 2v2, check for available slots in each team
        if (battle.typeOfGame === "2v2") {
            team1Players = battle.player.filter(p => p.team === 1);
            team2Players = battle.player.filter(p => p.team === 2);

            if (team1Players.length < 2) {
                teamAssignment = 1; // Assign to team 1
            } else if (team2Players.length < 2) {
                teamAssignment = 2; // Assign to team 2
            } else {
                alert("No available slots in this 2v2 battle.");
                return;
            }
        }
        let seat_team1 = 0, seat_team2 = 0;
        if (battle.typeOfGame === "2v2") {
            seat_team1 = team1Players.length;
            seat_team2 = team2Players.length;
        }
        console.log('teamAssignment', teamAssignment);
        setValue([battle, '', seat_team1, seat_team2]);
        setConfirmModalVisible(true);
    };

    const handleTeamSelection = async () => {
        const battle = value[0];
        console.log('battle', battle);
        setConfirmModalVisible(false);
        let check = confirm('Do you want to join the battle? it will cost you ' + battle.cost);

        if (check) {
            console.log('userUid', userUid);
            let updatedPlayers;
            if (userUid) {
                if (battle.typeOfGame === "2v2") {
                    updatedPlayers = [...battle.player, { id: userUid, score: 0, team: Number(value[1].slice(1)) }];
                }
                else {
                    updatedPlayers = [...battle.player, { id: userUid, score: 0, team: null }];
                }
                // Do the team assignment
                await updateDoc(doc(db, 'rooms', battle.id), {
                    player: updatedPlayers
                });
            } else {
                console.log('User not logged in');
            }

            // Contract Code
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const walletContract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await walletContract.playGame(battle.cost, battle.id);
            await tx.wait();
            console.log('tx', tx);

            // Navigate to the battle room
            navigate(`/case-battle/room/${battle.id}`);
        }
    }

    useEffect(() => {
        console.log('value', value);
    }, [value])

    return (
        <Layout>
            <div className="p-4 sm:ml-64 mt-[4.2rem]">
                <h1 className="text-2xl font-bold mb-4">Case Battles</h1>

                <div className='my-6'>
                    <button
                        className="rounded-md bg-white dark:bg-black dark:text-white border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-[30rem] h-[3rem] flex items-center justify-center ml-[1rem] text-lg"
                        type="button"
                        onClick={() => setModalVisible(true)}
                    >
                        <FaPlus className="mr-2" />
                        Create Battle
                    </button>
                </div>

                <h2 className="mb-4 flex justify-between items-center font-bold text-2xl mt-4 ml-2">{battles.length} Current Battles</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-4'>
                    {battles.map(battle => (
                        <Cards
                            key={battle.id}
                            title={`Chest: ${battle.chests.map(chest => chest.name).join(', ')}`}
                            clickEvent={() => handleJoinBattle(battle)}
                            styles="bg-slate-200 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        >

                            <div>
                                <p>Type: {battle.typeOfGame}</p>
                                <p>Cost to Enter: {battle.cost}</p>
                                <p>Prize: {battle.prize}</p>

                            </div>
                        </Cards>
                    ))}
                </div>

                {modalVisible && <ModalComp setModalVisible={setModalVisible}>
                    <div className="mx-14 mt-10 border-2 border-blue-400 rounded-lg">
                        <div className="mt-3 text-center text-4xl font-bold">Create Battle</div>
                        <div className="mt-2 text-center font-bold">The way it should be...</div>
                        <div className="p-8 flex flex-col">
                            <select name="select" value={playType} onChange={(e) => setPlayType(e.target.value)} id="select" className="my-6 block rounded-md border border-slate-300 bg-white px-3 py-4 font-semibold text-gray-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                <option value='' disabled className="font-semibold text-slate-300">Type of Play</option>
                                <option value='1v1' className="font-semibold text-slate-300">1v1</option>
                                <option value='2v2' className="font-semibold text-slate-300">2v2</option>
                                <option value='3way' className="font-semibold text-slate-300">3 Way</option>
                                <option value='4way' className="font-semibold text-slate-300">4 Way</option>
                            </select>

                            <div className="mt-4">
                                <label className="block mb-2 font-bold text-2xl">Chests:</label>
                                <div>
                                    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                                        {chests.map((chest) => (
                                            <li key={chest.name} className="pb-3 sm:pb-4">
                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                    <div className="flex-shrink-0">
                                                        <img className="w-8 h-8 rounded-full" src={chest.image} alt={chest.name} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
                                                            Price: {chest.cost}
                                                        </p>
                                                        <p className="text-lg text-gray-500 truncate dark:text-gray-400">
                                                            {chest.name}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedChests([...selectedChests, chest])}
                                                        className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                                    {selectedChests.map(chest => (
                                        <li key={chest.name} className="pb-3 sm:pb-4">
                                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                <div className="flex-shrink-0">
                                                    <img className="w-8 h-8 rounded-full" src={chest.image} alt={chest.name} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
                                                        {chest.name}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveChest(chest)}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="text-center">
                                <button onClick={handleCreateBattle} className="cursor-pointer rounded-lg bg-blue-700 px-8 py-5 text-sm font-semibold text-white">Create Battle</button>
                            </div>
                        </div>
                    </div>
                </ModalComp>}

                {confirmModalVisible && <MiniModalComp setConfirmModalVisible={() => setConfirmModalVisible(false)}>
                    <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">Select your team...</h3>
                    {value[0].typeOfGame === '1v1' && v11Battle()}
                    {value[0].typeOfGame === '2v2' && v22Battle()}
                    {value[0].typeOfGame === '3way' && way3battle()}
                    {value[0].typeOfGame === '4way' && way4battle()}
                    <button onClick={handleTeamSelection} type="button" className="text-white bg-[#FF9119] my-4 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                        Start Battle
                    </button>
                </MiniModalComp>}
                {/* <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Battle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label className="block mb-2">Type of Play:</label>
            <select
              value={playType}
              onChange={(e) => setPlayType(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Select</option>
              <option value="1v1">1v1</option>
              <option value="2v2">2v2</option>
              <option value="3 way">3 way</option>
              <option value="4 way">4 way</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="block mb-2">Chests:</label>
            <div>
              {chests.map((chest) => (
                <div key={chest.name} className="flex items-center mb-2">
                  <img src={chest.image} alt={chest.name} className="w-10 h-10 mr-2" />
                  <span>{chest.name}</span>
                  <button
                    onClick={() => setSelectedChests([...selectedChests, chest])}
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleCreateBattle}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Battle
          </button>
        </Modal.Footer>
      </Modal> */}
            </div>
        </Layout >
    );
};

export default CaseBattle;
