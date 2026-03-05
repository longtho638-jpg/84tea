"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface Feature {
    icon: string;
    title: string;
    description: string;
    href: string;
    status: "live" | "coming-soon";
    tier: "A" | "B" | "C";
}

export function FeatureShowcase() {
    const features: Feature[] = [
        // === LIVE Features (Gói A) ===
        {
            icon: "storefront",
            title: "Cửa hàng Trà Xanh",
            description: "Danh mục sản phẩm, bộ lọc, chi tiết sản phẩm, hình ảnh HD",
            href: "/products",
            status: "live",
            tier: "A",
        },
        {
            icon: "shopping_cart",
            title: "Giỏ hàng & Thanh toán",
            description: "Cart drawer, checkout PayOS VietQR, xác nhận đơn hàng",
            href: "/checkout",
            status: "live",
            tier: "A",
        },
        {
            icon: "info",
            title: "Giới thiệu thương hiệu",
            description: "Câu chuyện 84 Tea, giá trị cốt lõi, đội ngũ sáng lập",
            href: "/about",
            status: "live",
            tier: "A",
        },
        {
            icon: "mail",
            title: "Liên hệ & Hotline",
            description: "Form liên hệ, bản đồ, Zalo, Facebook Messenger",
            href: "/contact",
            status: "live",
            tier: "A",
        },
        {
            icon: "translate",
            title: "Song ngữ Việt-Anh",
            description: "Chuyển đổi ngôn ngữ mượt mà, SEO đa ngôn ngữ",
            href: "/",
            status: "live",
            tier: "A",
        },
        {
            icon: "security",
            title: "Bảo mật Enterprise",
            description: "CSP + HSTS + Rate Limit + Zod validation + RLS",
            href: "/",
            status: "live",
            tier: "A",
        },

        // === COMING SOON Features (Gói B/C) ===
        {
            icon: "store",
            title: "Franchise Pipeline",
            description: "Hệ thống nhượng quyền tự động, form đăng ký, pipeline quản lý",
            href: "/franchise",
            status: "coming-soon",
            tier: "B",
        },
        {
            icon: "groups",
            title: "Tea Club Membership",
            description: "CLB thưởng trà, tích điểm, ưu đãi thành viên VIP",
            href: "/club",
            status: "coming-soon",
            tier: "B",
        },
        {
            icon: "school",
            title: "Training Modules",
            description: "E-Learning tích hợp, module đào tạo nhân viên, quiz & chứng chỉ",
            href: "/training",
            status: "coming-soon",
            tier: "C",
        },
        {
            icon: "dashboard",
            title: "Ops Dashboard & SOP",
            description: "KPI tracking, daily checklist, quy trình chuẩn số hóa",
            href: "/ops",
            status: "coming-soon",
            tier: "C",
        },
        {
            icon: "analytics",
            title: "SEO Audit & Analytics",
            description: "Google Analytics 4, Facebook Pixel, báo cáo SEO tự động",
            href: "/",
            status: "coming-soon",
            tier: "C",
        },
        {
            icon: "install_mobile",
            title: "PWA Premium",
            description: "Cài website như app native, push notification, offline mode",
            href: "/",
            status: "coming-soon",
            tier: "C",
        },
    ];

    const liveFeatures = features.filter((f) => f.status === "live");
    const comingSoonFeatures = features.filter((f) => f.status === "coming-soon");

    return (
        <section className="py-20 bg-surface-container">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-3">
                        Tất cả tính năng trong hệ thống
                    </h2>
                    <p className="text-on-surface-variant max-w-2xl mx-auto">
                        Gói Diamond Launch bao gồm toàn bộ tính năng — từ cửa hàng đến franchise & training
                    </p>
                </div>

                {/* LIVE Features */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="inline-block w-3 h-3 rounded-full bg-tertiary animate-pulse" />
                        <span className="text-lg font-semibold text-on-surface">Đang hoạt động</span>
                        <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-medium">
                            {liveFeatures.length} tính năng
                        </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveFeatures.map((feature) => (
                            <Link key={feature.title} href={feature.href}>
                                <div className="h-full p-5 bg-surface rounded-2xl shadow-sm hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-rounded text-on-primary-container text-2xl">
                                                {feature.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-on-surface text-sm">
                                                    {feature.title}
                                                </span>
                                                <span className="text-[10px] bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider flex-shrink-0">
                                                    Live
                                                </span>
                                            </div>
                                            <p className="text-xs text-on-surface-variant">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* COMING SOON Features */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="inline-block w-3 h-3 rounded-full bg-secondary" />
                        <span className="text-lg font-semibold text-on-surface">Sắp ra mắt</span>
                        <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-medium">
                            Gói B & C
                        </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {comingSoonFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                onClick={() =>
                                    alert(
                                        `"${feature.title}" sẽ được kích hoạt trong ${feature.tier === "B" ? "Gói B (Managed Repo — $3,500)" : "Gói C (Diamond Launch — $5,000)"
                                        }. Liên hệ để nâng cấp!`
                                    )
                                }
                                className="cursor-pointer"
                            >
                                <div
                                    className={cn(
                                        "h-full p-5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                        "hover:-translate-y-1 hover:shadow-md",
                                        "border-2 border-dashed border-outline-variant hover:border-secondary bg-surface/50"
                                    )}
                                >
                                    <div className="absolute top-3 right-3 z-10">
                                        <span
                                            className={cn(
                                                "text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider",
                                                feature.tier === "B"
                                                    ? "bg-secondary-container text-on-secondary-container"
                                                    : "bg-primary text-on-primary"
                                            )}
                                        >
                                            {feature.tier === "B" ? "Gói B" : "Gói C ★"}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center flex-shrink-0 opacity-60">
                                            <span className="material-symbols-rounded text-on-surface-variant text-2xl">
                                                {feature.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0 pr-12">
                                            <span className="font-semibold text-on-surface text-sm block mb-1">
                                                {feature.title}
                                            </span>
                                            <p className="text-xs text-on-surface-variant">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upgrade CTA */}
                    <div className="mt-10 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border border-outline-variant">
                        <h3 className="text-lg font-semibold text-on-surface mb-2">
                            🍵 Muốn kích hoạt tất cả tính năng?
                        </h3>
                        <p className="text-on-surface-variant mb-4">
                            Gói Diamond Launch ($5,000) bao gồm toàn bộ 12 tính năng + Franchise + Training + 90 ngày bảo hành
                        </p>
                        <Link href="/contact">
                            <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg">
                                Liên hệ tư vấn ngay →
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
