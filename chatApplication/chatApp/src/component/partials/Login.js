import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="form-wrapper">
              <h1>Partials Login</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (this.props.socket) {
                    this.props.socket.send(
                      JSON.stringify({
                        type: "LOGIN",
                        data: {
                          email: this.state.email,
                          password: this.state.password,
                        },
                      })
                    );
                  }
                }}
              >
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Please enter your email..."
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Please enter your password..."
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Login
                </button>
                <p>
                  Don't have an account?<Link to="/signup"> Signup </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.chat,
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
