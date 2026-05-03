import type { Distance, RaceStatus } from '../data/races';
import type { SortOption } from '../App';
import { STATUSES } from '../data/races';
import DateRangeSlider from './DateRangeSlider';

interface Props {
  distances: Distance[];
  selectedDistances: Distance[];
  onToggleDistance: (d: Distance) => void;
  selectedStatuses: RaceStatus[];
  onToggleStatus: (s: RaceStatus) => void;
  countries: string[];
  selectedCountry: string;
  onSelectCountry: (c: string) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  dateRange: [number, number];
  onDateRangeChange: (range: [number, number]) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const DISTANCE_COLORS: Record<Distance, string> = {
  '5K': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30',
  '10K': 'bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30',
  'Half Marathon': 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30',
  'Marathon': 'bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30',
  '50K': 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30',
  '50 Miles': 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30',
  '100K': 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30',
  '100 Miles': 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30',
  'Multi-Day': 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30',
};

const DISTANCE_COLORS_ACTIVE: Record<Distance, string> = {
  '5K': 'bg-emerald-500 text-white border-emerald-400',
  '10K': 'bg-teal-500 text-white border-teal-400',
  'Half Marathon': 'bg-blue-500 text-white border-blue-400',
  'Marathon': 'bg-violet-500 text-white border-violet-400',
  '50K': 'bg-orange-500 text-white border-orange-400',
  '50 Miles': 'bg-amber-500 text-white border-amber-400',
  '100K': 'bg-red-500 text-white border-red-400',
  '100 Miles': 'bg-rose-500 text-white border-rose-400',
  'Multi-Day': 'bg-pink-500 text-white border-pink-400',
};

const STATUS_COLORS: Record<RaceStatus, string> = {
  Open: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30',
  'Coming Soon': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30',
  'Sold Out': 'bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30',
  Closed: 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30',
};

const STATUS_COLORS_ACTIVE: Record<RaceStatus, string> = {
  Open: 'bg-green-500 text-white border-green-400',
  'Coming Soon': 'bg-yellow-500 text-white border-yellow-400',
  'Sold Out': 'bg-gray-500 text-white border-gray-400',
  Closed: 'bg-red-500 text-white border-red-400',
};

export default function FilterBar({
  distances,
  selectedDistances,
  onToggleDistance,
  selectedStatuses,
  onToggleStatus,
  countries,
  selectedCountry,
  onSelectCountry,
  sortBy,
  onSortChange,
  dateRange,
  onDateRangeChange,
  hasActiveFilters,
  onClearFilters,
}: Props) {
  return (
    <div className="space-y-4 bg-gray-900 rounded-xl p-4 border border-gray-800">
      {/* Distance filters */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Distance</p>
        <div className="flex flex-wrap gap-2">
          {distances.map((d) => {
            const active = selectedDistances.includes(d);
            return (
              <button
                key={d}
                onClick={() => onToggleDistance(d)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  active ? DISTANCE_COLORS_ACTIVE[d] : DISTANCE_COLORS[d]
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date range slider */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Date Range</p>
        <div className="px-1 pb-2">
          <DateRangeSlider value={dateRange} onChange={onDateRangeChange} />
        </div>
      </div>

      {/* Status + Country + Sort */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Status */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => {
              const active = selectedStatuses.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => onToggleStatus(s)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    active ? STATUS_COLORS_ACTIVE[s] : STATUS_COLORS[s]
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Country */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Country</p>
          <select
            value={selectedCountry}
            onChange={(e) => onSelectCountry(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sort by</p>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="date-asc">Date (earliest first)</option>
            <option value="date-desc">Date (latest first)</option>
            <option value="name">Name (A–Z)</option>
            <option value="participants">Participants (most first)</option>
          </select>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
