import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { server } from "@/lib/server-instance";
import { StorageItems } from "@/enums";
import { logger } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams, host, protocol } = new URL(req.url);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const response = NextResponse.redirect(`${protocol}//${host}/sign-in`);

  try {
    await server.post("/users/verify_email", { email, token });
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
    logger("VerifyEmail", error);
    return response;
  }
}
