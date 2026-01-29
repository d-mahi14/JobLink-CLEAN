const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className={`stat-figure text-${color}`}>
          {Icon && <Icon className="w-8 h-8" />}
        </div>
        <div className="stat-title">{title}</div>
        <div className={`stat-value text-${color}`}>{value}</div>
      </div>
    </div>
  );
};

export default StatCard;