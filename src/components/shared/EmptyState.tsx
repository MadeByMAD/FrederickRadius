import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/motion';

interface Props {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-8 px-4 text-center"
    >
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-sm font-semibold text-text mb-1">{title}</h3>
      <p className="text-xs text-text-muted max-w-[200px]">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-full bg-accent/10 border border-accent/30 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
