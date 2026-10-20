export default function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="stat">
      <Icon size={20} className="stat-icon" />
      <b>{value}</b>
      <small>{label}</small>
    </div>
  )
}