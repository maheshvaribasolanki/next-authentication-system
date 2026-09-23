export interface SignupInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
}