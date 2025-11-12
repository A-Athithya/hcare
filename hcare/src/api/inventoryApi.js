import { getData, postData, putData, deleteData } from "./client";

// Inventory endpoints
const endpoint = "/medicines";

// GET all inventory items
export const getInventory = () => getData(endpoint);

// ADD a new inventory item
export const addInventoryItem = (item) => postData(endpoint, item);

// UPDATE an existing inventory item
export const updateInventoryItem = (item) => putData(`${endpoint}/${item.id}`, item);

// DELETE an inventory item
export const deleteInventoryItem = (id) => deleteData(`${endpoint}/${id}`);
