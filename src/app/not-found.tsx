import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center" style={{ fontFamily: 'system-ui, -apple-system, Arial, sans-serif' }}>
        <div className="text-8xl mb-6">🐾</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          هاد الصفحة ما كايناش!
        </h1>
        <p className="text-gray-500 mb-2 text-sm">
          Page introuvable — This page doesn&apos;t exist
        </p>
        <p className="text-gray-400 text-xs mb-8 max-w-md">
          يبدو أن هاد الحيوان الصغير تاه... ارجع للصفحة الرئيسية باش تلقى اللي كتبحث عليه.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/ar"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-sm"
          >
            🏠 الرئيسية
          </Link>
          <Link
            href="/fr"
            className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/en"
            className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
        </div>
        <p className="mt-12 text-xs text-gray-300">
          AnimalSouk — سوق الحيوانات بالمغرب
        </p>
      </body>
    </html>
  );
}
