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
      "http://localhost:3005/auth/verify",
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
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    // En cas d'erreur (401 ou autre), redirige vers la page de login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Permettre l'accès si l'utilisateur est admin
  return NextResponse.next();
}

export const config = {
  matcher: "/admin",
};
