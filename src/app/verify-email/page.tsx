import VerifyOtpForm from "@/components/auth/VerifyOtpForm";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params =
    await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <VerifyOtpForm
        initialEmail={params.email || ""}
      />
    </main>
  );
}