
import { writable } from 'svelte/store';

export const userData = writable(
  JSON.parse(localStorage.getItem("userInfo"))
);

const createCount = () => {
  const { subscribe, set, update } = writable(0)
  
  return {
      subscribe,
      sumar: () => {
          update(n => n + 1)
      },
      restar: () => {
          update(n => n - 1)
      },
      reiniciar: () => {
          set(0)
      }
  }
  
};

export const contador = createCount();

export const ifSelectedChat = writable(null);

export const notification = writable([]);