import {useLocation, useNavigate} from "react-router";
import {useAuth} from "./hooks/UseAuth";
import React, {useEffect, useState} from "react";
import {Alert, AlertTitle, Button, Container, Stack, TextField, Typography} from "@mui/material";
import {Link as RouterLink,} from 'react-router-dom';
import {isValidEmail} from "./utils";
import {DataAndErrorResponse} from "../hooks/ApiClient";
import {LoginResponse} from "../../gen/proto/auth/v1/auth";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [usernameHelperText, setUsernameHelperText] = useState("");

  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false)
  const from = location.state?.from?.pathname || "/";


  useEffect(() => {
    if (auth.token !== undefined) {
      navigate("/meals")
    }
  }, [auth])

  useEffect(() => {
    if (password === "") {
      setPasswordHelperText("Password is required");
    } else {
      setPasswordHelperText("");
    }
  }, [password]);

  useEffect(() => {
    if (username === undefined) {
      return
    }

    if (username === "") {
      setUsernameHelperText("Email is requird");
    } else if (!isValidEmail(username)) {
      setUsernameHelperText("Email is not on correct format")
    } else {
      setUsernameHelperText("");
    }
  }, [username]);

  function handleSubmit() {
    if (username !== undefined && password !== undefined) {

      auth.signin(username, password, () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, {replace: true});
      }, (dataAndError: DataAndErrorResponse<LoginResponse>) => {
        if (dataAndError?.message !== undefined) {
          switch (dataAndError.httpStatus) {
            case 401: {
              setLoginErrorMessage("Ugyldig Epost eller passord")
              break
            }
            case 400: {
              setLoginErrorMessage("Ugyldig input")
              break
            }
            default: {
              setLoginErrorMessage(dataAndError?.error ?? dataAndError?.message ?? "Uventet feil")
            }
          }
        }
      }, setIsLoading);
    }
  }

  return (
    <div>
      <Container>
        <Stack spacing={2}>
          <Typography sx={{mt: "20px"}} variant="h3">Logg inn</Typography>
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            value={username}
            error={usernameHelperText !== ""}
            helperText={usernameHelperText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.currentTarget.value);
            }}
            variant="standard"
          />
          <TextField
            required
            id="password"
            name="password"
            label="Password"
            type="password"
            error={passwordHelperText !== ""}
            helperText={passwordHelperText}
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.currentTarget.value);
            }}
            autoComplete="current-password"
            variant="standard"
          />
          <Button variant="contained" type="submit" disabled={passwordHelperText !== "" || usernameHelperText !== ""}
                  onClick={handleSubmit}>Login</Button>
        </Stack>
        <Stack mt={3}>
          <Button variant="text" component={RouterLink} to={"/register"}>Registrer ny bruker</Button>
        </Stack>
        {
          loginErrorMessage != "" && <Alert severity="error">
            <AlertTitle>Feil under innlogging</AlertTitle>
            {loginErrorMessage}
          </Alert>
        }
      </Container>
    </div>
  );
}
