import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { limiter, getClientIP } from "@/lib/rate-limit";
import { z } from "zod";

const franchiseApplySchema = z.object({
  fullName: z.string().min(2).max(100),
  idNumber: z.string().min(9).max(12),
  birthDate: z.string().min(1),
  email: z.string().email().max(255),
  phone: z.string().regex(/^[0-9]{10,11}$/),
  currentAddress: z.string().min(5).max(500),
  fbExperience: z.string().max(50).optional(),
  managementExperience: z.string().max(50).optional(),
  availableCapital: z.string().min(1).max(50),
  currentOccupation: z.string().max(200).optional(),
  preferredLocation: z.string().max(500).optional(),
  city: z.string().min(1).max(100),
  spaceSize: z.string().max(50).optional(),
  expectedOpenDate: z.string().max(50).optional(),
  motivation: z.string().max(2000).optional(),
});

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function POST(request: Request) {
  try {
    try {
      await limiter.check(5, `franchise:${getClientIP(request)}`);
    } catch {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = franchiseApplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
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
      console.error("Franchise apply error:", error.message);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Franchise apply API error:", message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
