"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/old-http/apiClient";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
  })
  .required();

export default function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");

    try {
      const response = await apiClient.post("/forgot-password", data);

      if (response.status === 200) {
        setSuccessMessage(response.data?.message);
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

      <button
        type="submit"
        className="btn btn-outline-primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Send Reset Link"}{" "}
        <i className="icon-chevron-right" />
      </button>

      {error && <div className="text-danger mt-3">{error}</div>}
      {successMessage && (
        <div className="text-success mt-3">{successMessage}</div>
      )}
    </form>
  );
}
