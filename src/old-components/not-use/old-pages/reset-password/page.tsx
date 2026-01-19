import ResetPasswordForm from "@/old-components/not-use/reset-password/form";

export const metadata = {
  title: "Reset Password",
  description: "Reset Password",
};

export const dynamic = "force-dynamic";

export default async function ForgotPassword() {
  return (
    <section className="login-sec common-sec">
      <div className="container">
        <div className="login-con">
          <ResetPasswordForm />
        </div>
      </div>
    </section>
  );
}
