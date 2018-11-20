import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../config.firebase";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false
  };

  handlerChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormFalid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserAndRetrieveDataWithEmailAndPassword(
          this.state.email,
          this.state.password
        )
        .then(createdUser => {
          console.log(createdUser);
          this.setState({ loading: false });
        })
        .catch(err => {
          console.log(err);
          let error = { pesan: err.message };
          this.setState({
            errors: this.state.errors.concat(error),
            loading: false
          });
        });
    }
  };

  isFormFalid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { pesan: "Mohon isi form dengan benar" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { pesan: "Password tidak benar" };
      this.setState({ errors: errors.concat(error) });
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.pesan}</p>);

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.pesan.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register Ke Chat App
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handlerChange}
                value={username}
                className={this.handleInputError(errors, "username")}
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handlerChange}
                value={email}
                className={this.handleInputError(errors, "email")}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handlerChange}
                value={password}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handlerChange}
                value={passwordConfirmation}
                className={this.handleInputError(
                  errors,
                  "passwordConfirmation"
                )}
                type="password"
              />

              <Button
                disabled={loading}
                color="orange"
                fluid
                size="large"
                className={loading ? "loading" : ""}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Sudah Menjadi User ? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
