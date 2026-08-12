import AuthLayout from "../../../components/auth/auth-layout";
import LoginForm from "../../../components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue shopping, track your orders, and manage your account."
    >
      <LoginForm />
    </AuthLayout>
  );
}