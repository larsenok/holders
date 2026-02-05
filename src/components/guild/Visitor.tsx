import { useEffect } from 'react';
import { useGuild } from '../../providers/GuildProvider';

export default function Visitor() {
  const { visitor, resolveVisitor } = useGuild();

  useEffect(() => {
    if (visitor?.type === 'Burglar') {
      const t = setTimeout(() => resolveVisitor(false), 5000);
      return () => clearTimeout(t);
    }
  }, [visitor, resolveVisitor]);

  if (!visitor) return null;

  const messages: Record<string, string> = {
    Trader: 'Trader offers a tome shard',
    Burglar: 'Burglar! Click quickly!',
    NiceStranger: 'A nice stranger gifts you resources',
    RealEstate: 'Planner offers investment',
    Bard: 'Bard promises a gold boost',
  };

  return (
    <div
      className="absolute bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow cursor-pointer"
      onClick={() => resolveVisitor(true)}
    >
      {messages[visitor.type]}
    </div>
  );
}
