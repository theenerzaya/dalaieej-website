import { NextRequest, NextResponse } from "next/server";
import { cloudbedsGet, normalizeCloudbedsRoomTypeID } from "@/lib/cloudbeds";
import { parseCloudbedsMoney } from "@/lib/cloudbeds-money";

type CloudbedsAddonItem = {
  itemID?: string;
  id?: string;
  itemName?: string;
  name?: string;
  itemDescription?: string;
  description?: string;
  itemPrice?: number | string;
  price?: number | string;
  currency?: string;
  priceType?: string;
  itemCategory?: string;
  category?: string;
  itemImage?: string | null;
  image?: string | null;
  maxQuantity?: number | string;
};

type CloudbedsItemsResponse = {
  success?: boolean;
  data?: unknown;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkin = searchParams.get("checkin");
    const checkout = searchParams.get("checkout");
    const roomTypeId = searchParams.get("roomTypeId");

    const params: Record<string, string> = {};
    if (checkin) params.startDate = checkin;
    if (checkout) params.endDate = checkout;
    if (roomTypeId) params.roomTypeID = normalizeCloudbedsRoomTypeID(roomTypeId);

    const itemsData = await cloudbedsGet<CloudbedsItemsResponse>("/getItems", params);

    console.log("Cloudbeds items response:", JSON.stringify(itemsData, null, 2));

    if (!itemsData?.success || !itemsData?.data) {
      return NextResponse.json({
        success: true,
        addons: [],
      });
    }

    const items = Array.isArray(itemsData.data)
      ? (itemsData.data as CloudbedsAddonItem[])
      : [];
    
    const addons = items
      .map((item) => ({
        id: item.itemID || item.id,
        name: item.itemName || item.name,
        description: item.itemDescription || item.description || "",
        price: parseCloudbedsMoney(item.itemPrice ?? item.price),
        currency: item.currency || "MNT",
        priceType: item.priceType || "per_stay",
        category: item.itemCategory || item.category || "other",
        image: item.itemImage ?? item.image ?? null,
        maxQuantity: parseInt(String(item.maxQuantity ?? 10), 10),
      }));

    return NextResponse.json({
      success: true,
      addons,
    });
  } catch (error) {
    console.error("Cloudbeds add-ons error:", error);

    return NextResponse.json({
      success: true,
      addons: [],
    });
  }
}
