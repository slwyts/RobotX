export function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-light-panel dark:bg-dark-panel border border-light-border dark:border-dark-border rounded-2xl p-5 mb-4 backdrop-blur-xl shadow-panel-light dark:shadow-panel-dark transition-all duration-500 ${className}`}
    >
      {children}
    </div>
  );
}
