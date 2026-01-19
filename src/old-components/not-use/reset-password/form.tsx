"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/old-http/apiClient";

const schema = yup
  .object({
    newPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  })
  .required();

export default function ResetPasswordForm() {
  return (
    <Suspense>
      <SuspenseComponent />
    </Suspense>
  );
}

const SuspenseComponent = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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
      const response = await apiClient.post("/reset-password", {
        token,
        newPassword: data.newPassword,
      });

      if (response.status === 200) {
        setSuccessMessage(response.data?.message);
        setTimeout(() => {
          router.push("/login");
        }, 1200);
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
          type="password"
          className="form-control style-2"
          placeholder="New Password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <div className="text-danger">{errors.newPassword.message}</div>
        )}
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control style-2"
          placeholder="Confirm New Password"
          {...register("confirmNewPassword")}
        />
        {errors.confirmNewPassword && (
          <div className="text-danger">{errors.confirmNewPassword.message}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-outline-primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Change Password"}{" "}
        <i className="icon-chevron-right" />
      </button>

      {successMessage && (
        <div className="text-success mt-3">{successMessage}</div>
      )}
      {error && <div className="text-danger mt-3">{error}</div>}
    </form>
  );
};
