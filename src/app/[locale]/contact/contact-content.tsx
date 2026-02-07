'use client';

import { useState } from "react";
import { HeaderNavigation, FooterSection } from "@/components/layout";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function ContactContent() {
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with form backend (e.g., Formspree, custom API)
    alert(t('Form.success'));
  };

  const contactInfo = [
    {
      icon: "📍",
      title: t('Info.address'),
      content: "134 Nguyễn Hoàng Tôn, Phú Thượng, Tây Hồ, Hà Nội",
    },
    {
      icon: "📱",
      title: t('Info.phone'),
      content: "+84 988 030 204",
      link: "tel:+84988030204",
    },
    {
      icon: "📧",
      title: t('Info.email'),
      content: "hello@84tea.com",
      link: "mailto:hello@84tea.com",
    },
    {
      icon: "⏰",
      title: t('Info.hours'),
      content: t('Info.hoursValue'),
    },
  ];

  const quickLinks = [
    { label: t('QuickLinks.franchise'), href: "/franchise" },
    { label: t('QuickLinks.products'), href: "/products" },
    { label: t('QuickLinks.about'), href: "/about" },
    { label: t('QuickLinks.shipping'), href: "/shipping" },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeaderNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Typography
              variant="label-large"
              className="text-primary uppercase tracking-[0.3em] mb-4 block"
            >
              {t('Hero.label')}
            </Typography>
            <Typography
              variant="display-medium"
              className="text-on-surface mb-6 font-bold"
            >
              {t('Hero.title')} <span className="text-primary">84tea</span>
            </Typography>
            <Typography
              variant="body-large"
              className="text-on-surface-variant text-lg max-w-2xl mx-auto"
            >
              {t('Hero.desc')}
            </Typography>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div className="space-y-12">
                <div>
                  <Typography
                    variant="headline-medium"
                    className="text-primary mb-8 font-bold"
                  >
                    {t('Info.title')}
                  </Typography>

                  <div className="space-y-6">
                    {contactInfo.map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                        <div>
                          <Typography
                            variant="title-medium"
                            className="text-on-surface font-bold mb-1"
                          >
                            {item.title}
                          </Typography>
                          {item.link ? (
                            <a
                              href={item.link}
                              className="text-on-surface-variant hover:text-primary transition-colors block"
                            >
                              <Typography variant="body-medium">
                                {item.content}
                              </Typography>
                            </a>
                          ) : (
                            <Typography
                              variant="body-medium"
                              className="text-on-surface-variant"
                            >
                              {item.content}
                            </Typography>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <Typography
                    variant="title-medium"
                    className="text-on-surface font-bold mb-4"
                  >
                    {t('Social.title')}
                  </Typography>
                  <div className="flex gap-4">
                    {[
                      { icon: "📘", label: "Facebook", href: "#" },
                      { icon: "📸", label: "Instagram", href: "#" },
                      { icon: "🎵", label: "TikTok", href: "#" },
                      { icon: "📺", label: "YouTube", href: "#" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                        title={social.label}
                      >
                        <span className="text-xl">{social.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="p-6 bg-surface-container rounded-2xl border border-outline-variant">
                  <Typography
                    variant="title-medium"
                    className="text-on-surface font-bold mb-4"
                  >
                    {t('QuickLinks.title')}
                  </Typography>
                  <div className="grid grid-cols-2 gap-4">
                    {quickLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-primary hover:text-secondary transition-colors font-medium flex items-center gap-1"
                      >
                        → {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="shadow-xl border-none bg-surface">
                  <CardHeader>
                    <CardTitle className="text-primary text-2xl">
                      {t('Form.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('Form.name')} *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder={t('Form.placeholders.name')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('Form.phone')}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder={t('Form.placeholders.phone')}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t('Form.email')} *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder={t('Form.placeholders.email')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{t('Form.subject')}</Label>
                        <Select
                          id="subject"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                        >
                          <option value="general">{t('Form.subjects.general')}</option>
                          <option value="order">{t('Form.subjects.order')}</option>
                          <option value="wholesale">{t('Form.subjects.wholesale')}</option>
                          <option value="franchise">{t('Form.subjects.franchise')}</option>
                          <option value="partnership">{t('Form.subjects.partnership')}</option>
                          <option value="feedback">{t('Form.subjects.feedback')}</option>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t('Form.message')} *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          placeholder={t('Form.placeholders.message')}
                          className="resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="filled"
                        size="lg"
                        className="w-full"
                      >
                        {t('Form.submit')}
                      </Button>

                      <Typography
                        variant="body-small"
                        className="text-center text-on-surface-variant block"
                      >
                        {t('Form.note')}
                      </Typography>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-surface-container">
          <div className="max-w-7xl mx-auto px-6">
            <div className="aspect-[21/9] bg-primary-container rounded-3xl flex items-center justify-center border border-outline-variant">
              <div className="text-center">
                <span className="text-6xl mb-4 block">📍</span>
                <Typography
                  variant="body-large"
                  className="text-on-surface-variant"
                >
                  {t('Map.address')}
                </Typography>
                <a
                  href="https://maps.google.com/?q=134+Nguyen+Hoang+Ton,+Phu+Thuong,+Tay+Ho,+Ha+Noi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-primary hover:text-secondary transition-colors font-medium"
                >
                  {t('Map.link')} →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
