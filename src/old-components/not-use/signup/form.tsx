"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/old-http/apiClient";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  })
  .required();

export default function SignUpForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/sign-up", data);

      if (response.status === 201) {
        setEmail(data.email);
        setOtpStep(true);
      } else {
        setError(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must be a 6-digit numeric value");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setSuccessMessage("");

    try {
      const response = await apiClient.post("/verify-otp", { email, otp });
      if (response.status === 200) {
        router.push("/login");
      } else {
        setOtpError(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setOtpResendLoading(true);
      setSuccessMessage("");
      const response = await apiClient.post("/resend-otp", { email });
      if (response.status === 200) {
        setSuccessMessage("OTP has been resent to your email");
      } else {
        setError(response.data?.message);
      }
      setOtpResendLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!otpStep ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              type="email"
              className="form-control style-2 border border-secondary"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <div className="text-danger">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control style-2 border border-secondary"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <div className="text-danger">{errors.password.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control style-2 border border-secondary"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <div className="text-danger">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-outline-primary"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}{" "}
            <i className="icon-chevron-right" />
          </button>

          <div className="no-account-signup-text">
            Already have an account? <Link href={"/login"}>Login</Link>
          </div>

          {error && <div className="text-danger mt-3">{error}</div>}
        </form>
      ) : (
        <div>
          <div className="form-group">
            <input
              type="text"
              className="form-control style-2 border border-secondary"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              title="OTP must be 6 digits"
            />
            {otpError && <div className="text-danger mt-3">{otpError}</div>}
          </div>

          <button
            onClick={verifyOtp}
            className="btn btn-outline-primary"
            disabled={otpLoading}
          >
            {otpLoading ? "Verifying..." : "Verify OTP"}{" "}
            <i className="icon-chevron-right"></i>
          </button>

          <button
            onClick={resendOtp}
            className="resend-otp-btn"
            disabled={otpLoading}
          >
            {otpResendLoading ? "Resending..." : "Resend"} OTP
          </button>

          {successMessage && (
            <div className="text-success mt-3">{successMessage}</div>
          )}
        </div>
      )}
    </>
  );
}
