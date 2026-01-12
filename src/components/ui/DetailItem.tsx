import type { LucideIcon } from 'lucide-react';

interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  highlight?: boolean;
}

export const DetailItem = ({ icon: Icon, label, value, highlight = false }: DetailItemProps) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
    <div className="p-2 rounded-lg bg-gray-100 text-red-600 border border-gray-200 shadow-sm">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">{label}</p>
      <p className={`font-medium text-sm ${highlight ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
    </div>
  </div>
);