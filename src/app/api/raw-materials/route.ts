import { NextRequest } from "next/server";
import { RawMaterialService } from "@/features/inventory/api/raw-material-service";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async () => {
  return await RawMaterialService.getRawMaterials();
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  return await RawMaterialService.createRawMaterial(body);
});
