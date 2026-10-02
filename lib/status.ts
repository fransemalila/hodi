import type { TKey } from "./i18n";
import type { BookingStatus } from "./types";

/** Customer-facing headline per booking status. */
export const STATUS_TITLE: Record<BookingStatus, TKey> = {
  pending: "findingBarber",
  accepted: "acceptedTitle",
  on_the_way: "onTheWayTitle",
  arrived: "arrivedTitle",
  in_progress: "inProgressTitle",
  completed: "completedTitle",
  cancelled: "cancelledTitle",
};

/** Short status label per booking status. */
export const STATUS_LABEL: Record<BookingStatus, TKey> = {
  pending: "statusPending",
  accepted: "statusAccepted",
  on_the_way: "statusOnTheWay",
  arrived: "statusArrived",
  in_progress: "statusInProgress",
  completed: "statusCompleted",
  cancelled: "statusCancelled",
};
