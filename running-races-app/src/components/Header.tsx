export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-lg">
            🏃
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">RunRaces</h1>
            <p className="text-xs text-gray-400 mt-0.5">Find your next race</p>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
          <span className="text-gray-500">Major races worldwide</span>
        </nav>
      </div>
    </header>
  );
}
