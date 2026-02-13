'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, Td, Th } from '@/components/ui/table';

type Source = { id: string; name: string };
type Item = {
  id: string;
  title: string;
  topic: string;
  score: number;
  isRead: boolean;
  publishedAt: string | null;
  source: Source;
};

export default function InboxPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [msg, setMsg] = useState('');
  const [filters, setFilters] = useState({ topic: '', sourceId: '', minScore: '', read: '', from: '', to: '', search: '' });

  const query = useMemo(() => new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString(), [filters]);

  async function load() {
    const [iRes, sRes] = await Promise.all([fetch(`/api/items?${query}`), fetch('/api/sources')]);
    const iData = await iRes.json();
    const sData = await sRes.json();
    setItems(Array.isArray(iData) ? iData : []);
    setSources(Array.isArray(sData) ? sData : []);
    if (iData.error) setMsg(iData.error);
  }

  useEffect(() => {
    load();
  }, [query]);

  async function markRead(id: string, isRead: boolean) {
    await fetch(`/api/items/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead }) });
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Inbox</h2>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Input placeholder="Search keyword" onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <Input placeholder="Topic" onChange={(e) => setFilters({ ...filters, topic: e.target.value })} />
        <Select onChange={(e) => setFilters({ ...filters, sourceId: e.target.value })}>
          <option value="">All sources</option>
          {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <Input type="number" placeholder="Min score" onChange={(e) => setFilters({ ...filters, minScore: e.target.value })} />
        <Input type="date" onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <Input type="date" onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <Select onChange={(e) => setFilters({ ...filters, read: e.target.value })}>
          <option value="">All</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </Select>
      </div>
      <Table>
        <thead>
          <tr><Th>Title</Th><Th>Source</Th><Th>Topic</Th><Th>Published</Th><Th>Score</Th><Th>Status</Th><Th>Actions</Th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <Td><Link className="underline" href={`/item/${item.id}`}>{item.title}</Link></Td>
              <Td>{item.source?.name}</Td>
              <Td><Badge>{item.topic}</Badge></Td>
              <Td>{item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '-'}</Td>
              <Td><Badge className="bg-blue-100">{item.score}</Badge></Td>
              <Td><Badge className={item.isRead ? 'bg-gray-200' : 'bg-green-100'}>{item.isRead ? 'Read' : 'Unread'}</Badge></Td>
              <Td><Button onClick={() => markRead(item.id, !item.isRead)}>{item.isRead ? 'Mark unread' : 'Mark read'}</Button></Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
