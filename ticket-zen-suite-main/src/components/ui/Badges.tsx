import type { TicketStatus, TicketPriority } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const label = status.replace("_", " ");
  const solid = status === "IN_PROGRESS" || status === "CLOSED";
  return (
    <span className={`brut-badge ${solid ? "brut-badge-solid" : ""}`}>
      <span className="inline-block w-2 h-2 mr-1.5" style={{ background: status === "OPEN" ? "#000" : "#fff" }} />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const marks = { LOW: "·", MEDIUM: "··", HIGH: "···", URGENT: "!!!" }[priority];
  const solid = priority === "HIGH" || priority === "URGENT";
  return <span className={`brut-badge ${solid ? "brut-badge-solid" : ""}`}>{marks} {priority}</span>;
}
