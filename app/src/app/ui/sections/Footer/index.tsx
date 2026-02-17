export default function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-5xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
        <span className="[font-variant:small-caps]">
          © {new Date().getFullYear()} divisor
        </span>
        <span>Edge-first A/B testing</span>
      </div>
    </footer>
  );
}
