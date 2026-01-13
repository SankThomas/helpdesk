import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";

export const SignInPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to you account to continue"
    >
      <div className="space-y-6">
        <SignIn />

        <p className="text-surface-600 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
