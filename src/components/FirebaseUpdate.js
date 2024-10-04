import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Assuming your Firestore initialization is in firebase.js

const addItemsToChest = async () => {
  const chestRef = doc(db, "chests", "dSoiSa9vUj93lsm30Fph"); // Replace with your chest document ID

  try {
    // Fetch current data from Firestore
    const chestSnap = await getDoc(chestRef);

    if (chestSnap.exists()) {
      const currentData = chestSnap.data();
      const currentItems = currentData.Items || [];

      // Predefined items
      const predefinedItems = [
        
        
      ];

      // Randomly generated items
      const randomItems = [
        { Name: "cookie-bite", Price: "1" },
        { Name: "hammer", Price: "2" },
        { Name: "star", Price: "3" },
        { Name: "shield", Price: "4" },
        { Name: "sword", Price: "5" },
        { Name: "potion", Price: "6" },
        { Name: "book", Price: "7" },
        { Name: "ring", Price: "8" },
        { Name: "crown", Price: "9" },
        { Name: "scepter", Price: "10" },
        { Name: "amulet", Price: "11" },
        { Name: "wand", Price: "12" },
      ];

      // Combine current items with predefined and random items
      const allItems = [...currentItems, ...predefinedItems, ...randomItems];

      // Update Firestore document with the new list of items
      await updateDoc(chestRef, {
        Items: allItems
      });

      console.log("Items successfully added!");
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error adding items: ", error);
  }
};

export default addItemsToChest;
