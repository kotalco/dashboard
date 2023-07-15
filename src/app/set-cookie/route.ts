import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, value } = await req.json();

  const response = NextResponse.json({ setCookie: true });

  response.cookies.set(name, value);
  return response;
}
