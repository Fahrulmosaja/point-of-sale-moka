import { NextRequest } from "next/server";
import { RawMaterialService } from "@/features/inventory/api/raw-material-service";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return await RawMaterialService.getRawMaterialById(id);
});

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  return await RawMaterialService.updateRawMaterial(id, body);
});

export const DELETE = withErrorHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return await RawMaterialService.deleteRawMaterial(id);
});
