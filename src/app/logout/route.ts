import { StorageItems } from "@/enums";
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(`${process.env.BASE_URL}/sign-in`);

  response.cookies.set(StorageItems.AUTH_TOKEN, "", { maxAge: 0 });
  return response;
}
