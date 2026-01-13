import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";

export const SignUpPage = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with HelpDesk Pro today"
    >
      <div className="space-y-6">
        <SignUp />

        <p className="text-surface-600 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
