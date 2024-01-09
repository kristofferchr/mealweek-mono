import React from "react";
import {AuthContext} from "./hooks/UseAuth";
import {useClient} from "../hooks/useClient";
import {DataAndErrorResponse} from "../hooks/ApiClient";
import {ParseJwt} from "./JWTUtil";
import {useCookies} from "react-cookie";
import {LoginResponse, RegisterResponse} from "../../gen/proto/auth/v1/auth";

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const [login, ,] = useClient("grpcLogin");
  const [performRegister, ,] = useClient("grpcRegister");

  const signin = async (newUser: string,
                        password: string,
                        onSuccess: VoidFunction,
                        onError: (dataAndError: DataAndErrorResponse<LoginResponse>) => void,
                        setLoading: (isLoading: boolean) => void) => {
    setLoading(true);
    await login(newUser, password).then((response: DataAndErrorResponse<LoginResponse>) => {
      if (response.data !== undefined) {
        const token = response?.data?.token;
        if (token) {
          const jwt = ParseJwt(token);

          setCookie("token", jwt);
          onSuccess()
        }
      } else {
        onError(response);
      }
    });
    setLoading(false)
  };

  let signout = (callback: VoidFunction) => {
    removeCookie("token")
    callback();
  };

  const register = async (
    username: string,
    password: string,
    onSuccess: VoidFunction,
    onError: (dataAndError: DataAndErrorResponse<RegisterResponse>) => void,
    setLoading: (isLoading: boolean) => void
  ) => {
    setLoading(true);

    await performRegister(username, password).then(
      (response: DataAndErrorResponse<RegisterResponse>) => {
        if (response.data !== undefined) {
          const token = response?.data?.token;
          if (token) {
            const jwt = ParseJwt(token);

            setCookie("token", jwt)
            onSuccess();
          }
        } else {
          onError(response);
        }
      }
    );
    setLoading(false);
  };
  const token = cookies.token
  let value = {token, signin, signout, register};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
