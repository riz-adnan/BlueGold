import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Layout from './Layout';
import io from 'socket.io-client';
import { ChestCarousel } from "./ui/floatingDock";
import {
    IconBrandGithub,
    IconBrandX,
    IconExchange,
    IconHome,
    IconNewSection,
    IconTerminal2,
} from "@tabler/icons-react";

// Import context
import { AccountContext } from '../context/account';

// Chest Images
const chestImages = [
    {
        title: "Rare",
        icon: (
            <img
                src='https://editors.dexerto.com/wp-content/uploads/2024/09/05/fortnite-rare-chest.jpg'
                alt='Rare'
                className='h-full w-full'
            />
        ),
    },
    {
        title: "Common",
        icon: (
            <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLt6s9ZdTJQs9YCxvm8PFRbgm8oQsMZNvROA&s'
                alt='Common'
                className='h-full w-full'
            />
        ),
    },
    {
        title: "Legendry",
        icon: (
            <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaUiIjIBCObr7I2a3ZMmh8lBVnd3ohZzXvSw&s'
                alt='Legendry'
                className='h-full w-full'
            />
        ),
    },
    {
        title: "Champion",
        icon: (
            <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw7WqWuEwuJNm3s2I6Iq0uAQ-w5tIsVfbh-w&s'
                alt='Champion'
                className='h-full w-full'
            />
        ),
    },
    {
        title: "Epic",
        icon: (
            <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbNkwjjM7CpV9gJ5O5X8NgShVbqDd4u_rchA&s'
                alt='Epic'
                className='h-full w-full'
            />
        ),
    },
];

const itemsImages = {
    'cookie-bite': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp1wRndzS7k8aenrE79p1m_suSeGN1K4Rfyg&s',
    'hammer': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWcjQBfkx1yaxXV2oqyxbBtCZkbNxrzyhaQ&s',
    'star': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ScMyrKM4y1H8kro8XhYO-qwZpwMqdnVxYA&s',
    'shield': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2vPxCoj2QaV-xa2jDCu_SNdchSDxi2NbCTg&s',
    'sword': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3uiNhwioULYy79avejRF1y__rO82MEnAEsw&s',
    'potion': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHHTW3IXtcjwiY6rP-HGGFPcE-HE5C4OGSbA&s',
    'book': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0J0axTCva6hSL64GYLDhZDI0Z8SRgOkOuBw&s',
    'ring': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4IdoJc_An219IzrCnUXq43GdYG9y3Z1fNcA&s',
    'crown': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3PuScQnT64CfUz_MJLm4a9MZYbFrvCJj10Q&s',
    'scepter': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP0V93OKEtF23z0vOsDuc4UxOYn08hTdPN1Q&s',
    'amulet': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYsr6e0Lbf4Ti53OvguZvDNB07z5CEevqlSw&s',
    'wand': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVyYOck86mhbhAt8QvhTMQ_eg6Axa5Ruo2PQ&s'
}

