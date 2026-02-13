'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const statuses = ['DRAFT', 'APPROVED', 'POSTED', 'REJECTED'] as const;
type Draft = { id: string; type: string; content: string; status: string; tweetUrl: string | null };

export default function DraftsPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>('DRAFT');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch(`/api/drafts?status=${status}`);
    const data = await res.json();
    setDrafts(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, [status]);

  async function update(id: string, body: Partial<Draft>) {
    await fetch(`/api/drafts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setMsg('Saved');
    load();
  }

  async function copy(text: string) { await navigator.clipboard.writeText(text); setMsg('Copied'); }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Drafts</h2>
      {msg && <p className="text-sm">{msg}</p>}
      <Tabs>
        <TabsList>
          {statuses.map((s) => <TabsTrigger key={s} active={status === s} onClick={() => setStatus(s)}>{s}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      <div className="space-y-3">
        {drafts.map((d) => (
          <div key={d.id} className="border rounded p-3 space-y-2">
            <div className="flex gap-2 items-center"><strong>{d.type}</strong><span>{d.status}</span></div>
            <Textarea value={d.content} onChange={(e) => setDrafts((cur) => cur.map((x) => (x.id === d.id ? { ...x, content: e.target.value } : x)))} />
            <Input placeholder="Tweet URL" value={d.tweetUrl ?? ''} onChange={(e) => setDrafts((cur) => cur.map((x) => (x.id === d.id ? { ...x, tweetUrl: e.target.value } : x)))} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => copy(d.content)}>Copy</Button>
              <Button onClick={() => update(d.id, { content: d.content })}>Save Edit</Button>
              <Button onClick={() => update(d.id, { status: 'APPROVED' })}>Approve</Button>
              <Button onClick={() => update(d.id, { status: 'REJECTED' })}>Reject</Button>
              <Button onClick={() => update(d.id, { status: 'POSTED', tweetUrl: d.tweetUrl ?? null })}>Mark Posted</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
