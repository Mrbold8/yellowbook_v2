import express from 'express';
import cors from 'cors';
import { env } from '@yellowbook/config';
import { YellowBookList, YellowBookEntry, assertYellowBookList } from '@yellowbook/contract';
import { prisma } from './db';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/yellow-books', async (_req, res) => {
  try {
    const rows = await prisma.yellowBook.findMany({ orderBy: { createdAt: 'desc' } });

    // Map Prisma rows -> contract entries
    const list: YellowBookList = rows.map(
      (r): YellowBookEntry => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description ?? undefined,
        category: r.category as any,

        address: {
          city: r.city,
          district: r.district,
          street: r.street,
          building: r.building ?? undefined,
          postalCode: r.postalCode ?? undefined,
        },
        location: { lat: Number(r.lat), lng: Number(r.lng) },

        contacts: (r.contacts as any) ?? undefined,
        hours: (r.hours as any) ?? undefined,
        photos: (r.photos as any) ?? undefined,

        rating: r.rating ?? undefined,
        reviewCount: r.reviewCount,
        priceLevel: r.priceLevel ?? undefined,

        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }),
    );

    // Validate with Zod (shared contract)
    const safe = assertYellowBookList(list);
    res.setHeader('Cache-Control', 'no-store');
    res.json(safe);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' });
  }
});

const port = env.API_PORT;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

app.get('/yellow-books/:slug', async (req, res) => {
  try {
    const row = await prisma.yellowBook.findUnique({ where: { slug: req.params.slug } });
    if (!row) return res.status(404).json({ error: 'Not found' });

    const entry = {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description ?? undefined,
      category: row.category as any,
      address: {
        city: row.city,
        district: row.district,
        street: row.street,
        building: row.building ?? undefined,
        postalCode: row.postalCode ?? undefined,
      },
      location: { lat: Number(row.lat), lng: Number(row.lng) },
      contacts: (row.contacts as any) ?? undefined,
      hours: (row.hours as any) ?? undefined,
      photos: (row.photos as any) ?? undefined,
      rating: row.rating ?? undefined,
      reviewCount: row.reviewCount,
      priceLevel: row.priceLevel ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };

    // Optional: validate one item
    // YellowBookEntrySchema.parse(entry);

    res.setHeader('Cache-Control', 'no-store');
    res.json(entry);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' });
  }
});
