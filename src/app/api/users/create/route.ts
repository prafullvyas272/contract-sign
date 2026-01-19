import { type NextRequest, NextResponse } from "next/server";
import { findOrCreateUser } from "@/server/controller/users";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { email, name, password, role } = await req.json();

  try {
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ message: "Missing required fields" });
    }

    // Call utility to find or create the user
    const user = await findOrCreateUser({
      email,
      name,
      password,
      role,
    });
    
    if(user?.isExistingUser) {
      return NextResponse.json({ message: "Email already exists" });  
    }
    return NextResponse.json({
      message: "OTP sent to your email",
      success: true,
      data: { isExistingUser: user?.isExistingUser },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export { handler as POST };
