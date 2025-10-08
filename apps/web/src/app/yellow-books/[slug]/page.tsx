// apps/web/app/yellow-books/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { fetchYellowBook } from '../../../lib/yellowbook';

type Props = { params: { slug: string } };

export default async function YellowBookDetail({ params }: Props) {
  try {
    const item = await fetchYellowBook(params.slug);

    const center = `${item.location.lat},${item.location.lng}`;
    const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${item.location.lng - 0.01}%2C${item.location.lat - 0.01}%2C${item.location.lng + 0.01}%2C${item.location.lat + 0.01}&layer=mapnik&marker=${center}`;

    return (
      <main className="max-w-3xl mx-auto p-6">
        <a href="/yellow-books" className="text-sm underline">
          &larr; буцах
        </a>

        <h1 className="text-2xl font-bold mt-2">{item.name}</h1>
        <p className="text-xs uppercase tracking-wide text-gray-500">{item.category}</p>

        <section aria-labelledby="address" className="mt-4">
          <h2 id="address" className="font-semibold">
            Хаяг
          </h2>
          <p className="text-sm text-gray-700">
            {item.address.district}, {item.address.street}
            {item.address.building ? `, ${item.address.building}` : ''}
          </p>
        </section>

        <section aria-labelledby="contacts" className="mt-4">
          <h2 id="contacts" className="font-semibold">
            Холбогдох
          </h2>
          <ul className="text-sm text-gray-700 list-disc pl-5">
            {item.contacts?.phone && <li>Утас: {item.contacts.phone}</li>}
            {item.contacts?.email && <li>И-мэйл: {item.contacts.email}</li>}
            {item.contacts?.website && (
              <li>
                Вэб:{' '}
                <a className="underline" href={item.contacts.website} target="_blank">
                  Website
                </a>
              </li>
            )}
            {item.contacts?.facebook && (
              <li>
                FB:{' '}
                <a className="underline" href={item.contacts.facebook} target="_blank">
                  Facebook
                </a>
              </li>
            )}
          </ul>
        </section>

        <section aria-labelledby="desc" className="mt-4">
          <h2 id="desc" className="font-semibold">
            Тайлбар
          </h2>
          <p className="text-sm text-gray-700">{item.description ?? '—'}</p>
        </section>

        {/* Map island */}
        <section aria-labelledby="map" className="mt-6">
          <h2 id="map" className="font-semibold">
            Байршил (Map)
          </h2>
          <div className="rounded-2xl overflow-hidden border">
            <iframe
              title="Map"
              width="100%"
              height="320"
              src={osmSrc}
              aria-label="Business location on map"
            />
          </div>
        </section>

        {/* Photos */}
        {item.photos && item.photos.length > 0 && (
          <section aria-labelledby="photos" className="mt-6">
            <h2 id="photos" className="font-semibold">
              Зургууд
            </h2>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {item.photos.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`${item.name} photo ${i + 1}`}
                  className="rounded-xl object-cover h-40 w-full"
                />
              ))}
            </div>
          </section>
        )}
      </main>
    );
  } catch {
    notFound();
  }
}
