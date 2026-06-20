import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open, onClose, title, children, footer,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative bg-background brut-border brut-shadow w-full max-w-lg">
        <div className="flex items-center justify-between brut-border-b px-5 py-3">
          <h2 className="text-base font-black uppercase tracking-tight">{title}</h2>
          <button onClick={onClose} className="brut-btn-ghost p-1" aria-label="Close dialog"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="brut-border-t px-5 py-3 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open, onCancel, onConfirm, title, message, confirmLabel = "Confirm",
}: { open: boolean; onCancel: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}
      footer={<>
        <button className="brut-btn" onClick={onCancel}>Cancel</button>
        <button className="brut-btn brut-btn-primary" onClick={onConfirm}>{confirmLabel}</button>
      </>}>
      <p className="text-sm">{message}</p>
    </Modal>
  );
}