// const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Chest = () => {
    const { ethers, contractAddress, contractABI } = useContext(AccountContext);
    const { roomId } = useParams(); // Get roomId from params
    const user_id = localStorage.getItem('BlueGold_uid');
    const [messages, setMessages] = useState([]);
    const [items, setItems] = useState({});
    const [chestMessage, setChestMessage] = useState('');
    const [winnerid, setWinnerid] = useState([]);

    const [players, setPlayers] = useState({
        key1: [1, 2, 3],
        key2: ['a', 'b', 'c'],
        key3: [true, false, true],
    });
    const score = [0, 0, 0, 0]
    const [finalscore, setfscore] = useState({});
    const [num, setNum] = useState(0);
    const [currentchest, setCurrentChest] = useState('Rare');
    const [candidates, setCandidates] = useState([]);
    const [slots, setslots] = useState("");
    const [names, setNames] = useState({});
    const [winner, setWinner] = useState([]);
    const socket = io('https://bluegold.onrender.com', { autoConnect: false });



    const getDetails = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user_id));
            console.log('User details:', userDoc.data());

            const roomDoc = await getDoc(doc(db, 'rooms', roomId));
            const roomData = roomDoc.data();
            console.log('roomData:', roomData);
            console.log('roomData.player:', roomData.player);


            if (roomData) {
                if (JSON.stringify(roomData.player) !== JSON.stringify(candidates)) {
                    setCandidates(roomData.player || []);


                    for (let i = 0; i < roomData.player.length; i++) {
                        const entry = roomData.player[i].id;
                        console.log('entry:', entry);
                        let tepl = players;
                        let finl = finalscore;

                        if (roomData.players[entry].items) {
                            console.log('items inside loop:', roomData.player[i].items);
                            tepl[entry] = roomData.players[entry].items;
                            setPlayers(tepl);
                        }
                        else {
                            tepl[entry] = [];
                            setPlayers(tepl);
                        }

                        if (roomData.players[entry].score) {
                            finl[entry] = roomData.players[entry].score;
                            setfscore(finl);


                        }
                        else {
                            finl[entry] = 0;
                            setfscore(finl);
                        }

                    }
                }
                console.log('finalscore:', finalscore);
                console.log('players:', players);
                console.log('candidate try:', candidates);
                for (let i = 0; i < roomData.player.length; i++) {
                    console.log('player try:', roomData.player[i]);
                    let tempnames = names;
                    let tempid = roomData.player[i].id;
                    const playerdocs = await getDoc(doc(db, 'users', tempid));
                    tempnames[tempid.toString()] = playerdocs.data().fullName;
                    console.log('tempnames:', tempnames);
                    if (JSON.stringify(tempnames) !== JSON.stringify(names)) {
                        setNames(tempnames);
                    }
                }
            }
            console.log('players:', players);
            console.log('Room details:', roomData);
            console.log('names: ', names);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };
    const settingslots = async () => {
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));
        const roomData = roomDoc.data();
        console.log('roomdata slots are:', roomData);
        setslots(roomData.slots);
        console.log('slots:', slots)
    }
    useEffect(() => {
        settingslots();

        console.log("slots:", slots);
        console.log('The Candidates are:', candidates);
        console.log('The names are:', names);

    }, [slots]);

    const checkWinner = async () => {
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));
        const roomData = roomDoc.data();
        const playerids = roomData.player;
        let max = 0;
        let winnerid;
        if (roomData.typeOfGame !== '2v2') {
            for (let i = 0; i < playerids.length; i++) {
                if (finalscore[playerids[i].id] > max) {
                    max = finalscore[playerids[i].id];
                    winnerid = playerids[i].id;
                }

            }

            setWinner([names[winnerid]]);
            setWinnerid([winnerid]);
            console.log('winner:', winner);
        }
        else {
            let team1 = 0;
            let team2 = 0;
            for (let i = 0; i < playerids.length; i++) {
                if (playerids[i].team === 'team1') {
                    team1 += finalscore[playerids[i].id];
                }
                else {
                    team2 += finalscore[playerids[i].id];
                }
            }
            let winners = [];
            let winnerids = []
            if (team1 > team2) {
                for (let i = 0; i < playerids.length; i++) {
                    if (playerids[i].team === 'team1') {
                        winners.push(names[playerids[i].id]);
                        winnerids.push(playerids[i].id);
                    }
                }
                setWinner(winners);
                setWinnerid(winnerids);
            }
            else {
                for (let i = 0; i < playerids.length; i++) {
                    if (playerids[i].team === 'team2') {
                        winners.push(names[playerids[i].id]);
                        winnerids.push(playerids[i].id);
                    }
                }
                setWinner(winners);
                setWinnerid(winnerids);
            }
        }
        
        
    }

    useEffect(() => {
        getDetails();
        console.log('dusra console.log');

        socket.connect();


        console.log('user_id:', user_id);
        socket.emit('join', { roomId, user_id });
        socket.on('joined_room', async (data) => {
            if (data.roomId === roomId) {
                getDetails();
            }
        });


        socket.on('chest_opened', (data) => {
            console.log("data", data)
            if (data.roomId === roomId) {
                getDetails();
                setCurrentChest(data.chestType);
            }
        });
        console.log('players:', players);

        socket.on('game_end', (data) => {
            console.log("end game data", data)
            if (data.roomId === roomId) {
                checkWinner();
                

                // Contract code
            }
        })


        return () => {

            socket.off('chest_opened');
            socket.off('joined_room');
            socket.off('game_end');
            socket.disconnect();
        };
    }, [roomId, user_id, players]);

    return (
        <Layout>
            <div className="p-4 sm:ml-64 mt-[4.2rem]">
                <div className="max-w-3xl mx-auto text-center mt-16">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2 border-t-4 border-b-4 border-purple-600 py-4">
                        CHEST Battle
                    </h1>
                </div>
                <ChestCarousel items={chestImages} active={currentchest} />

                <ul className={`grid grid-cols-1 md:grid-cols-2 ${candidates.length === 4 ? 'lg:grid-cols-4' : candidates.length === 3 ? 'lg:grid-cols-3' : ''} gap-4`}>
                    {Array.isArray(candidates) && candidates.length > 0 ? (
                        candidates.map((candidate) => (<div className='flex flex-col justify-center items-center'>
                            <li className="dark:bg-slate-800 gap-6 flex items-center justify-center">
                                <div className="bg-gray-100 dark:bg-gray-700 relative shadow-xl overflow-hidden hover:shadow-2xl group rounded-xl p-5 transition-all duration-500 transform">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHxhdmF0YXJ8ZW58MHwwfHx8MTY5MTg0NzYxMHww&ixlib=rb-4.0.3&q=80&w=1080"
                                            className="w-32 group-hover:w-36 group-hover:h-36 h-32 object-center object-cover rounded-full transition-all duration-500 delay-500 transform"
                                        />
                                        <div className="w-fit transition-all transform duration-500">
                                            <h1 className="text-gray-600 dark:text-gray-200 font-bold">
                                                {names[(candidate.id)]}
                                            </h1>
                                            <p className="text-gray-400">Player</p>
                                            <div
                                                className="text-xs text-gray-500 dark:text-gray-200 group-hover:opacity-100 opacity-0 transform transition-all delay-300 duration-500">
                                                {candidate.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <div className="w-full sm:w-1/2 my-4">
                                <div className="relative h-full ml-0 md:mr-2">
                                    <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"></span>
                                    <div className="relative h-full p-5 bg-white border-2 border-green-500 rounded-lg">
                                        <div className="flex items-center -mt-1">
                                            <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">Score:
                                                &nbsp; {finalscore[candidate.id] ? finalscore[candidate.id] : 0}
                                            </h3>
                                        </div>
                                        <p className="mb-2 text-gray-600 flex flex-row flex-wrap gap-2">
                                            {Array.isArray(players[candidate.id]) ? players[candidate.id].map((item, index) => (
                                                <img
                                                    src={itemsImages[item]}
                                                    alt={index}
                                                    className='h-10 w-10'
                                                />
                                            )) : <p className="mt-1 mb-1 ml-4 text-xs font-medium text-green-500 uppercase">------------</p>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>))
                    ) : (
                        <li>No players found</li>
                    )}
                    {/* <li key={candidate.id}>
                                {/* Render player id
                                {candidate.id}

                                {/* Render templayer[player.id] if it exists and is an array
                                {Array.isArray(players[candidate.id]) &&
                                    players[candidate.id].map((item, index) => (
                                        <p key={index}> {item} </p>
                                    ))}
                            </li> */}
                </ul>



                {winner !== "" ? (
                    <p className="text-2xl font-bold text-gray-900 leading-tight mb-2 border-t-4 border-b-4 border-purple-600 py-4">
                        The Winner is {winner}
                    </p>
                ) : (<p></p>)}

            </div>
        </Layout>
    );
};

export default Chest;
