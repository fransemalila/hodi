// Centered mobile-frame layout for the customer app. On phones it is
// full-bleed; on desktop it renders as a phone-sized card.
export default function BarberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-[#e8ece9] sm:p-4">
      <div className="relative flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-white sm:h-[calc(100dvh-2rem)] sm:rounded-[2.25rem] sm:shadow-2xl">
        <div id="app-scroll" className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
        </div>
        <div id="sheet-root" />
      </div>
    </div>
  );
}
