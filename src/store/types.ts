export interface LoginRequestData {
  email: string;
  password: string;
}

export interface LoginResponseData {
  email: string;
  token: string;
}

export interface RegisterRequestData {
  email: string;
  password: string;
}

export interface RegisterResponseData {
  email: string;
  token: string;
}

export interface ChangePasswordRequestData {
  email: string;
  oldPassword: string;
  password: string;
}

export enum Headers {
  Authorization = "authorization",
  Accept = "Accept",
}

export enum TelemetryEventName {
  PageLoad = "page_load",
  FormInteraction = "form_interaction",
  ApiStart = "api_start",
  ApiStop = "api_stop",
}

export enum LogLevel {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Success = "success",
}

export enum Severity {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Success = "success",
}

export interface Feedback {
  id: number;
  severity: Severity;
  message: string;
}
