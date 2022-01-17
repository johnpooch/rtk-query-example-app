import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { LogLevel, Severity, TelemetryEventName } from "../store/types";
import { authService } from "../store/service";
import { actions as feedbackActions } from "../store/feedback";
import {
  logEvent,
  registerGAEvent,
  registerGAPageview,
  sendTelemetryEvent,
} from "../utils";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

interface FormValues {
  email: string;
  password: string;
  passwordConfirmation: string;
}

const initialFormValues: FormValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  passwordConfirmation: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = (): React.ReactElement => {
  const dispatch = useDispatch();

  // Using rtk-query to reduce data-fetching boilerplate
  const [register, registerQueryStatus] = authService.useRegisterMutation();

  // Using react-router useNavigate to handle redirects
  const navigate = useNavigate();

  const submit = (values: FormValues) => {
    registerGAEvent("Register form submit");
    logEvent(LogLevel.Info, "Register form submit");
    sendTelemetryEvent(
      TelemetryEventName.FormInteraction,
      "Register form submit"
    );
    sendTelemetryEvent(TelemetryEventName.ApiStart, "Register");
    void register(values);
  };

  /*
   * On page load:
   * -> Register Google Analytics pageview
   * -> Create log event
   * -> Send telemetry event
   */
  useEffect(() => {
    registerGAPageview("Register");
    logEvent(LogLevel.Info, "Register page loaded");
    sendTelemetryEvent(TelemetryEventName.PageLoad, "Register page loaded");
  }, []);

  /*
   * Handle success and error scenarios
   *
   * On success:
   * -> Register Google Analytics event
   * -> Create log event
   * -> Send telemetry event
   * -> Add feedback
   * -> Set token in local storage
   *
   * On error:
   * -> Register Google Analytics event
   * -> Create log event
   * -> Send telemetry event
   * -> Add feedback
   */
  useEffect(() => {
    if (registerQueryStatus.isSuccess) {
      registerGAEvent("Register successful");
      logEvent(LogLevel.Success, "Register successful");
      sendTelemetryEvent(TelemetryEventName.ApiStop, "Register successful");
      dispatch(
        feedbackActions.add({
          severity: Severity.Success,
          message: "Registered!",
        })
      );
      const { token } = registerQueryStatus.data;
      localStorage.setItem("token", token);
      navigate("/");
    } else if (registerQueryStatus.isError) {
      registerGAEvent("Register failed");
      logEvent(LogLevel.Success, "Register failed");
      sendTelemetryEvent(TelemetryEventName.ApiStop, "Register failed");
      dispatch(
        feedbackActions.add({
          severity: Severity.Error,
          message: "Register failed.",
        })
      );
    }
  }, [registerQueryStatus.isSuccess, registerQueryStatus.isError]);

  // Formik config to reduce form boilerplate
  const { errors, values, handleChange, handleSubmit } = useFormik({
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: submit,
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          error={Boolean(errors.email)}
          helperText={errors.email}
          onChange={handleChange}
          fullWidth
          value={values.email}
        />
        <TextField
          label="Password"
          name="password"
          error={Boolean(errors.password)}
          helperText={errors.password}
          onChange={handleChange}
          type="password"
          fullWidth
          value={values.password}
        />
        <TextField
          label="Password Confirmation"
          name="passwordConfirmation"
          error={Boolean(errors.passwordConfirmation)}
          helperText={errors.passwordConfirmation}
          onChange={handleChange}
          type="password"
          fullWidth
          value={values.passwordConfirmation}
        />
        <Button type="submit" color="primary">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
