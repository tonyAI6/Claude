import { useState, useMemo } from 'react';
import { races, DISTANCES, type Distance, type RaceStatus } from './data/races';
import { SLIDER_MONTHS } from './components/DateRangeSlider';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import RaceGrid from './components/RaceGrid';
import StatsBar from './components/StatsBar';

export type SortOption = 'date-asc' | 'date-desc' | 'name' | 'participants';

function addMonths(base: Date, months: number): Date {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
}

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedDistances, setSelectedDistances] = useState<Distance[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<RaceStatus[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [dateRange, setDateRange] = useState<[number, number]>([0, SLIDER_MONTHS]);

  const countries = useMemo(() => {
    return [...new Set(races.map((r) => r.country))].sort();
  }, []);

  const filtered = useMemo(() => {
    const rangeStart = addMonths(TODAY, dateRange[0]).toISOString().slice(0, 10);
    const rangeEnd = addMonths(TODAY, dateRange[1]).toISOString().slice(0, 10);

    let result = races.filter((race) => {
      const q = search.toLowerCase();
      if (
        q &&
        !race.name.toLowerCase().includes(q) &&
        !race.city.toLowerCase().includes(q) &&
        !race.country.toLowerCase().includes(q) &&
        !race.description.toLowerCase().includes(q) &&
        !race.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      if (selectedDistances.length > 0 && !selectedDistances.includes(race.distance)) return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(race.status)) return false;
      if (selectedCountry && race.country !== selectedCountry) return false;
      if (race.date < rangeStart || race.date > rangeEnd) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc': return a.date.localeCompare(b.date);
        case 'date-desc': return b.date.localeCompare(a.date);
        case 'name': return a.name.localeCompare(b.name);
        case 'participants': return b.participants - a.participants;
        default: return 0;
      }
    });
  }, [search, selectedDistances, selectedStatuses, selectedCountry, sortBy, dateRange]);

  function toggleDistance(d: Distance) {
    setSelectedDistances((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  function toggleStatus(s: RaceStatus) {
    setSelectedStatuses((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function clearFilters() {
    setSearch('');
    setSelectedDistances([]);
    setSelectedStatuses([]);
    setSelectedCountry('');
    setSortBy('date-asc');
    setDateRange([0, SLIDER_MONTHS]);
  }

  const hasActiveFilters =
    search !== '' ||
    selectedDistances.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedCountry !== '' ||
    dateRange[0] > 0 ||
    dateRange[1] < SLIDER_MONTHS;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar total={races.length} filtered={filtered.length} />
        <div className="mt-6 space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            distances={DISTANCES}
            selectedDistances={selectedDistances}
            onToggleDistance={toggleDistance}
            selectedStatuses={selectedStatuses}
            onToggleStatus={toggleStatus}
            countries={countries}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            sortBy={sortBy}
            onSortChange={setSortBy}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>
        <div className="mt-8">
          <RaceGrid races={filtered} />
        </div>
      </main>
      <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-500 text-sm">
        <p>Race data is indicative — always verify dates and registration on official race websites.</p>
        <p className="mt-1">Built with React + Vite · {races.length} races worldwide</p>
      </footer>
    </div>
  );
}
