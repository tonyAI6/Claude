import type { Race } from '../data/races';
import RaceCard from './RaceCard';

interface Props {
  races: Race[];
}

export default function RaceGrid({ races }: Props) {
  if (races.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-medium text-gray-400">No races found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {races.map((race) => (
        <RaceCard key={race.id} race={race} />
      ))}
    </div>
  );
}
