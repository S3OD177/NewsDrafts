import { cn } from '@/lib/utils';

export function Tabs({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex gap-2">{children}</div>;
}

export function TabsTrigger({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={cn('px-3 py-1 rounded-md text-sm', active ? 'bg-primary text-white' : 'bg-secondary')}>{children}</button>;
}
