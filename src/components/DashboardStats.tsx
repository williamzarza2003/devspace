import type { Technology } from "../hooks/useTechnologies";

type DashboardStatsProps = {
  technologies: Technology[];
};

function DashboardStats({ technologies }: DashboardStatsProps) {
  const total = technologies.length;

  const categories = [
    { label: "Lenguajes", value: "LENGUAJE" },
    { label: "Frameworks", value: "FRAMEWORK" },
    { label: "Herramientas", value: "HERRAMIENTA" },
    { label: "Bases de datos", value: "BASE DE DATOS" },
  ];

  const stats = categories.map((category) => ({
    ...category,
    count: technologies.filter(
      (technology) => technology.label === category.value,
    ).length,
  }));

  return (
    <section className="dashboard-stats" aria-label="Estadísticas">
      <div className="stats-heading">
        <div>
          <span className="stats-eyebrow">RESUMEN GENERAL</span>
          <h2>Tu espacio de desarrollo</h2>
        </div>

        <span className="stats-total">
          {total} {total === 1 ? "tecnología" : "tecnologías"}
        </span>
      </div>

      <div className="stats-grid">
        <article className="stat-card stat-total">
          <div className="stat-icon">✦</div>
          <div>
            <p>Total registradas</p>
            <strong>{total}</strong>
          </div>
        </article>

        {stats.map((stat, index) => (
          <article className="stat-card" key={stat.value}>
            <div className="stat-icon">{["⌘", "◈", "⚙", "▦"][index]}</div>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.count}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="distribution-panel">
        <div className="distribution-heading">
          <h3>Distribución por categorías</h3>
          <span>{total} en total</span>
        </div>

        <div className="distribution-list">
          {stats.map((stat) => {
            const percentage =
              total === 0 ? 0 : Math.round((stat.count / total) * 100);

            return (
              <div className="distribution-item" key={stat.value}>
                <div className="distribution-info">
                  <span>{stat.label}</span>
                  <span>
                    {stat.count} · {percentage}%
                  </span>
                </div>

                <div className="distribution-track">
                  <div
                    className="distribution-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DashboardStats;
