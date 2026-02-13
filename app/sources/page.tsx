'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, Td, Th } from '@/components/ui/table';

type Source = {
  id: string;
  name: string;
  rssUrl: string;
  topic: string;
  enabled: boolean;
  lastFetchedAt: string | null;
  lastError: string | null;
  errorCount: number;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [form, setForm] = useState({ name: '', rssUrl: '', topic: '', enabled: true });
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('/api/sources');
    const data = await res.json();
    if (Array.isArray(data)) setSources(data);
    else setMsg(data.error ?? 'Failed loading sources');
  }

  useEffect(() => { load(); }, []);

  async function createSource() {
    const res = await fetch('/api/sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error ? JSON.stringify(data.error) : 'Create failed');
    setForm({ name: '', rssUrl: '', topic: '', enabled: true });
    setMsg('Saved source');
    load();
  }

  async function remove(id: string) { await fetch(`/api/sources/${id}`, { method: 'DELETE' }); load(); }
  async function toggle(id: string, enabled: boolean) { await fetch(`/api/sources/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: !enabled }) }); load(); }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Sources</h2>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <div className="grid md:grid-cols-4 gap-2 rounded border p-3">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="RSS URL" value={form.rssUrl} onChange={(e) => setForm({ ...form, rssUrl: e.target.value })} />
        <Input placeholder="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
        <Button onClick={createSource}>Add Source</Button>
      </div>
      <Table>
        <thead><tr><Th>Name</Th><Th>Topic</Th><Th>RSS URL</Th><Th>Enabled</Th><Th>Health</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {sources.map((s) => (
            <tr key={s.id}>
              <Td>{s.name}</Td><Td>{s.topic}</Td><Td className="max-w-72 break-all">{s.rssUrl}</Td>
              <Td>{String(s.enabled)}</Td>
              <Td>
                <div className="text-xs">Last fetched: {s.lastFetchedAt ? new Date(s.lastFetchedAt).toLocaleString() : '-'}</div>
                <div className="text-xs">Errors: {s.errorCount} {s.lastError ? `(${s.lastError})` : ''}</div>
              </Td>
              <Td className="space-x-2">
                <Button onClick={() => toggle(s.id, s.enabled)}>{s.enabled ? 'Disable' : 'Enable'}</Button>
                <Button className="bg-red-600" onClick={() => remove(s.id)}>Delete</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
