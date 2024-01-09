import {Outlet, Route, Routes, useNavigate,} from "react-router";
import React, {useEffect} from "react";
import MealWeek from "./MealWeek";
import {Link as RouterLink, NavLink} from "react-router-dom";
import {AppBar, Box, Button, Container, Grid, IconButton, Menu, MenuItem, Toolbar, Typography,} from "@mui/material";
import {useAuth} from "./security/hooks/UseAuth";
import {AuthProvider} from "./security/AuthProvider";
import {RequireAuth} from "./security/RequireAuth";
import {Login} from "./security/Login";
import {AccountCircle} from "@mui/icons-material";
import {Register} from "./security/Register";

const MainLayout = () => {
  const auth = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  }
  const logout = () => {
    auth.signout(closeMenu)
  };

  return (
    <div>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Måltidsplanlegger
            </Typography>
            <NavLink to="/meals">
              <Button color="secondary">
                Meals
              </Button>
            </NavLink>
            {auth.token && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle/>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                >
                  <MenuItem onClick={logout}>Log out</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet/>
    </div>
  );
};

export const Home = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route
            path="/meals"
            element={
              <RequireAuth>
                <MealWeek/>
              </RequireAuth>
            }
          />
          <Route path="/" element={<PublicPage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

function PublicPage() {
  const auth = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    if(auth.token !== undefined) {
      navigate("/meals")
    }
  }, [auth])

  return (
    <Container sx={{mt: "50px"}}>
      <Typography variant="h2">Velkommen til måltidsplanlegger</Typography>
      <Typography sx={{mt: "20px"}}>
        Måltidsplanleggeren er en tjeneste hvor du kan lage en ukesmeny for måltider.
        Måltidene du har hatt tidligere lagres slik at du enkelt kan se hva du har hatt tidligere.
        Dette er en innlogget tjeneste, så du må logge inn eller registrere deg før du kan ta i bruk dens funksjonalitet
      </Typography>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={6}>
          <Button sx={{width: "100%", height:"50px"}} variant="contained" component={RouterLink} to={"/login"}>Login</Button>
        </Grid>
        <Grid item xs={6}>
          <Button sx={{width: "100%", height: "50px"}} variant="contained" component={RouterLink} to={"/register"}>Registrer ny bruker</Button>
        </Grid>
      </Grid>
    </Container>

  )
}


function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.token) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.token}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}


