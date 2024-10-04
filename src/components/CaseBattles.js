import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  deleteDoc,
  getDoc,
  setDoc, // Added setDoc
} from 'firebase/firestore';
import { FaDice, FaStar, FaHeart, FaGem, FaCrown } from 'react-icons/fa';
import './CaseBattle.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import Layout from './Layout';

const ICONS = [
  { icon: <FaStar />, price: 10 },
  { icon: <FaHeart />, price: 20 },
  { icon: <FaGem />, price: 30 },
  { icon: <FaCrown />, price: 40 },
  // Add more icons as needed
];

const CaseBattle = () => {
  const [roomId, setRoomId] = useState(null);
  const [coins, setCoins] = useState(1000); // Fake coin balance
  const [rooms, setRooms] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [currentBid, setCurrentBid] = useState(null);
  const [bidPlaced, setBidPlaced] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState('');
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [playerReady, setPlayerReady] = useState(false); // For ready button

  // Fetch user name from Firestore based on UID
  useEffect(() => {
    const fetchUserName = async () => {
      const uid = localStorage.getItem('BlueGold_uid');
      if (uid) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        } else {
          setUserName('Unknown');
        }
      }
    };
    fetchUserName();
  }, []);

  // Fetch all available rooms from Firebase
  useEffect(() => {
    if (!user) return;
    const roomsRef = collection(db, 'rooms');
    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      const roomList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomList);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle player list and scores
  useEffect(() => {
    if (!roomId || roomId === 'computer-mode') return;
    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPlayers(data.players || []);
        setScores(data.scores || {});
      } else {
        setRoomId(null);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  // Create a new room
  const createRoom = async () => {
    const uid = localStorage.getItem('BlueGold_uid');
    if (!uid) {
      alert('You must be logged in to create a room.');
      return;
    }

    if (coins < 50) {
      alert('Not enough coins!');
      return;
    }

    setCoins(coins - 50); // Visual representation

    const roomRef = await addDoc(collection(db, 'rooms'), {
      host: uid,
      players: [{ id: uid, ready: false }],
      scores: { [uid]: 0 },
      gameActive: true,
    });
    setRoomId(roomRef.id);
  };

  // Play with computer (immediate game)
  const playWithComputer = () => {
    setCoins(coins - 50);
    setRoomId('computer-mode');
    const userPlayer = { id: 'User', ready: true };
    startGame([userPlayer]);
  };

  // Start the game
  const startGame = (currentPlayers = players) => {
    setRolling(true);
    setBidPlaced(false);

    const totalSlots = 4; // We are rolling 4 slots
    let slots = [];
    let slotResults = [];

    const rollSlots = (slotIndex) => {
      if (slotIndex >= totalSlots) {
        const bids = currentPlayers.map((player) => {
          return Array.from({ length: totalSlots }, () =>
            ICONS[Math.floor(Math.random() * ICONS.length)]
          ).reduce((sum, slot) => sum + slot.price, 0);
        });

        setCurrentBid({ bids, slots: slotResults });
        setBidPlaced(true);
        setRolling(false);

        if (roomId && roomId !== 'computer-mode') {
          const roomRef = doc(db, 'rooms', roomId);
          const newScores = { ...scores, [user.uid]: bids[0] };
          setDoc(roomRef, { scores: newScores }, { merge: true });
        }
        return;
      }

      const newSlot = ICONS[Math.floor(Math.random() * ICONS.length)];
      slots = [...slots, newSlot];
      slotResults = [...slotResults, newSlot];

      if (roomId && roomId !== 'computer-mode') {
        const playerSlotRef = doc(db, 'rooms', roomId, 'slots', user.uid);
        setDoc(playerSlotRef, { slotIndex, icon: newSlot }, { merge: true });
      }

      setTimeout(() => rollSlots(slotIndex + 1), 1000);
    };

    rollSlots(0);
  };

  // Join an existing room
  const joinRoom = async (roomIdToJoin) => {
    const uid = localStorage.getItem('BlueGold_uid');
    if (!uid) {
      alert('You must be logged in to join a room.');
      return;
    }

    if (coins < 50) {
      alert('Not enough coins!');
      return;
    }

    setCoins(coins - 50); // Visual representation

    const roomRef = doc(db, 'rooms', roomIdToJoin);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
      const data = roomSnap.data();
      setPlayers([...data.players, { id: uid, ready: false }]);
      setScores(data.scores || {});
      setRoomId(roomIdToJoin);

      setDoc(roomRef, { players: [...data.players, { id: uid, ready: false }] }, { merge: true });
    }
  };

  // End the game
  const endGame = async () => {
    if (roomId && roomId !== 'computer-mode') {
      await deleteDoc(doc(db, 'rooms', roomId));
      setRoomId(null);
      alert('Room deleted and game ended!');
    } else {
      setRoomId(null); // For computer mode, just reset the game
    }
  };

  const toggleReadyStatus = async () => {
    const uid = localStorage.getItem('BlueGold_uid');
    const roomRef = doc(db, 'rooms', roomId);
    const updatedPlayers = players.map((player) =>
      player.id === uid ? { ...player, ready: !player.ready } : player
    );
    setPlayers(updatedPlayers);

    await setDoc(roomRef, { players: updatedPlayers }, { merge: true });
  };

  useEffect(() => {
    if (players.length > 1 && players.every((player) => player.ready)) {
      startGame();
    }
  }, [players]);

  return (
    <Layout>
      <div className="case-battle">
        <h1>Case Battle Game</h1>
        <div className="coin-display">Coins: {coins}</div>

        {!roomId ? (
          <>
            <button className="game-button" onClick={playWithComputer}>
              Play with Computer
            </button>
            <button className="game-button" onClick={createRoom} disabled={!user}>
              Create Room for Multiplayer (50 Coins)
            </button>

            <div className="room-list">
              <h2>Available Rooms</h2>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <div key={room.id} className="room-item" onClick={() => joinRoom(room.id)}>
                    Room ID: {room.id}
                  </div>
                ))
              ) : (
                <p>No rooms available</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Room ID: {roomId}</h2>
            <div className="player-list">
              {players.map((player, index) => (
                <div key={index} className="player-item">
                  {player.id}: {scores[player.id] || 0} Points{' '}
                  {player.id === user.uid ? (
                    <button onClick={toggleReadyStatus}>
                      {player.ready ? 'Ready' : 'Not Ready'}
                    </button>
                  ) : (
                    <span>{player.ready ? 'Ready' : 'Not Ready'}</span>
                  )}
                </div>
              ))}
            </div>

            {rolling ? (
              <div className="rolling">Rolling...</div>
            ) : bidPlaced ? (
              <div className="results">
                <h3>Results:</h3>
                {currentBid.bids.map((bid, index) => (
                  <div key={index}>Player {index + 1}: {bid} Points</div>
                ))}
              </div>
            ) : (
              <button onClick={startGame} disabled={!players.every((p) => p.ready)}>
                Start Game
              </button>
            )}

            <button className="end-game" onClick={endGame}>
              End Game
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CaseBattle;
