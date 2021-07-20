import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import "./App.css";
import Navbar from "./components/layoutsComponent/Navbar";
import Login from "./components/Login";
import PopupAccount from "./components/PopupAccount";
import HomePage from "./components/HomePage";
import ResourcePage from "./components/ResourcePage";
import Syllabus from "./components/Syllabus";
<<<<<<< HEAD
import Signup from "./components/Signup";
import { useGoogleOneTapLogin } from "react-google-one-tap-login";
import { LinkedInPopUp } from "react-linkedin-login-oauth2";
import axios from "axios";
=======
import Notes from "./components/Notes";
import QuestionPapers from "./components/QuestionPapers";
>>>>>>> 0e357f347b97e85280ca4d799cc0ed24f9719b75

// Custom theme of Informatsy
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6D78FE",
      dark: "#1876d2",
    },
    // primary:purple,
    secondary: {
      main: "#ff7e79",
    },
    divider:"rgba(0,0,0,0.3)",
  },
  typography: {
    fontFamily: "Montserrat",
    fontWeightLight: 400,
    fontWeightRegular: 600,
    fontWeightMedium: 700,
    fontWeightBold: 800,
    button: {
      textTransform: "capitalize",
      textDecoration: "none",
    },
  },
});

function App() {
  //------------handle for google sign in-------------
  const handleGoogleSignIn = (response) => {
    console.log(response);
    // axios
    // .post("http://127.0.0.1:8000/api/googleOAuth/", data)
    // .then((res) => {
    //   this.setState({
    //     alert: true,
    //     alertContent: res.statusText,
    //     alertMsg: "success",
    //   });
    //   console.log(res);
    // })
  };
  //-------------for google login automatic one tap--------------
  useGoogleOneTapLogin({
    onError: (error) => console.log(error),
    onSuccess: (response) => handleGoogleSignIn(response),

    googleAccountConfigs: {
      client_id:
        "688835578616-ck9sorb0vsutu23g1ghc6mmu6g6d8cdd.apps.googleusercontent.com",
      ux_mode: "popup",
      context: "use",
      state_cookie_domain: "http://localhost",
      native_callback: (response) => {
        console.log(response);
      },
    },
  });
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/linkedin" component={LinkedInPopUp} />
            <Navbar>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/resources" component={ResourcePage}/>
                <Route exact path="/resources/syllabus" component={Syllabus} />
                <Route exact path="/resources/notes" component={Notes} />
                <Route exact path="/resources/questionPapers" component={QuestionPapers} />
                <Redirect to='/'> </Redirect>
              </Switch>
            </Navbar>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}
export default App;
