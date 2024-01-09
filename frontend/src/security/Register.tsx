import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./hooks/UseAuth";
import React, { useEffect, useState } from "react";
import {
  Alert, AlertTitle,
  Button, CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {isValidEmail} from "./utils";

export function Register() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [confirmationPassword, setConfirmationPassword] = useState<string | undefined>(undefined);

  const [confirmationPasswordHelperText, setConfirmationPasswordHelperText] =
    useState<string >("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [usernameHelperText, setUsernameHelperText] = useState("");

  const [registerErrorMessage, setRegisterErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false)

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if(auth.token !== undefined) {
      navigate("/meals")
    }
  }, [auth])

  function handleSubmit() {
    if (username !== undefined && password !== undefined) {
      auth.register(
        username,
        password,
        () => {

          // Send them back to the page they tried to visit when they were
          // redirected to the login page. Use { replace: true } so we don't create
          // another entry in the history stack for the login page.  This means that
          // when they get to the protected page and click the back button, they
          // won't end up back on the login page, which is also really nice for the
          // user experience.
          navigate(from, { replace: true });
        },
        (dataAndError) => {
          if (dataAndError?.message !== undefined) {
            switch (dataAndError.httpStatus) {
              case 409: {
                setRegisterErrorMessage("Epost er allerede knyttet til en bruker")
                break
              }
              case 400: {
                setRegisterErrorMessage("Feil input. Enten ugyldig epost eller passord som ikke oppfyller kravene.")
                break
              }
            }
          }
        },
        (isLoading: boolean) => {
          setIsLoading(isLoading)
        }
      );
    }
  }

  useEffect(() => {
    if (password === "") {
      setPasswordHelperText("Password is required");
    } else {
      setPasswordHelperText("");
    }
  }, [password]);

  useEffect(() => {
    if (confirmationPassword === "" || (password !== undefined && confirmationPassword === undefined))  {
      setConfirmationPasswordHelperText("Confirmation password is required");
    } else if (confirmationPassword !== password) {
      setConfirmationPasswordHelperText(
        "Confirmation password is not equal to password"
      );
    } else {
      setConfirmationPasswordHelperText("");
    }
  }, [password,confirmationPassword]);

  useEffect(() => {
    if(username === undefined) {
      return
    }

    if (username === "") {
      setUsernameHelperText("Email is requird");
    } else if(!isValidEmail(username)) {
      setUsernameHelperText("Email is not on correct format")
    } else{
      setUsernameHelperText("");
    }
  }, [username]);


  return (
    <div>
      <Container>
        <Stack spacing={2}>
          <Typography
            style={{
              marginTop: "60px",
            }}
            variant={"h4"}
          >
            Register user
          </Typography>
          <TextField
            required
            id="email"
            value={username}
            error={usernameHelperText !== ""}
            helperText={usernameHelperText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.currentTarget.value);
            }}
            name="email"
            label="Email"
            variant="standard"
          />
          <TextField
            required
            id="password"
            error={passwordHelperText !== ""}
            helperText={passwordHelperText}
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.currentTarget.value);
            }}
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
          />
          <TextField
            required
            id="confirmationPassword"
            error={confirmationPasswordHelperText !== ""}
            helperText={confirmationPasswordHelperText}
            value={confirmationPassword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmationPassword(event.currentTarget.value);
            }}
            label="Repeat password"
            type="password"
            autoComplete="current-password"
            variant="standard"
          />
          <Button
            disabled={
              passwordHelperText !== "" || confirmationPasswordHelperText !== "" || usernameHelperText !== ""
            }
            onClick={handleSubmit}
            type="submit"
          >
            Register user {isLoading && <CircularProgress/>}
          </Button>
          {
          registerErrorMessage != "" &&  <Alert severity="error">
            <AlertTitle>Feil under registrering</AlertTitle>
            {registerErrorMessage}
          </Alert>
          }
        </Stack>
      </Container>
    </div>
  );
}
