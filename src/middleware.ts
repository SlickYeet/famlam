export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/u/:path*", "/admin/:path*"],
};
