// apps/web/app/yellow-books/page.tsx
import Link from 'next/link';
// import { fetchYellowBooks } from '@/src/lib/yellowbook';
import { fetchYellowBooks } from '../lib/yellowbook';

export const dynamic = 'force-dynamic';

export default async function YellowBooksPage() {
  const list = await fetchYellowBooks();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Шар ном — Бизнесүүд</h1>
        <p className="text-sm text-gray-500">API-гаас бодитоор татаж байна</p>
      </header>

      <ul className="space-y-4" aria-label="Business list">
        {list.map((item) => (
          <li key={item.slug} className="rounded-2xl border p-4 hover:shadow">
            <div className="flex items-start gap-4">
              <img
                src={item.photos?.[0] ?? 'https://placehold.co/96x96?text=No+Photo'}
                alt={`${item.name} photo`}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  <Link className="underline" href={`/yellow-books/${item.slug}`}>
                    {item.name}
                  </Link>
                </h2>
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.category}</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {item.description ?? 'Тайлбар оруулаагүй'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {item.address.district}, {item.address.street}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
