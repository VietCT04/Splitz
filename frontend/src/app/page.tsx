import LoginForm from "./components/auth/LoginForm";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          Log in
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
