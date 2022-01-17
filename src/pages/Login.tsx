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
}

const initialFormValues: FormValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = (): React.ReactElement => {
  const dispatch = useDispatch();

  // Using rtk-query to reduce data-fetching boilerplate
  const [login, loginQueryStatus] = authService.useLoginMutation();

  // Using react-router useNavigate to handle redirects
  const navigate = useNavigate();

  const submit = (values: FormValues) => {
    registerGAEvent("Login form submit");
    logEvent(LogLevel.Info, "Login form submit");
    sendTelemetryEvent(TelemetryEventName.FormInteraction, "Login form submit");
    sendTelemetryEvent(TelemetryEventName.ApiStart, "Login");
    void login(values);
  };

  /*
   * On page load:
   * -> Register Google Analytics pageview
   * -> Create log event
   * -> Send telemetry event
   */
  useEffect(() => {
    registerGAPageview("Login");
    logEvent(LogLevel.Info, "Login page loaded");
    sendTelemetryEvent(TelemetryEventName.PageLoad, "Login page loaded");
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
    if (loginQueryStatus.isSuccess) {
      registerGAEvent("Login successful");
      logEvent(LogLevel.Success, "Login successful");
      sendTelemetryEvent(TelemetryEventName.ApiStop, "Login successful");
      dispatch(
        feedbackActions.add({
          severity: Severity.Success,
          message: "Logged in!",
        })
      );
      const { token } = loginQueryStatus.data;
      localStorage.setItem("token", token);
      navigate("/");
    } else if (loginQueryStatus.isError) {
      registerGAEvent("Login failed");
      logEvent(LogLevel.Success, "Login failed");
      sendTelemetryEvent(TelemetryEventName.ApiStop, "Login failed");
      dispatch(
        feedbackActions.add({
          severity: Severity.Error,
          message: "Login failed.",
        })
      );
    }
  }, [loginQueryStatus.isSuccess, loginQueryStatus.isError]);

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
        <Button type="submit" color="primary">
          Log in
        </Button>
      </form>
    </div>
  );
};

export default Login;
