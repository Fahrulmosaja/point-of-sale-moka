import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { rawMaterials } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [material] = await db
      .select()
      .from(rawMaterials)
      .where(eq(rawMaterials.id, id));
    if (!material)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(material);
  } catch (err) {
    console.error("[GET /api/raw-materials/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch raw material" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, category, unit, currentStock, minimumStock, isActive } = body;

    await db
      .update(rawMaterials)
      .set({
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(unit !== undefined && { unit }),
        ...(currentStock !== undefined && {
          currentStock: String(currentStock),
        }),
        ...(minimumStock !== undefined && {
          minimumStock: String(minimumStock),
        }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(rawMaterials.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/raw-materials/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update raw material" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // Soft delete
    await db
      .update(rawMaterials)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(rawMaterials.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/raw-materials/[id]]", err);
    return NextResponse.json(
      { error: "Failed to delete raw material" },
      { status: 500 },
    );
  }
}
