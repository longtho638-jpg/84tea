import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { limiter, getClientIP } from "@/lib/rate-limit";
import { franchiseApplySchema } from "@/lib/validation";
import { logger } from "@/lib/logger";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: Request) {
  try {
    try {
      await limiter.check(5, `franchise:${getClientIP(request)}`);
    } catch (error) {
      logger.error("Rate limit exceeded for franchise application:", error);
      return NextResponse.json(
        { error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = franchiseApplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu đăng ký không hợp lệ", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const locationParts = [data.city, data.preferredLocation].filter(Boolean);

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("franchise_applications").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      location: locationParts.join(", "),
      investment_range: data.availableCapital,
      message: JSON.stringify({
        idNumber: data.idNumber,
        birthDate: data.birthDate,
        currentAddress: data.currentAddress,
        fbExperience: data.fbExperience,
        managementExperience: data.managementExperience,
        currentOccupation: data.currentOccupation,
        spaceSize: data.spaceSize,
        expectedOpenDate: data.expectedOpenDate,
        motivation: data.motivation,
      }),
    });

    if (error) {
      logger.error("Supabase error submitting franchise application:", error);
      return NextResponse.json(
        { error: "Không thể gửi đơn đăng ký. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Unexpected error in franchise application:", error);
    return NextResponse.json(
      { error: "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
