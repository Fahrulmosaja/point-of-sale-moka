import { NextRequest } from 'next/server';
import { ProductMenuService } from '@/features/product-menus/service';
import { withErrorHandler } from '@/lib/api-handler';

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  return await ProductMenuService.updateProductMenu(id, body);
});

export const DELETE = withErrorHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return await ProductMenuService.deleteProductMenu(id);
});
