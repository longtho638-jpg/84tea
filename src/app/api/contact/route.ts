import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { contactSchema } from "@/lib/validation";
import { limiter, getClientIP } from "@/lib/rate-limit";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function POST(request: Request) {
  try {
    try {
      await limiter.check(10, `contact:${getClientIP(request)}`);
    } catch (error) {
      console.error("Rate limit exceeded for contact form:", error);
      return NextResponse.json(
        { error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu liên hệ không hợp lệ", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    if (error) {
      console.error("Supabase error submitting contact message:", error);
      return NextResponse.json(
        { error: "Không thể gửi tin nhắn. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in contact form:", error);
    return NextResponse.json(
      { error: "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
