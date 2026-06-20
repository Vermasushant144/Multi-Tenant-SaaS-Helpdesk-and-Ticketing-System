export function BrutSkeleton({ className = "" }: { className?: string }) {
  return <div className={`brut-border bg-muted animate-pulse ${className}`} />;
}
