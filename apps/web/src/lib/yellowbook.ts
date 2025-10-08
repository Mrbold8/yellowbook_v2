import type { YellowBookList, YellowBookEntry } from '@yellowbook/contract';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000';

export async function fetchYellowBooks(): Promise<YellowBookList> {
  const res = await fetch(`${API_BASE}/yellow-books`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`);
  return (await res.json()) as YellowBookList;
}

export async function fetchYellowBook(slug: string): Promise<YellowBookEntry> {
  const res = await fetch(`${API_BASE}/yellow-books/${slug}`, { cache: 'no-store' });
  if (res.status === 404) throw new Error('Not found');
  if (!res.ok) throw new Error(`Failed to fetch item: ${res.status}`);
  return (await res.json()) as YellowBookEntry;
}
