import AuthLayout from "../../../components/auth/auth-layout";
import ResetPasswordForm from "../../../components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Choose a new password to regain access to your account."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}