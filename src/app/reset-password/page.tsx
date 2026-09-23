import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params =
    await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <ResetPasswordForm
        token={params.token || ""}
      />
    </main>
  );
}