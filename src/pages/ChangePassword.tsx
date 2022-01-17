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
import { useSelectEmail } from "../hooks/selectors";

interface FormValues {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const initialFormValues: FormValues = {
  oldPassword: "",
  password: "",
  passwordConfirmation: "",
};

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  passwordConfirmation: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = (): React.ReactElement => {
  const dispatch = useDispatch();

  // Using rtk-query to reduce data-fetching boilerplate
  const [changePassword, changePasswordQueryStatus] =
    authService.useChangePasswordMutation();

  // Get email from store for form submission
  const email = useSelectEmail() as string;

  // Using react-router useNavigate to handle redirects
  const navigate = useNavigate();

  const submit = (values: FormValues) => {
    registerGAEvent("Change password form submit");
    logEvent(LogLevel.Info, "Change password form submit");
    sendTelemetryEvent(
      TelemetryEventName.FormInteraction,
      "Change password form submit"
    );
    sendTelemetryEvent(TelemetryEventName.ApiStart, "Change password");
    void changePassword({ ...values, email });
  };

  /*
   * On page load:
   * -> Register Google Analytics pageview
   * -> Create log event
   * -> Send telemetry event
   */
  useEffect(() => {
    registerGAPageview("Change password");
    logEvent(LogLevel.Info, "Change password page loaded");
    sendTelemetryEvent(
      TelemetryEventName.PageLoad,
      "Change password page loaded"
    );
  }, []);

  /*
   * Handle success and error scenarios
   *
   * On success:
   * -> Register Google Analytics event
   * -> Create log event
   * -> Send telemetry event
   * -> Add feedback
   *
   * On error:
   * -> Register Google Analytics event
   * -> Create log event
   * -> Send telemetry event
   * -> Add feedback
   */
  useEffect(() => {
    if (changePasswordQueryStatus.isSuccess) {
      registerGAEvent("Change password successful");
      logEvent(LogLevel.Success, "Change password successful");
      sendTelemetryEvent(
        TelemetryEventName.ApiStop,
        "Change password successful"
      );
      dispatch(
        feedbackActions.add({
          severity: Severity.Success,
          message: "Password updated!",
        })
      );
      navigate("/");
    } else if (changePasswordQueryStatus.isError) {
      registerGAEvent("Change password failed");
      logEvent(LogLevel.Success, "Change password failed");
      sendTelemetryEvent(TelemetryEventName.ApiStop, "Change password failed");
      dispatch(
        feedbackActions.add({
          severity: Severity.Error,
          message: "Change password failed.",
        })
      );
    }
  }, [changePasswordQueryStatus.isSuccess, changePasswordQueryStatus.isError]);

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
          label="Old password"
          name="oldPassword"
          error={Boolean(errors.oldPassword)}
          helperText={errors.oldPassword}
          onChange={handleChange}
          fullWidth
          value={values.oldPassword}
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
          Change password
        </Button>
      </form>
    </div>
  );
};

export default Register;
