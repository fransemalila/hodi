"use client";

import { useI18n } from "@/lib/i18n";
import type { BookingStatus } from "@/lib/types";
import { Icon } from "./Icon";
import { cx } from "./ui";

const FLOW: BookingStatus[] = ["accepted", "on_the_way", "arrived", "in_progress", "completed"];

export function StatusTimeline({ status }: { status: BookingStatus }) {
  const { t } = useI18n();
  const labels: Record<BookingStatus, string> = {
    pending: t("statusPending"),
    accepted: t("statusAccepted"),
    on_the_way: t("statusOnTheWay"),
    arrived: t("statusArrived"),
    in_progress: t("statusInProgress"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
  };
  const currentIndex = FLOW.indexOf(status);

  return (
    <div className="grid gap-0">
      {FLOW.map((s, i) => {
        const done = currentIndex >= 0 && i <= currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cx(
                  "relative flex h-7 w-7 items-center justify-center rounded-full text-2xs font-bold transition",
                  done ? "bg-brand-600 text-white" : "bg-line text-ink-faint",
                  active && "text-brand-600 pulse-ring",
                )}
              >
                {done ? <Icon name="check" size={14} strokeWidth={2.5} /> : i + 1}
              </div>
              {i < FLOW.length - 1 && (
                <div
                  className={cx("w-0.5 flex-1 transition", i < currentIndex ? "bg-brand-600" : "bg-line")}
                  style={{ minHeight: 26 }}
                />
              )}
            </div>
            <div className={cx("pb-5 pt-1 text-[15px]", active ? "font-bold text-ink" : done ? "text-ink-soft" : "text-ink-faint")}>
              {labels[s]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
