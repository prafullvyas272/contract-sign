import SignUpForm from "@/old-components/not-use/signup/form";

export const metadata = {
  title: "SignUp",
  description: "SignUp",
};

export const dynamic = "force-dynamic";

export default async function SignUp() {
  return (
    <section className="login-sec common-sec">
      <div className="container">
        <div className="login-con">
          <SignUpForm />
        </div>
      </div>
    </section>
  );
}
