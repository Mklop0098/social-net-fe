import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { UserHookReturn, UserType } from '../../type';

export const UserContext = createContext<UserHookReturn>({} as UserHookReturn);


export const useUser = (): UserHookReturn => {
    return useContext(UserContext);
};


export const UserContextProvider: React.FC<PropsWithChildren> = (props) => {

    const [currentUser, setCurrentUser] = useState<UserType>({} as UserType)

    const updateCurrentUser = (user: UserType) => {
        setCurrentUser(user)
    }

    return (
        <UserContext.Provider value={{ currentUser, updateCurrentUser }}>
            {props.children}
        </UserContext.Provider>
    );
};