import { useCallback, useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] => {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (parseJSON(item) as T) : initialValue;
    } catch (e) {
      console.warn(`로컬 스토리지 값을 가져오는 중 에러발생 key : '${key}'`, e);
      return initialValue;
    }
  }, [initialValue, key]);

  const [localStorageValue, setLocalStorageValue] = useState<T>(readValue);

  const setValue: SetValue<T> = (value) => {
    if (typeof window === 'undefined') {
      console.warn('클라이언트 환경이 아닌데 로컬스토리지값 변경 시도됨');
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setLocalStorageValue(value);
    } catch (e) {
      console.warn(
        `로컬스토리지 값 변경 중 에러발생 key : ${key}, value : ${value}`,
        e
      );
    }
  };

  return [localStorageValue, setValue];
};

const parseJSON = <T>(value: string | null): T | undefined => {
  try {
    return value === undefined ? undefined : JSON.parse(value ?? '');
  } catch (e) {
    console.log(`Error parsing value : ${value}`);
    return undefined;
  }
};
