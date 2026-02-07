import { generatePageMetadata } from "@/lib/metadata";
import Module1Content from "./module-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Hardcoded title/desc for now as these are specific to Module 1 and might not be in general messages
  const title = locale === 'vi' ? "Module 1: Văn Hóa & Thương Hiệu" : "Module 1: Brand & Culture";
  const desc = locale === 'vi' ? "Tìm hiểu về lịch sử, giá trị và sứ mệnh của 84tea" : "Learn about 84tea history, values and mission";

  return generatePageMetadata({
    title,
    description: desc,
    path: "/training/module-1",
    locale,
    type: "article",
  });
}

export default function Module1Page() {
  return <Module1Content />;
}
