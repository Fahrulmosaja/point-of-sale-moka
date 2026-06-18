import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";

type AppRouteHandler = (
  req: NextRequest,
  context: any
) => Promise<NextResponse | any> | NextResponse | any;

export function withErrorHandler(handler: AppRouteHandler) {
  return async (req: NextRequest, context: any) => {
    try {
      const result = await handler(req, context);
      
      // If the result is already a Response (NextResponse), return it directly
      if (result instanceof Response) {
        return result;
      }
      
      // Otherwise, wrap it in a successful JSON response if it's not a Response object
      return NextResponse.json(result);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation Error", details: error.issues },
          { status: 400 }
        );
      }

      const message = error instanceof Error ? error.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
