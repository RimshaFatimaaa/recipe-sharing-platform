import PasswordAuthSingleModeForm from "@/components/auth/PasswordAuthSingleModeForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold text-center">Create your account</h1>
      <p className="mt-1 text-center text-xs text-black/60 dark:text-white/60">Or sign in to an existing account</p>
      <div className="mt-6">
        <PasswordAuthSingleModeForm mode="signup" />
      </div>
    </div>
  );
}


