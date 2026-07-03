export default function PropertyDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#F8F5EE] px-5 pb-20 pt-32 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-8 w-48 rounded-full bg-[#D4AF37]/30" />
        <div className="mt-6 h-24 max-w-3xl rounded-3xl bg-[#081120]/10" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="h-[520px] rounded-[2.5rem] bg-[#081120]/10" />
          <div className="h-[520px] rounded-[2.5rem] bg-white" />
        </div>
      </div>
    </main>
  );
}
