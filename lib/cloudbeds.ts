import axios from "axios";

const CLOUDBEDS_API_BASE = "https://hotels.cloudbeds.com/api/v1.2";

export async function cloudbedsGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const apiKey = process.env.CLOUDBEDS_API_KEY;
  const propertyId = process.env.CLOUDBEDS_PROPERTY_ID;

  if (!apiKey) {
    throw new Error("Cloudbeds API key not configured. Please set CLOUDBEDS_API_KEY.");
  }

  if (!propertyId) {
    throw new Error("Cloudbeds property ID not configured. Please set CLOUDBEDS_PROPERTY_ID.");
  }

  const url = new URL(`${CLOUDBEDS_API_BASE}${endpoint}`);
  url.searchParams.set("propertyID", propertyId);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  try {
    const response = await axios.get<T>(url.toString(), {
      headers: {
        "x-api-key": apiKey,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      if (status === 401) {
        throw new Error("Cloudbeds API key is invalid. Please check CLOUDBEDS_API_KEY.");
      }
      throw new Error(`Cloudbeds API error (${status}): ${message}`);
    }
    throw error;
  }
}

export interface RoomType {
  roomTypeID: string;
  roomTypeName: string;
  roomTypeDescription: string;
  maxGuests: number;
  adultsIncluded: number;
  childrenIncluded: number;
  roomTypePhotos: string[];
  roomTypeFeatures: string[];
  roomRate?: number;
  roomRateCurrency?: string;
}

export interface RoomRate {
  roomTypeID: string;
  roomTypeName: string;
  roomsAvailable: number;
  rateID: string;
  rateName: string;
  totalRate: number;
  currency: string;
}

export interface RoomTypesResponse {
  success: boolean;
  data: RoomType[];
}

export interface AvailabilityResponse {
  success: boolean;
  data: {
    propertyID: string;
    startDate: string;
    endDate: string;
    roomTypes: RoomRate[];
  };
}
