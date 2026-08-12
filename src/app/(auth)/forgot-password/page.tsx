import AuthLayout from "../../../components/auth/auth-layout";
import ForgotPasswordForm from "../../../components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email address and we will send you instructions to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}