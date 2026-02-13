import { cn } from '@/lib/utils';

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <table className={cn('w-full text-sm', className)}>{children}</table>;
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="p-2 text-left font-semibold border-b">{children}</th>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('p-2 border-b align-top', className)}>{children}</td>;
}
