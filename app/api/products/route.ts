import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { productMenus } from '@/db/schema';
import { isNull } from 'drizzle-orm';

// Legacy route: redirect consumers to /api/product-menus
export async function GET() {
  try {
    const data = await db
      .select({ id: productMenus.id, name: productMenus.name, category: productMenus.category })
      .from(productMenus)
      .where(isNull(productMenus.deletedAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
