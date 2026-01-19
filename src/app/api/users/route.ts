import { type NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    return NextResponse.json({ message: "Hello World" });
  } catch (error) {
    return NextResponse.json({
      error: "Database query failed",
      message: error,
    });
  }
};

export { handler as GET };
