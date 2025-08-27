import PasswordAuthSingleModeForm from "@/components/auth/PasswordAuthSingleModeForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold text-center">Sign in to your account</h1>
      <p className="mt-1 text-center text-xs text-black/60 dark:text-white/60">Or create a new account</p>
      <div className="mt-6">
        <PasswordAuthSingleModeForm mode="signin" />
      </div>
    </div>
  );
}


