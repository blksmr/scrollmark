export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-screen-md gap-x-12 overflow-x-hidden px-6 py-20 md:overflow-x-visible">
      {children}
    </main>
  );
}
