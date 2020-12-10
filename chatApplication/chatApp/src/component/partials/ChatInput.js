import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    };
  }
  render() {
    return (
      <div className="input-view">
        <input
          type="text"
          placeholder="Write your message"
          className="form-control"
          value={this.state.content}
          onChange={(e) => this.setState({ content: e.target.value })}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.chat,
});

const mapDispatchToProps = (dsipatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChatInput));
