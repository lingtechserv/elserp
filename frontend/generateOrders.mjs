import { faker } from '@faker-js/faker';
import fs from 'fs';
import { addDays, subDays, startOfToday, startOfYesterday } from 'date-fns';

const statuses = [
  { status: 'created', weight: 14 },
  { status: 'scheduled', weight: 17 },
  { status: 'picking', weight: 1 },
  { status: 'picked', weight: 1 },
  { status: 'making', weight: 2 },
  { status: 'made', weight: 2 },
  { status: 'completed', weight: 55 },
  { status: 'on hold', weight: 8 }
];

const getWeightedStatus = () => {
  const totalWeight = statuses.reduce((sum, status) => sum + status.weight, 0);
  const randomNum = Math.random() * totalWeight;
  let weightSum = 0;

  for (let { status, weight } of statuses) {
    weightSum += weight;
    if (randomNum <= weightSum) {
      return status;
    }
  }
};

// Keep track of used equipment IDs for "making" status
const usedEquipmentIds = new Set();

const generateRandomDate = () => {
  const date = faker.date.future();
  const minutes = Math.floor(date.getMinutes() / 15) * 15;
  date.setMinutes(minutes, 0, 0);
  return date;
};

const generateScheduledDate = () => {
  const date = faker.date.between(new Date(), addDays(new Date(), 7));
  const minutes = Math.floor(date.getMinutes() / 15) * 15;
  date.setMinutes(minutes, 0, 0);
  return date;
};

const generateRandomOrder = (id) => {
  let status = getWeightedStatus();
  let startDate = faker.date.past();
  let endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 3 * 60 * 60 * 1000));

  // Ensure equipment_id uniqueness if status is "making"
  let equipment_id = null;
  if (status === 'making') {
    const availableEquipmentIds = [1, 2, 3, 4, 5, 7].filter(eid => !usedEquipmentIds.has(eid));
    if (availableEquipmentIds.length === 0) {
      // No available equipment IDs, select a different status
      const otherStatuses = statuses.filter(s => s.status !== 'making' && s.weight > 0);
      status = otherStatuses[Math.floor(Math.random() * otherStatuses.length)].status;
    } else {
      equipment_id = availableEquipmentIds[Math.floor(Math.random() * availableEquipmentIds.length)];
      usedEquipmentIds.add(equipment_id);
    }
  } else if (['made', 'complete'].includes(status)) {
    // Ensure equipment_id is set for made and complete statuses
    equipment_id = faker.number.int({ min: 1, max: 7 });
    if (equipment_id === 6) {  // Exclude 6 from valid equipment
      equipment_id = 5;
    }
  }

  if (status === 'scheduled') {
    startDate = generateScheduledDate();
    endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 2 + 1) * 60 * 60 * 1000);  // 1-3 hours
  } else if (status === 'completed') {
    startDate = faker.date.past(new Date().getTime() - 24 * 60 * 60 * 1000);
    endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 2 + 1) * 60 * 60 * 1000);  // 1-3 hours
  } else if (status === 'making') {
    startDate = new Date();
    endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 2 + 1) * 60 * 60 * 1000);  // 1-3 hours
  } else if (status === 'made') {
    startDate = startOfYesterday();
    endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 2 + 1) * 60 * 60 * 1000);  // 1-3 hours
  }

  const scheduledStart = generateRandomDate();
  const scheduledEnd = new Date(scheduledStart.getTime() + Math.floor(Math.random() * 2 + 1) * 60 * 60 * 1000);  // 1-3 hours
  
  const incrementMinutes = Math.floor(scheduledEnd.getMinutes() / 15) * 15;
  scheduledEnd.setMinutes(incrementMinutes, 0, 0);

  return {
    basics: {
      id,
      customer: faker.company.name(),
      created_date: faker.date.past().toISOString(),
      status
    },
    ingredients: [
      {
        id: faker.string.uuid(),
        sku: faker.string.alphanumeric(7).toUpperCase(),
        name: faker.commerce.productName(),
        location: `Warehouse ${faker.number.int({ min: 1, max: 3 })}`
      },
      {
        id: faker.string.uuid(),
        sku: faker.string.alphanumeric(7).toUpperCase(),
        name: faker.commerce.productName(),
        location: `Warehouse ${faker.number.int({ min: 1, max: 3 })}`
      },
      {
        id: faker.string.uuid(),
        sku: faker.string.alphanumeric(7).toUpperCase(),
        name: faker.commerce.productName(),
        location: `Warehouse ${faker.number.int({ min: 1, max: 3 })}`
      }
    ],
    production: {
      status,
      equipment_id: equipment_id,
      start: ['making', 'made', 'complete'].includes(status) ? startDate.toISOString() : null,
      stop: ['made', 'complete'].includes(status) ? endDate.toISOString() : null,
      scheduled_start: ['scheduled', 'picking', 'picked', 'making', 'made', 'completed'].includes(status) ? scheduledStart.toISOString() : null,
      scheduled_end: ['scheduled', 'picking', 'picked', 'making', 'made', 'completed'].includes(status) ? scheduledEnd.toISOString() : null,
      notes: status === 'on hold' ? 'Waiting on inventory, expected fulfill date 01/03' : ''
    }
  };
};

const generateOrdersData = (numberOfOrders) => {
  const orders = [];
  for (let i = 1; i <= numberOfOrders; i++) {
    orders.push(generateRandomOrder(i));
  }
  return orders;
};

const outputPath = 'public/data/orders.json';
fs.mkdirSync('public/data', { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(generateOrdersData(50), null, 2));

console.log(`Orders data generated and saved to ${outputPath}`);