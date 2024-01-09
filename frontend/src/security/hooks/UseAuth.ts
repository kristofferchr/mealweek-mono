import React from "react";
import {JWT} from "../JWTUtil";
import {DataAndErrorResponse} from "../../hooks/ApiClient";
import {LoginResponse, RegisterResponse} from "../../../gen/proto/auth/v1/auth";

export let AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
  return React.useContext(AuthContext);
}

export interface AuthContextType {
  token: JWT | undefined;
  signin: (
    user: string,
    password: string,
    onSuccess: VoidFunction,
    onError: (dataAndError: DataAndErrorResponse<LoginResponse>) => void,
    setLoading: (isLoading: boolean) => void
  ) => void;
  signout: (callback: VoidFunction) => void;

  register: (
    user: string,
    password: string,
    onSuccess: VoidFunction,
    onError: (dataAndError: DataAndErrorResponse<RegisterResponse>) => void,
    setLoading: (isLoading: boolean) => void
  ) => void;
}
