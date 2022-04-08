import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  loginWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";

import "./Login.css";

// Set initial state for Login Component
const INITIAL_STATE = {
  email: "",
  password: "",
};

const Login = () => {
  // useform hook for handling login form state and callback function
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signInState, setSignInState] = useState(INITIAL_STATE);
  // Firebase hook to retrieve user data after successful login
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  // UseForm hook's handleSubmit call back function for invoking firebase login function
  // Callback function will trigger only after successful form validation
  const onSubmit = (signInData) => {
    setSignInState(signInData);
    loginWithEmailAndPassword(signInData);
  };

  //Set Login form validation rule
  const loginFormValidator = {
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
    },
  };

  // Function to print form validation error
  const onError = (err) => {
    console.log("error", err);
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="login">
      <div className="login-container">
        <h1>Login</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="text"
            name="email"
            className="login-textbox"
            {...register("email", loginFormValidator.email)}
            maxlength={75}
            placeholder="Enter email address"
          />
          {errors && errors.email ? (
            <span className="text-danger"> {errors.email.message}</span>
          ) : (
            ""
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="login-textbox"
            placeholder="Enter your password"
            {...register("password", loginFormValidator.password)}
            maxlength={25}
          />
          {errors && errors.password ? (
            <span className="text-danger password-error">
              {" "}
              {errors.password.message}
            </span>
          ) : (
            ""
          )}
        </div>
        <button className="login-btn" onClick={handleSubmit(onSubmit, onError)}>
          Login
        </button>
        <button className="login-btn login-google" onClick={signInWithGoogle}>
          Login with Google
        </button>

        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
};

export default Login;
