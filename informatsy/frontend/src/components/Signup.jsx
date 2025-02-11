import React, { Component } from "react";
import logo from "../Assets/logo.png";
import TextField from "@material-ui/core/TextField";
import { Link, withRouter } from "react-router-dom";
import MobileView from "../components/mobile";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import Visibility from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Mvbg from "../Assets/mv-lg-bg.jpg";
import Checkbox from "@material-ui/core/Checkbox";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import IconButton from "@material-ui/core/IconButton";
import fb_icon from "../Assets/fb-img.png";
import g_icon from "../Assets/google-img.png";
import li_icon from "../Assets/linkedin_logo.webp";
import Input from "../components/Input";
import Loader from "../components/Loaders";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import "../css/Login.css";
import { useLocation } from "react-router-dom";
// import { Snackbar } from "@material-ui/core";
// import MuiAlert from "@material-ui/lab/Alert";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";
import { Typography } from "@material-ui/core";
import Alert from "../components/AlertBar";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { LinkedIn } from "react-linkedin-login-oauth2";
import EmailIcon from "@material-ui/icons/Email";
import axios from "axios";
import Cookies from "js-cookie";
import { authAxios } from "../Authaxios";

class FormMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      userName: "",
      isUserName: false,
      showConfirmPass: false,
      Email: "",
      isEmailTrue: false,
      password: "",
      isPassword: false,
      confirmPassword: "",
      ispassConfirm: false,
      loading: false,
      ischeck: false,
      alert: false,
      alertContent: "",
      alertMsg: "",
      isSubmit: 1,
      accesstoken: "",
      buttonData: false,
    };
  }
  //---------------to check whether all fields are filled-------------

  // ----to get loading functionality by passing some values through this--------
  getLoadFunction(selector, property) {
    document.getElementsByClassName(selector)[0].style.visibility = property;
  }
  // -------------------input loaders settings--------------------------
  clearAlert = () => {
    this.setState({ alert: false, alertContent: "", alertMsg: "" });
  };
  //------------setting username -----------------
  setInputUsername = (childData) => {
    if (childData.length > 3 && childData.length < 25) {
      this.setState({ userName: childData, isUserName: true });
    } else {
      this.setState({ isUserName: false });
    }
  };
  setInputStateEmail = (childData) => {
    this.getLoadFunction("mv_sign_up_loader1", "visible");
    var reg =
      /^[A-Z,a-z,0-9,?./""-]+@(gmail|outlook|yahoo|icloud|gov|nic)+[.]+(com|org|net|gov|mil|biz|info|mobi|in|name|aero|jobs|museum|co)+$/;
    if (reg.test(childData)) {
      this.setState({ Email: childData, isEmailTrue: true });
    } else {
      this.setState({ isEmailTrue: false });
    }
  };
  setInputStatePassword = (childData) => {
    this.getLoadFunction("mv_sign_up_loader2", "visible");
    // regex for password
    // var passRegex =
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/i;

    if (
      childData.match(/[a-z]/g) &&
      childData.match(/[A-Z]/g) &&
      childData.match(/[0-9]/g) &&
      childData.match(/[^a-zA-Z\d]/g) &&
      !childData.match(/\s/g) &&
      childData.length >= 6
    ) {
      this.setState({ isPassword: true, password: childData });
      this.setInputStateConfirmPass(childData);
      console.log("true");
    } else {
      this.setState({ isPassword: false });
      console.log("false");
    }
  };
  setInputStateConfirmPass = (confirmData) => {
    this.getLoadFunction("mv_sign_up_loader3", "visible");
    this.setState({ confirmPassword: confirmData });
    console.log();
    //----------- regex for password---------------
    if (this.state.password === confirmData) {
      this.setState({ ispassConfirm: true });
      this.setState({ confirmPassword: confirmData });
    } else {
      this.setState({ ispassConfirm: false });
    }
  };
  //--------------this will perform data post to server-----------
  handleSubmitSignup() {
    if (
      this.state.isEmailTrue &&
      this.state.isPassword &&
      this.state.ispassConfirm
    ) {
      const data = {
        username: this.state.userName,
        email: this.state.Email,
        password: this.state.password,
        confirm_password: this.state.confirmPassword,
      };

      this.setState({
        alert: false,
        alertContent: "",
        alertMsg: "error",
        buttonData: true,
      });
      axios
        .post(`${process.env.React_App_SERVER_API}/api/signup/`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          this.setState({
            alert: true,
            alertContent: "Activation link shared to your mail",
            alertMsg: "success",
            buttonData: false,
          });
          this.setState({ buttonData: false });
          console.log(res);
          setTimeout(() => {
            window.location.pathname = "/";
          }, 2000);
        })
        .catch((error) => {
          console.log(error.response.data);
          this.setState({ buttonData: false });
          this.setState({
            alert: true,
            alertContent: error.response.data,
            alertMsg: "error",
            isSubmit: this.state.isSubmit + 1,
            isEmailTrue: false,
            isPassword: false,
            buttonData: false,
          });
        });
    }
  }
  OathAccessToken(authProvider, accesstoken) {
    console.log(accesstoken.accessToken);
    this.setState({
      alert: false,
      alertContent: "",
      loading: true,
    });

    axios
      .post(`${process.env.React_App_SERVER_API}/api/OauthAll/`, {
        accesstoken: accesstoken,
        authProvider: authProvider,
      })
      .then((res) => {
        console.log(res.data.token.access);

        Cookies.set("access_token", res.data.token.access, {
          expires: 1 / 48,
        });
        Cookies.set("refresh_token", res.data.token.refresh, {
          expires: 30,
        });
        this.setState({
          alert: true,
          alertContent: "Hurray! Account created redirecting...!",
          alertMsg: "success",
          loading: false,
        });
        setTimeout(() => {
          window.location.href = `${process.env.React_App_FRONTEND}`;
        }, 1000);
      })
      .catch((err) => {
        console.log(err.response.data);
        this.setState({
          alert: true,
          alertContent: err.response.data,
          alertMsg: "error",
          loading: false,
        });
      });
  }

  render() {
    console.log(this.state.ischeck);
    const img_size = 30;
    const style = { color: "grey", lineHeight: "55px" };
    const extendedStyles = {
      color: "grey",
      position: "absolute",
      left: "75%",
    };
    const mobileViewStyle = {
      color: "grey",
      position: "absolute",
      left: "70%",
    };

    return (
      <>
        <Backdrop
          open={this.state.loading}
          style={{ zIndex: "999", color: "#fff" }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* two showing alert  we also specify height where we can be placed that alert*/}
        <Alert
          content={{
            alert: this.state.alert,
            msgStatus: this.state.alertMsg,
            msgContent: this.state.alertContent,
          }}
        />
        <div className="form_main" key={this.state.isSubmit}>
          <div
            className="forms_content1"
            onBlur={this.clearAlert}
            onClick={() => {
              this.setState({
                alert: true,
                alertContent:
                  "This means your unique name on Informatsy. Be careful you won't be able to change after registration.",
                alertMsg: "warning",
              });
            }}
          >
            <Input
              name="Username"
              classname="userHandle"
              type="text"
              component={<PersonRoundedIcon style={style} />}
              returnValue={this.setInputUsername}
              // ref={(instance) => (this.child = instance)}
            />
          </div>
          <div className="forms_content1">
            <Input
              name="Email"
              classname="one"
              type="text"
              component={<EmailIcon style={style} />}
              returnValue={this.setInputStateEmail}
              // ref={(instance) => (this.child = instance)}
            />
            <div className="mv_indicator">
              <div className="mv_loader mv_sign_up_loader1">
                {this.state.isEmailTrue ? (
                  <DoneAllIcon className="mv_crct_icn" fontSize="small" />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
          <div
            className="forms_content1"
            onClick={() => {
              this.setState({
                alert: true,
                alertContent:
                  "password should min six length and one Uppercase,lowercase,special character and number",
                alertMsg: "info",
              });
            }}
            onBlur={this.clearAlert}
          >
            <Input
              name="Password"
              classname="two"
              type={this.state.showPassword ? "text" : "password"}
              component={<LockOpenRoundedIcon style={style} />}
              returnValue={this.setInputStatePassword}
              // ref={(instance) => (this.child = instance)}
            />
            <IconButton
              aria-label="lock"
              style={extendedStyles}
              onClick={() => {
                this.setState({
                  showPassword: !this.state.showPassword,
                });
              }}
            >
              {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            <div className="mv_indicator">
              <div className="mv_loader mv_sign_up_loader2">
                {this.state.isPassword ? (
                  <DoneAllIcon className="mv_crct_icn" fontSize="small" />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
          <div className="forms_content1">
            <Input
              name="Confirm password"
              classname="three"
              type={this.state.showConfirmPass ? "text" : "password"}
              component={<LockOpenRoundedIcon style={style} />}
              returnValue={this.setInputStateConfirmPass}
              // ref={(instance) => (this.child = instance)}
            />
            <IconButton
              aria-label="lock"
              style={extendedStyles}
              onClick={() => {
                this.setState({
                  showConfirmPass: !this.state.showConfirmPass,
                });
              }}
            >
              {this.state.showConfirmPass ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            <div className="mv_indicator">
              <div className="mv_loader mv_sign_up_loader3">
                {this.state.ispassConfirm ? (
                  <DoneAllIcon className="mv_crct_icn" fontSize="small" />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="termsandcondition">
          <Checkbox
            icon={<CircleUnchecked />}
            checkedIcon={<CircleCheckedFilled />}
            size="small"
            checked={this.state.ischeck}
            onClick={() => {
              this.setState({ ischeck: !this.state.ischeck });
            }}
          />
          <div className="login-main-via">
            <span>I agree with &nbsp;</span>
            <Typography
              className="terms_condition_link"
              variant="inherit"
              component={Link}
              to="/forgot"
            >
              Privacy policy
            </Typography>
          </div>
        </div>

        <div className="button_main">
          <Button
            className="login_btn"
            variant="contained"
            color="primary"
            disableElevation
            onClick={this.handleSubmitSignup.bind(this)}
            disabled={
              !(
                this.state.isEmailTrue &&
                this.state.isPassword &&
                this.state.ispassConfirm &&
                this.state.ischeck &&
                this.state.isUserName &&
                !this.state.buttonData
              )
            }
          >
            {this.state.buttonData ? (
              <CircularProgress size="1.5rem" />
            ) : (
              "Create my account"
            )}
          </Button>
        </div>

        <div className="login_bottom_main">
          <p>or via social media</p>
          <div className="social_acc">
            <IconButton aria-label="facebook" className="btn_sa">
              <FacebookLogin
                appId="527430968405690"
                fields="name,email,picture"
                onClick={(res) => console.log("facebook login")}
                callback={(res) => {
                  try {
                    this.OathAccessToken("facebook", res.accessToken);
                  } catch (e) {
                    console.log("something went wrong");
                  }
                }}
                redirectUri="https://informatsy.in/signup"
                render={(renderProps) => (
                  <img
                    src={fb_icon}
                    alt="facebook"
                    width={img_size}
                    height={img_size}
                    onClick={renderProps.onClick}
                  />
                )}
              />
            </IconButton>
            <IconButton className="btn_sa" aria-label="google">
              {/* <GoogleLogin
                clientId="688835578616-ck9sorb0vsutu23g1ghc6mmu6g6d8cdd.apps.googleusercontent.com"
                buttonText="LOGIN WITH GOOGLE"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
              /> */}
              <GoogleLogin
                clientId="688835578616-ck9sorb0vsutu23g1ghc6mmu6g6d8cdd.apps.googleusercontent.com"
                render={(renderProps) => (
                  <img
                    src={g_icon}
                    alt="google"
                    width={img_size}
                    height={img_size}
                    onClick={renderProps.onClick}
                  />
                )}
                onSuccess={(response) =>
                  this.OathAccessToken("google", response.tokenObj.access_token)
                }
                onFailure={(response) => {
                  console.log(response);
                }}
                cookiePolicy={"single_host_origin"}
              />
            </IconButton>
            <IconButton aria-label="linkedIn" className="btn_sa">
              <LinkedIn
                clientId="86xee9zpkumiiy"
                onFailure={(res) => console.log(res)}
                onSuccess={(res) => {
                  console.log(res.code);
                  this.OathAccessToken("linkedIn", res.code);
                }}
                redirectUri="https://informatsy.in/linkedin"
                scope="r_liteprofile r_emailaddress"
                renderElement={({ onClick, disabled }) => (
                  <img
                    src={li_icon}
                    alt="linkedIn"
                    width={img_size + 3}
                    height={img_size + 3}
                    onClick={onClick}
                    disabled={disabled}
                  />
                )}
              />
            </IconButton>
          </div>
          <div className="login_to_signup">
            <span>Already have account ? </span>
            <Typography variant="inherit" component={Link} to="/login">
              Sign in
            </Typography>
          </div>
        </div>
      </>
    );
  }
}
export class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
    };
  }
  //----------------to update rezing the window--------------
  updateWindowSize = () => {
    this.setState({ width: window.innerWidth });
  };
  //------------browser loads all component------------------
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowSize);
  }
  //----------to remove eventlistener-----------------------
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowSize);
  }

  render() {
    const img_size = 30;
    return (
      <>
        <div className="login_main">
          <div className="login_parent">
            <div className="login_side_bar">
              <div className="login_side_p1"></div>

              <div className="login_side_p2"></div>
              <div className="login_side_p3"></div>
              <div className="login_side_p4"></div>
            </div>
            <div className="login_child">
              <div className="top_tag">
                <h2>Hola!</h2>
                <p>Create a new account</p>
                {this.state.width >= 610 ? <FormMain /> : ""}
              </div>
            </div>
          </div>
        </div>
        <div className="mv_login_main">
          <div className="mv_login_parent">
            <div className="mc_login_img-parent">
              <div className="img_overlay-login"></div>
              <img
                id="img_bg_login"
                src={Mvbg}
                alt="bg"
                width="95%"
                height="100%"
                className="login_img-bg"
              />
              <div className="svg-helper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="850 60 1440 320"
                  width="1100.38"
                  height="160.57996"
                  className="svg-img"
                >
                  <path
                    fill="#ffff"
                    fill-opacity="1"
                    d="M0,224L40,202.7C80,181,160,139,240,149.3C320,160,400,224,480,240C560,256,640,224,720,181.3C800,139,880,85,960,69.3C1040,53,1120,75,1200,122.7C1280,171,1360,245,1400,282.7L1440,320L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mv-login-logo">
              <div className="mv-login-img-main">
                <img
                  src={logo}
                  className="mv-login-logo-img"
                  width={img_size - 3}
                  height={img_size - 3}
                  alt="logo"
                />
              </div>
              <p className="mv-login-logo-head">Informatsy</p>
            </div>
            <div className="mv-login-form-main">
              <div className="mv-login-form-parent">
                <h2 className="mv-login-heading">Create Account</h2>
                {this.state.width < 610 ? <FormMain /> : ""}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Signup);
