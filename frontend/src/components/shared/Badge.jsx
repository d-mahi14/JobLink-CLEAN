import { STATUS_COLORS } from '../../utils/constants';

const Badge = ({ status, children }) => {
  const colorClass = STATUS_COLORS[status] || 'badge-ghost';

  return (
    <span className={`badge ${colorClass} badge-lg`}>
      {children || status}
    </span>
  );
};

export default Badge;