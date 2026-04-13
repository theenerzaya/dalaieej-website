import { NextRequest, NextResponse } from "next/server";
import { cloudbedsGet } from "@/lib/cloudbeds";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkin = searchParams.get("checkin");
    const checkout = searchParams.get("checkout");
    const roomTypeId = searchParams.get("roomTypeId");

    const params: Record<string, string> = {};
    if (checkin) params.startDate = checkin;
    if (checkout) params.endDate = checkout;
    if (roomTypeId) params.roomTypeID = roomTypeId;

    const itemsData = await cloudbedsGet<any>("/getItems", params);

    console.log("Cloudbeds items response:", JSON.stringify(itemsData, null, 2));

    if (!itemsData?.success || !itemsData?.data) {
      return NextResponse.json({
        success: true,
        addons: [],
      });
    }

    const items = Array.isArray(itemsData.data) ? itemsData.data : [];
    
    const addons = items
      .map((item: any) => ({
        id: item.itemID || item.id,
        name: item.itemName || item.name,
        description: item.itemDescription || item.description || "",
        price: parseFloat(item.itemPrice || item.price || 0),
        currency: item.currency || "MNT",
        priceType: item.priceType || "per_stay",
        category: item.itemCategory || item.category || "other",
        image: item.itemImage || item.image || null,
        maxQuantity: parseInt(item.maxQuantity || 10),
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
