import AuthLayout from "../../../components/auth/auth-layout";
import RegisterForm from "../../../components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join NovaCart to shop faster, manage orders, and enjoy a premium buying experience."
    >
      <RegisterForm />
    </AuthLayout>
  );
}