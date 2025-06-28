import { createContext } from 'react';

export const AppContext = createContext({
  userInfo:null,
  setUserInfo: (userInfo) => {return userInfo},
});