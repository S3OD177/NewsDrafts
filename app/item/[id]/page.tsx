'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Item = {
  id: string;
  title: string;
  snippet: string | null;
  url: string;
  score: number;
};

const types = ['SHORT', 'WHY', 'THREAD', 'CUSTOM'];

export default function ItemPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [item, setItem] = useState<Item | null>(null);
  const [draft, setDraft] = useState('');
  const [type, setType] = useState('SHORT');
  const [tweetUrl, setTweetUrl] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`/api/items/${id}`).then((r) => r.json()).then(setItem);
  }, [id]);

  const prompts = useMemo(() => {
    if (!item) return [];
    const context = `Title: ${item.title}\nSnippet: ${item.snippet ?? ''}\nLink: ${item.url}`;
    return [
      { name: 'Short Tweet', text: `Write one concise tweet in English under 280 chars.\n${context}` },
      { name: 'Why It Matters', text: `Explain why this matters in one tweet with a clear takeaway.\n${context}` },
      { name: '3-Tweet Thread', text: `Draft a 3-tweet thread: hook, context, action.\n${context}` },
    ];
  }, [item]);

  async function saveDraft() {
    const res = await fetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: id, type, content: draft, status: 'DRAFT', tweetUrl: tweetUrl || null }),
    });
    setMsg(res.ok ? 'Draft saved' : 'Failed to save draft');
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setMsg('Copied to clipboard');
  }

  if (!item) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Item Detail</h2>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <div className="rounded border p-4 space-y-2">
        <h3 className="font-medium">{item.title}</h3>
        <p>{item.snippet}</p>
        <a href={item.url} className="underline text-blue-700" target="_blank">Open original</a>
        <p>Score: {item.score}</p>
      </div>
      <div className="rounded border p-4 space-y-3">
        <h3 className="font-semibold">Prompt Studio</h3>
        {prompts.map((p) => (
          <div key={p.name} className="rounded border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <strong>{p.name}</strong>
              <Button className="bg-green-700" onClick={() => copyText(p.text)}>Copy Prompt</Button>
            </div>
            <pre className="whitespace-pre-wrap text-xs bg-secondary p-2 rounded">{p.text}</pre>
            <div className="flex gap-2">
              <a href="https://chat.openai.com/" target="_blank"><Button>Open ChatGPT</Button></a>
              <a href="https://gemini.google.com/" target="_blank"><Button>Open Gemini</Button></a>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded border p-4 space-y-2">
        <h3 className="font-semibold">Draft Editor</h3>
        <Select value={type} onChange={(e) => setType(e.target.value)}>{types.map((t) => <option key={t}>{t}</option>)}</Select>
        <Textarea placeholder="Paste output from ChatGPT/Gemini" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Input placeholder="Tweet URL (optional when posted)" value={tweetUrl} onChange={(e) => setTweetUrl(e.target.value)} />
        <Button onClick={saveDraft}>Save Draft</Button>
      </div>
    </div>
  );
}
