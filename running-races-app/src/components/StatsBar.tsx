interface Props {
  total: number;
  filtered: number;
}

export default function StatsBar({ total, filtered }: Props) {
  return (
    <div className="flex items-baseline gap-2">
      <h2 className="text-3xl font-bold text-white">
        {filtered === total ? total : filtered}
      </h2>
      <span className="text-gray-400 text-lg">
        {filtered === total
          ? 'races worldwide'
          : `of ${total} races`}
      </span>
    </div>
  );
}
