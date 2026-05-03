import type { Race, Distance } from '../data/races';

interface Props {
  race: Race;
}

const DISTANCE_BADGE: Record<Distance, string> = {
  '5K': 'bg-emerald-500/20 text-emerald-300',
  '10K': 'bg-teal-500/20 text-teal-300',
  'Half Marathon': 'bg-blue-500/20 text-blue-300',
  'Marathon': 'bg-violet-500/20 text-violet-300',
  '50K': 'bg-orange-500/20 text-orange-300',
  '50 Miles': 'bg-amber-500/20 text-amber-300',
  '100K': 'bg-red-500/20 text-red-300',
  '100 Miles': 'bg-rose-500/20 text-rose-300',
  'Multi-Day': 'bg-pink-500/20 text-pink-300',
};

const STATUS_BADGE = {
  Open: 'bg-green-500/20 text-green-300',
  'Coming Soon': 'bg-yellow-500/20 text-yellow-300',
  'Sold Out': 'bg-gray-500/20 text-gray-400',
  Closed: 'bg-red-500/20 text-red-400',
};

const STATUS_DOT = {
  Open: 'bg-green-400',
  'Coming Soon': 'bg-yellow-400',
  'Sold Out': 'bg-gray-400',
  Closed: 'bg-red-400',
};

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵', AU: '🇦🇺',
  NL: '🇳🇱', IT: '🇮🇹', CH: '🇨🇭', ES: '🇪🇸', GR: '🇬🇷', AT: '🇦🇹',
  CA: '🇨🇦', ZA: '🇿🇦', AE: '🇦🇪', PT: '🇵🇹', DK: '🇩🇰', MA: '🇲🇦',
  NZ: '🇳🇿', HK: '🇭🇰', OM: '🇴🇲', RU: '🇷🇺', AD: '🇦🇩', GL: '🌍',
};

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatParticipants(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return n.toString();
}

export default function RaceCard({ race }: Props) {
  const flag = COUNTRY_FLAGS[race.countryCode] ?? '🌍';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/30 group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base leading-snug group-hover:text-orange-300 transition-colors line-clamp-2">
            {race.name}
          </h3>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
            <span>{flag}</span>
            <span>{race.city}, {race.country}</span>
          </p>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${DISTANCE_BADGE[race.distance]}`}>
          {race.distance}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{race.description}</p>

      {/* Stats row */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        {/* Date */}
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(race.date)}
        </div>

        {/* Participants */}
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {formatParticipants(race.participants)}
        </div>

        {/* Elevation */}
        {race.elevation !== null && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l7-7 4 4 7-10" />
            </svg>
            {race.elevation.toLocaleString()}m
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-800">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status */}
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[race.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[race.status]}`} />
            {race.status}
          </span>

          {/* Series badge */}
          {race.series && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {race.series === 'Abbott WMM' ? '⭐ WMM' : race.series}
            </span>
          )}
        </div>

        {/* Website link */}
        <a
          href={race.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          Website
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Tags */}
      {race.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 -mt-1">
          {race.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-gray-800 text-gray-500">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
