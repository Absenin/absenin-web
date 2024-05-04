import { IUser } from "@/app/dashboard/account/actions";
import { Dispatch, SetStateAction, createContext } from "react";

export const UserContext = createContext<[IUser | null, state: Dispatch<SetStateAction<IUser | null>>]>([null, () => { }]);