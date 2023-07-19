import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { client } from "@/lib/client-instance";
import { StorageItems } from "@/enums";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const response = NextResponse.redirect(`${process.env.BASE_URL}/sign-in`);

  try {
    await client.post("/users/verify_email", { email, token });
    response.cookies.set(StorageItems.EMAIL_VERIFIED, `${email},200`, {
      maxAge: 5,
    });
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        response.cookies.set(StorageItems.EMAIL_VERIFIED, `${email},401`, {
          maxAge: 5,
        });
        return response;
      }
    }
    response.cookies.set(StorageItems.EMAIL_VERIFIED, `${email},500`, {
      maxAge: 5,
    });
    return response;
  }
}
