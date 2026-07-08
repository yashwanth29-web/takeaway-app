import restaurantsData from '../mock/restaurants.json';
import menuData from '../mock/menu.json';

// Simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchRestaurants = async () => {
  await delay(500);
  return restaurantsData;
};

export const fetchRestaurantById = async (id) => {
  await delay(500);
  const restaurant = restaurantsData.find(r => r.id === id);
  if (!restaurant) throw new Error('Restaurant not found');
  return restaurant;
};

export const fetchMenuByRestaurantId = async (id) => {
  await delay(500);
  let menu = menuData.filter(m => m.restaurantId === id);
  // Fallback to r1 for prototype
  if (menu.length === 0) {
    menu = menuData.filter(m => m.restaurantId === 'r1');
  }
  return menu;
};

// We will also use a function to fetch all menu data for checkout total
export const fetchAllMenuData = async () => {
  await delay(200);
  return menuData;
};
