import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerUserWithEmailAndPassword,
} from "../../firebase/firebase";
import "./Register.css";

// Set initial state for Register Component
const INITIAL_STATE = {
  firstname: "",
  lastname: "",
  phone: "",
  email: "",
  password: "",
};

const Register = () => {
  // useform hook for handling register form state and callback function
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signUpState, setSignUpState] = useState(INITIAL_STATE);
  // Firebase hook to retrieve user data after successful registration
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  // UseForm hook's handleSubmit call back function for invoking firebase register user function
  // Callback function will trigger only after successful form validation
  const onSubmit = (signUpData) => {
    setSignUpState(signUpData);
    registerUserWithEmailAndPassword(signUpData);
  };

  //Set Register form validation rule
  const registerFormValidator = {
    firstname: { required: "First Name is required" },
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
    },
  };

  // Function to print form validation error
  const onError = (err) => {
    console.log("error", err);
  };

  // Function to watch out for user data from firebase hook
  useEffect(() => {
    if (loading) {
      return;
    } else if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  return (
    <div className="register">
      <form autoComplete="off">
        <div className="register-container">
          <h1>Register</h1>
          {/** First Name field */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              {...register("firstname", registerFormValidator.firstname)}
              className="register-textbox"
              placeholder="Enter First name"
              maxlength={75}
            />

            {errors && errors.firstname ? (
              <span className="text-danger"> {errors.firstname.message}</span>
            ) : (
              ""
            )}
          </div>

          {/** Last Name Field */}
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              {...register("lastname")}
              className="register-textbox"
              placeholder="Enter Last name"
              maxlength={75}
            />
          </div>

          {/** Phone Field */}
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              {...register("phone")}
              className="register-textbox"
              placeholder="Enter Phone number"
              maxlength={15}
            />
          </div>

          {/** Email Field */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              name="email"
              {...register("email", registerFormValidator.email)}
              className="register-textbox"
              placeholder="Enter Email address"
              maxlength={75}
            />

            {errors && errors.email ? (
              <span className="text-danger"> {errors.email.message}</span>
            ) : (
              ""
            )}
          </div>

          {/** Password field */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              {...register("password", registerFormValidator.password)}
              className="register-textbox"
              placeholder="Enter Password"
              maxlength={25}
            />
          </div>

          {errors && errors.password ? (
            <span className="text-danger password-error">
              {" "}
              {errors.password.message}
            </span>
          ) : (
            ""
          )}

          {/**Button Container */}
          <button
            className="register-btn"
            onClick={handleSubmit(onSubmit, onError)}
          >
            Register
          </button>

          <div className="login-link">
            Already have an account? <Link to="/">Login</Link> now.
          </div>
        </div>
      </form>
    </div>
  );
};
export default Register;
