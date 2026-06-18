import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { productMenus } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, category, price, recipeId, imageUrl, isActive, isFavorite } = body;

    await db.update(productMenus).set({
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category }),
      ...(price !== undefined && { price: String(price) }),
      ...(recipeId !== undefined && { recipeId }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isActive !== undefined && { isActive }),
      ...(isFavorite !== undefined && { isFavorite }),
      updatedAt: new Date(),
    }).where(eq(productMenus.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/product-menus/[id]]', err);
    return NextResponse.json({ error: 'Failed to update product menu' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.update(productMenus).set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(productMenus.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/product-menus/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete product menu' }, { status: 500 });
  }
}
