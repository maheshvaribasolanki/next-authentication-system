import { requireUser } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const user =
    await requireUser();

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-5">
          <h1 className="text-xl font-bold">
            Auth Dashboard
          </h1>

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h2 className="text-3xl font-bold">
            Welcome, {user.name}!
          </h2>

          <p className="mt-2 text-gray-500">
            You are successfully authenticated.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-medium">
                {user.name}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                Username
              </p>

              <p className="mt-1 font-medium">
                @{user.username}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                Email Status
              </p>

              <p className="mt-1 font-medium text-green-600">
                {user.isEmailVerified
                  ? "Verified"
                  : "Not Verified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}