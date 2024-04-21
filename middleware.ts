import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";

const intlMiddlware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "tr"],

  // Used when no locale matches
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  await updateSession(request);

  return intlMiddlware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/(de|en)/:path*",
  ],
};
