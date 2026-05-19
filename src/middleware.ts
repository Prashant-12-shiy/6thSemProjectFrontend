import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import routes from "./config/routes";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.clone();
  const userRole = req.cookies.get("role")?.value;

  if (
    (!token && url.pathname.startsWith(routes.superAdmin))  ||
    (!token && url.pathname.startsWith(routes.teacher)) ||
    (!token && url.pathname.startsWith(routes.student))
  ) {
    url.pathname = routes.home;
    return NextResponse.redirect(url);
  }

  if (userRole === "Teacher" && (url.pathname.startsWith(routes.superAdmin) || url.pathname.startsWith(routes.student))) {
    url.pathname = routes.teacher;
    return NextResponse.redirect(url);
  }
  
  if (userRole === "Student" && (url.pathname.startsWith(routes.superAdmin) || url.pathname.startsWith(routes.teacher))) {
    url.pathname = routes.student;
    return NextResponse.redirect(url);
  }

  if (token && url.pathname === "/") {
    if (userRole === "SuperAdmin") {
      url.pathname = routes.superAdmin;
      return NextResponse.redirect(url);
    } else if (userRole === "Teacher") {
      url.pathname = routes.teacher;
      return NextResponse.redirect(url);
    } else if (userRole === "Student") {
      url.pathname = routes.student;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
        "/superadmin/:path*",
        "/teacher/:path*",
        "/students/:path*",
        "/",
    ],
};
