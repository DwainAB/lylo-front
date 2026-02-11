import Link from "next/link";

export default function RecommendationsHeader() {
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-white/80 backdrop-blur-sm z-10">
      <Link href="/" className="flex items-center gap-2">
        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18l7 3.89v7.86l-7 3.89-7-3.89V8.07l7-3.89zM12 7l-5 2.78v5.44L12 18l5-2.78V9.78L12 7z" />
        </svg>
        <span className="brand-text font-medium text-gray-700">
          Le Studio Des Parfums
        </span>
      </Link>

      <button className="p-2">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </header>
  );
}
