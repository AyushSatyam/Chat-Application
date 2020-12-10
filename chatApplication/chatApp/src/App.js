// import logo from "./logo.svg";
// import './App.css';
// import { connect } from "formik";
import * as AuthActions from "./component/store/actions/authActions";
import { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import Auth from "./component/pages/Auth";
import * as ChatActions from "./component/store/actions/chatActions";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/swag.css";
import Messenger from "./component/pages/Messenger";
class App extends Component {
  componentDidMount() {
    this.props.setupSocket(this.props.token, this.props.user.id);
  }
  // componentDidUpdate() {}
  render() {
    return (
      <div className="App">
        <button
          onClick={(e) => {
            e.preventDefault();
            this.props.logout();
          }}
        >
          Log Out
        </button>
        <BrowserRouter>
          <Switch>
            <Route
              path="/login"
              render={(props) => {
                if (this.props.token) {
                  return <Redirect to="/" />;
                } else {
                  return <Auth />;
                }
              }}
            />
            <Route
              path="/signup"
              render={(props) => {
                if (this.props.token) {
                  return <Redirect to="/" />;
                } else {
                  return <Auth />;
                }
              }}
            />
            <Route
              path="/:threadId"
              render={(props) => {
                if (!this.props.token) {
                  return <Redirect to="/login" />;
                } else {
                  return <Messenger />;
                }
              }}
            />
            <Route
              path="/"
              render={(props) => {
                if (!this.props.token) {
                  return <Redirect to="/login" />;
                } else {
                  return <Messenger />;
                }
              }}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.chat,
});

const mapDispatchToProps = (dispatch) => ({
  setupSocket: (token, userId) => {
    dispatch(ChatActions.setupSocket(token, userId));
  },
  logout: () => {
    dispatch(AuthActions.logout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
