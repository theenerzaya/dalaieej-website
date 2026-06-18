import axios from "axios";
import qs from "qs";

const CLOUDBEDS_API_BASE = "https://hotels.cloudbeds.com/api/v1.2";

function getCloudbedsCredentials(): { apiKey: string; propertyId: string } {
  const apiKey = process.env.CLOUDBEDS_API_KEY;
  const propertyId = process.env.CLOUDBEDS_PROPERTY_ID;

  if (!apiKey || !propertyId) {
    throw new Error("Cloudbeds API credentials not configured");
  }

  return { apiKey, propertyId };
}

export function cloudbedsErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: unknown; error?: unknown } | string | undefined;
    const detail =
      typeof data === "string"
        ? data
        : [data?.message, data?.error]
            .map((x) => (x != null ? String(x).trim() : ""))
            .filter(Boolean)
            .join(" ");

    return detail
      ? `${fallback}: Cloudbeds API error${status ? ` (${status})` : ""}: ${detail}`
      : `${fallback}: ${error.message}`;
  }

  return error instanceof Error ? `${fallback}: ${error.message}` : fallback;
}

export async function confirmCloudbedsReservation(reservationId: string) {
  return updateCloudbedsReservationStatus(reservationId, "confirmed");
}

export async function cancelCloudbedsReservation(reservationId: string) {
  return updateCloudbedsReservationStatus(
    reservationId,
    process.env.CLOUDBEDS_CANCEL_STATUS || "canceled"
  );
}

async function updateCloudbedsReservationStatus(reservationId: string, status: string) {
  const cleanReservationId = reservationId.trim();
  if (!cleanReservationId) {
    throw new Error("Reservation ID is required");
  }
  const cleanStatus = status.trim();
  if (!cleanStatus) {
    throw new Error("Reservation status is required");
  }

  const { apiKey, propertyId } = getCloudbedsCredentials();
  const payload = qs.stringify({
    propertyID: propertyId,
    reservationID: cleanReservationId,
    status: cleanStatus,
  });

  const response = await axios.put(
    `${CLOUDBEDS_API_BASE}/putReservation`,
    payload,
    {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.data?.success) {
    throw new Error(response.data?.message || `Failed to update reservation status to ${cleanStatus}`);
  }

  return {
    success: true,
    reservationId: cleanReservationId,
    status: cleanStatus,
  };
}
