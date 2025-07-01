import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Buscar do localStorage
      const item = window.localStorage.getItem(key);
      // Parse do JSON armazenado ou retorna valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro, retorna valor inicial
      console.log(error);
      return initialValue;
    }
  });

  // Função para definir valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que value seja uma função para que tenhamos a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salva no estado
      setStoredValue(valueToStore);
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Um erro mais avançado de tratamento seria implementar aqui
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}