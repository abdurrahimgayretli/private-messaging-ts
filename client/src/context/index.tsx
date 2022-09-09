import React, { createContext, useContext, useState } from "react";
import { IMyProps, IMyPropsType } from "../@types/user";

const UserContext = createContext<IMyPropsType | null>(null);

export const UserContextProvider = ({ children }: any) => {
  const [users, setUsers] = useState<IMyProps["user"][]>([]);
  const [selectedUser, setSelectedUser] = useState<IMyProps["user"]>();

  const values = {
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
