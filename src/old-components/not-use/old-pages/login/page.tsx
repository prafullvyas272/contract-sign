import LoginForm from "@/old-components/not-use/login/form";

export const metadata = {
  title: "Login",
  description: "Login",
};

export const dynamic = "force-dynamic";

export default async function Login() {
  return (
    <section className="login-sec common-sec">
      <div className="container">
        <div className="login-con">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
