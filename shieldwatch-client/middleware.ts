// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Si pas de token, redirige vers la page de login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Vérifie les permissions en envoyant le token au backend
    const response = await axios.post(
      "http://gateway-service:3005/auth/verify",
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${req.cookies.get("token")?.value}`,
        },
      },
    );

    // Si l'utilisateur n'est pas admin, redirige vers la page de login
    if (response.data.user.role !== "admin") {
      const redirectResponse = NextResponse.redirect(
        new URL("/login", req.url),
      );

      redirectResponse.headers.set("x-middleware-cache", "no-cache");

      return redirectResponse;
    } else {
      console.log("User is admin !");

      return NextResponse.next();
    }
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Permettre l'accès si l'utilisateur est admin
  return NextResponse.next();
}

export const config = {
  matcher: "/admin",
};
