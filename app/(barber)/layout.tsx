// Centered mobile-frame layout for the customer barber app.
export default function BarberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-gray-200/70 sm:p-4">
      <div className="relative flex h-[100dvh] w-full max-w-[440px] flex-col overflow-y-auto bg-white sm:h-[calc(100dvh-2rem)] sm:rounded-[2.25rem] sm:shadow-2xl">
        {children}
      </div>
    </div>
  );
}
