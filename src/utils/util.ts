import AsyncStorage from '@react-native-async-storage/async-storage';
import { BillData } from '../types/types';

const ASYNC_STORAGE_KEY = 'ASYNC_STORAGE_KEY';
const ASYNC_STORAGE_KEY_GROUPS = 'ASYNC_STORAGE_KEY_GROUPS';

export const saveGroup = async (data: string) => {
  try {
    const asyncGroups = await AsyncStorage.getItem(ASYNC_STORAGE_KEY_GROUPS);
    if (asyncGroups !== null) {
      const groups: string[] = JSON.parse(asyncGroups);
      groups.push(data);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY_GROUPS, JSON.stringify(groups));
    } else {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY_GROUPS, JSON.stringify([data]));
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getGroups = async () => {
  try {
    const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEY_GROUPS);
    if (value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

export const deleteGroup = async (data: string) => {
  try {
    const asyncGroups = await AsyncStorage.getItem(ASYNC_STORAGE_KEY_GROUPS);
    const asyncBills = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (asyncGroups !== null && asyncBills !== null) {
      const groups: string[] = JSON.parse(asyncGroups);
      const bills: {[group: string]: BillData[]} = JSON.parse(asyncBills);

      const newGroups = groups.filter((group) => group !== data);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY_GROUPS, JSON.stringify(newGroups));

      delete bills[data];
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(bills));
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveBill = async (group: string, data: BillData) => {
  console.log(data);
  try {
    const asyncBills = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (asyncBills !== null) {
      let bills: {[group: string]: BillData[]} = JSON.parse(asyncBills);

      if (!bills[group]) {
        bills[group] = [];
      }

      let isExist = false;
      bills[group] = bills[group].map((bill) => {
        if (bill.id === data.id) {
          isExist = true;
          bill = data;
        }
        return bill;
      });

      if (!isExist) {
        bills[group].push(data);
      }

      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(bills));
    } else {
      const grp = {
        [group]: [data],
      };

      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(grp));
    }

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const deleteBill = async (group: string, id: string) => {
  try {
    const asyncBills = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (asyncBills !== null) {
      const bills: {[group: string]: BillData[]} = JSON.parse(asyncBills);
      bills[group] = bills[group].filter((bill) => bill.id !== id);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(bills));
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getBills = async () => {

  try {
    const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    console.log(value);
    
    if (value !== null) {
      return JSON.parse(value) as {[group: string]: BillData[]};
    }
    return {} as {[group: string]: BillData[]};
  } catch (error) {
    console.log(error);
  }
};

export const getBill = async (group: string, id?: string | undefined) => {
  if (!id) {
    return null;
  }

  try {
    const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (value !== null) {
      const bills: {[group: string]: BillData[]} = JSON.parse(value);
      return bills[group].find((bill) => bill.id === id);
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const getTags = async (group: string) => {
  try {
    const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (value !== null) {
      const bills: {[group: string]: BillData[]} = JSON.parse(value);
      return bills[group]?.map((bill) => bill.tag) || [];
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};
