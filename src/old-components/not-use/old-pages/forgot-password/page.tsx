import ForgotPasswordForm from "@/old-components/not-use/forgot-password/form";

export const metadata = {
  title: "Forgot Password",
  description: "Forgot Password",
};

export const dynamic = "force-dynamic";

export default async function ForgotPassword() {
  return (
    <section className="login-sec common-sec">
      <div className="container">
        <div className="login-con">
          <ForgotPasswordForm />
        </div>
      </div>
    </section>
  );
}
