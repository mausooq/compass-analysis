import { differenceInDays } from "date-fns";

// CALCULATE PENDING DAYS
export function calculatePendingDays(
  dateValue?: string
) {

  if (!dateValue)
    return null;

  const parsed = new Date(dateValue);

  // INVALID DATE
  if (isNaN(parsed.getTime()))
    return null;

  const today = new Date();

  const days = differenceInDays(
    today,
    parsed
  );

  // FUTURE DATE
  // DO NOT ALLOW NEGATIVE
  if (days < 0)
    return 0;

  return days;
}

// STATUS / AGING
export function getAgingBucket(
  days: number | null
) {

  // NO DATE
  if (days === null)
    return "No Date";

  // UPCOMING / TODAY
  if (days === 0)
    return "Upcoming";

  // NORMAL
  if (days <= 7)
    return "Normal";

  // ATTENTION
  if (days <= 15)
    return "Attention";

  // CRITICAL
  if (days <= 30)
    return "Critical";

  // ESCALATION
  return "Escalation";
}