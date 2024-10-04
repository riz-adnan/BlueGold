import React from 'react';
import addItemsToChest from './FirebaseUpdate'; // Adjust the path as necessary

const App = () => {
  const handleAddItems = () => {
    addItemsToChest();
  };

  return (
    <div>
      <button onClick={handleAddItems}>Add Items</button>
    </div>
  );
};

export default App;
