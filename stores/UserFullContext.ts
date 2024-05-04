import { IUser } from "@/app/dashboard/account/actions";
import { Dispatch, SetStateAction, createContext } from "react";

export const FullUserContext = createContext<[IUser | null, state: Dispatch<SetStateAction<IUser | null>>]>([null, () => { }]);