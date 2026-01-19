"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useAuth } from "@/old-context/authContext";
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
  })
  .required();

export default function LoginForm() {
  const { login }: { login: any } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    let Qty = localStorage.getItem("QTY");
    setLoading(true);
    setError("");

    try {
      const response: any = await apiClient.post("/login", data);
      if (response.status === 200) {
        login(response.data?.data);
        if (Qty) {
          router.push(`/upload-document?signers=${Qty}`);
        } else {
          router.push("/my-account");
        }
      } else {
        setError(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          type="email"
          className="form-control style-2"
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
          className="form-control style-2"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <div className="text-danger">{errors.password.message}</div>
        )}
      </div>
      <div className="forgot-password-text">
        <Link href={"/forgot-password"}>Forgot password?</Link>
      </div>

      <button
        type="submit"
        className="btn btn-outline-primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Log In"} <i className="icon-chevron-right" />
      </button>

      <div className="no-account-signup-text">
        Don’t you have an account? <Link href={"/register"}>Sign Up</Link>
      </div>
      {error && <div className="text-danger mt-3">{error}</div>}
    </form>
  );
}
