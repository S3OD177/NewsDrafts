'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Settings = {
  includeKeywords: string[];
  excludeKeywords: string[];
  dedupDays: number;
  scoreRules: Record<string, number>;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings);
  }, []);

  async function save() {
    if (!settings) return;
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setMsg(res.ok ? 'Settings saved' : 'Failed to save');
  }

  if (!settings) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      {msg && <p className="text-sm">{msg}</p>}
      <div className="space-y-2">
        <label className="text-sm">Include keywords (comma-separated)</label>
        <Input value={settings.includeKeywords.join(',')} onChange={(e) => setSettings({ ...settings, includeKeywords: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Exclude keywords (comma-separated)</label>
        <Input value={settings.excludeKeywords.join(',')} onChange={(e) => setSettings({ ...settings, excludeKeywords: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Dedup days (future use)</label>
        <Input type="number" value={settings.dedupDays} onChange={(e) => setSettings({ ...settings, dedupDays: Number(e.target.value) || 1 })} />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Score rules JSON</label>
        <Textarea value={JSON.stringify(settings.scoreRules, null, 2)} onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            setSettings({ ...settings, scoreRules: parsed });
          } catch {
            setMsg('Invalid JSON in score rules');
          }
        }} />
      </div>
      <Button onClick={save}>Save Settings</Button>
    </div>
  );
}
