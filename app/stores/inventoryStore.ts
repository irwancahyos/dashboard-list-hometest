import { create } from 'zustand';
import defaultDataInventory from '@/lib/data/dummyDataInventory.json';
import { formatUpdatedDate } from '@/lib/utils';

// ********** Local Interface **********
type Inventory = {
  id: string;
  image: Base64URLString;
  name: string;
  stock: number;
  price: string;
  code: string;
  updatedAt: string;
};
interface InventoryResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: Inventory[];
}
interface InventoryStore {
  inventory: InventoryResponse | null;
  setInventory: () => void;
  addItem: (item: Inventory) => void;
  deleteItem: (id: string) => void;
  getOneItem: (id: string) => Inventory | undefined;
  updateItem: (id: string, item: Inventory) => void;
  updateStock: (id: string, changeAmount: number) => void;
}

// ********** Main Store **********
export const useInventoryStore = create<InventoryStore>((set, get) => ({
  // Assign inventory with data json
  inventory: defaultDataInventory,
  setInventory: () => set({ inventory: defaultDataInventory }),

  // Add item setter
  addItem: (item) =>
    set((state) => {
      if (!state.inventory) return state;

      const updatedData = [item, ...state.inventory.data];
      return {
        inventory: {
          ...state.inventory,
          data: updatedData,
          totalItems: updatedData.length,
          totalPages: Math.ceil(updatedData.length / state.inventory.pageSize),
        },
      };
    }),

  // Get one item getter
  getOneItem: (id: string) => {
    const state = get();
    return state.inventory?.data.find((el) => el.id === id);
  },

  // Update stock setter
  updateStock: (id, changeAmount) => set((state) => {
    if (!state.inventory) return state; 
    
    return {
      inventory: {
        ...state.inventory, 
        data: state.inventory.data.map(item => 
          item.id === id 
            ? { 
                ...item, 
                stock: Math.max(0, item.stock + changeAmount),
                updatedAt: formatUpdatedDate(),
              } 
            : item
        ),
      },
    }
  }),

  // Update item setter
  updateItem: (id: string, item: Inventory) =>
    set((state) => {
      if (!state.inventory?.data) {
        return state;
      }

      const dataIndex = state.inventory.data.findIndex((el) => el.id === id);

      if (dataIndex >= 0) {
        const inventoryData = [...state.inventory.data];
        inventoryData[dataIndex] = item;
        const pageSize = state.inventory.pageSize || 1;

        return {
          inventory: {
            ...state.inventory,
            data: inventoryData,
            totalItems: inventoryData.length,
            totalPages: Math.ceil(inventoryData.length / pageSize),
          },
        };
      }

      return state;
    }),

  // Delete item setter
  deleteItem: (id) =>
    set((state) => {
      if (!state.inventory) return state;

      const updatedData = state.inventory.data.filter((i) => i.id !== id);

      return {
        inventory: {
          ...state.inventory,
          data: updatedData,
          totalItems: updatedData.length,
          totalPages: Math.ceil(updatedData.length / state.inventory.pageSize),
        },
      };
    }),
}));
