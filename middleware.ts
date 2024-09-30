import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

let ratelimit: Ratelimit;

if (process.env.NEXT_PUBLIC_ENABLE_AUTH === "true") {
  if (!process.env.RATE_LIMIT_REQUESTS || !process.env.RATE_LIMIT_WINDOW) {
    throw new Error("RATE_LIMIT_REQUESTS and RATE_LIMIT_WINDOW must be set");
  }
  ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(
      parseInt(process.env.RATE_LIMIT_REQUESTS),
      process.env.RATE_LIMIT_WINDOW as Parameters<
        typeof Ratelimit.slidingWindow
      >[1],
    ),
  });
}

export const config = {
  matcher: ["/api/llmchat/chat/completions", "/api/ixcoach/chat/completions"],
};

export default async function middleware(request: NextRequest) {
   console.log('middleware',middleware);

   const token = request.cookies.get('token')?.value;
   console.log('token',token);

  // If no token exists, proceed with the request
  if (!token) {
    return NextResponse.next();
  }

  // If a token exists, validate it
  const isValid = await validateToken(token);
  console.log("isValid",isValid);

  if (!isValid) {
    // If the token is invalid, delete the 'token' cookie and return an unauthorized response
      const response =  NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    
    return response;
  }else {
     return NextResponse.next();
  }


  }

  async function validateToken(token: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_IX_API_URL}auth/validateToken`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        console.log('Response headers:', Array.from(response.headers.entries()));

        if (!response.ok) {
            console.log('Response not okay:', response.statusText);
            return { isValid: false };
        }

        // Since the response is plain text, not JSON
        const data = await response.text(); // Use response.text() instead of response.json()
        console.log('Response data:', data);

        // Assuming the API returns "OK" for valid and something else for invalid
        return data === "OK";
    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
}