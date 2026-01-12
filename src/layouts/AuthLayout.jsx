import { Check, LampDesk, MessageCircle } from "lucide-react";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="flex-1 bg-primary-600 flex items-center justify-center p-8">
        <div className="max-w-md text-center text-white">
          <div className="mb-6">
            <div className="rounded-xl flex items-center justify-center mx-auto mb-4">
              <LampDesk className="size-16" />
            </div>
            <h1 className="text-3xl font-bold">HelpDesk Pro</h1>
            <p className="text-primary-100 mt-2">
              Streamline your customer support.
            </p>
          </div>

          <div className="space-y-4 text-sm text-primary-100">
            <div className="flex items-center justify-center space-x-3">
              <Check className="size-5s" />
              <span>Real-time ticket management</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Check className="size-5s" />
              <span>Internal team collaboration</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Check className="size-5s" />
              <span>Smart priority management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900">{title}</h2>
            {subtitle && <p className="text-surface-600 mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
