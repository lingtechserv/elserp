import fs from 'fs';

// Helper function to create unique IDs
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Generate random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate inventory item with the specified constraints
const generateInventoryItem = () => {
  const minimum_quantity = getRandomInt(5, 20);
  const reorder_quantity = minimum_quantity * 2;
  const stock_quantity = reorder_quantity + getRandomInt(1, 20); // Ensure stock is above reorder point
  const tag1 = getRandomInt(1, 3);
  const tag2 = getRandomInt(2, 4);
  const lead_time = getRandomInt(30, 80);
  const tp = getRandomInt(40, 100);

  return {
    id: generateUniqueId(),
    sku: Math.random().toString(36).substring(2, 9).toUpperCase(),
    name: `Item ${Math.floor(Math.random() * 1000)}`,
    location: `Warehouse ${Math.floor(Math.random() * 10) + 1}`,
    stock_quantity,
    reorder_quantity,
    minimum_quantity,
    tag1,
    tag2,
    lead_time,
    tp
  };
};

// Generate specified number of inventory items
const generateInventory = (numItems) => {
  const inventory = [];
  for (let i = 0; i < numItems; i++) {
    inventory.push(generateInventoryItem());
  }
  return inventory;
};

// Generate 10 inventory items and save to file
const inventory = generateInventory(10);
fs.writeFileSync('public/inventory.json', JSON.stringify(inventory, null, 2));
console.log('Generated inventory items and saved to public/inventory.json');