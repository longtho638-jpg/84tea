"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function FranchiseForm() {
  const t = useTranslations("Franchise.Form");

  return (
    <section id="register-form" className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-surface border border-outline-variant rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Info Side */}
          <div className="md:w-2/5 bg-primary text-on-primary p-12 flex flex-col justify-between">
            <div>
              <Typography variant="headline-medium" className="font-display mb-6">
                {t("title")}
              </Typography>
              <Typography variant="body-medium" className="mb-8 text-on-primary">
                {t("description")}
              </Typography>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-rounded text-secondary-container text-2xl" aria-hidden="true">phone_in_talk</span>
                  <div>
                    <Typography variant="title-small" className="font-bold block mb-1">{t("contact.hotline")}</Typography>
                    <Typography variant="body-medium">+84 988 030 204</Typography>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-rounded text-secondary-container text-2xl" aria-hidden="true">mail</span>
                  <div>
                    <Typography variant="title-small" className="font-bold block mb-1">{t("contact.email")}</Typography>
                    <Typography variant="body-medium">franchise@84tea.vn</Typography>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-rounded text-secondary-container text-2xl" aria-hidden="true">location_on</span>
                  <div>
                    <Typography variant="title-small" className="font-bold block mb-1">{t("contact.office")}</Typography>
                    <Typography variant="body-medium">{t("contact.officeAddress")}</Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
               <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4">
                 <span className="material-symbols-rounded text-3xl text-on-secondary-container" aria-hidden="true">chat</span>
               </div>
               <Typography variant="body-small" className="italic text-on-primary">
                 {t("quote")}
               </Typography>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:w-3/5 p-12 bg-surface">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("fields.name")}</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder={t("fields.namePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("fields.phone")}</Label>
                  <Input
                    type="tel"
                    id="phone"
                    placeholder={t("fields.phonePlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("fields.email")}</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder={t("fields.emailPlaceholder")}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="area">{t("fields.area")}</Label>
                  <Select id="area" defaultValue="">
                    <option value="" disabled>{t("fields.areaPlaceholder")}</option>
                    <option value="hanoi">{t("fields.areas.hanoi")}</option>
                    <option value="hcm">{t("fields.areas.hcm")}</option>
                    <option value="danang">{t("fields.areas.danang")}</option>
                    <option value="other">{t("fields.areas.other")}</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">{t("fields.budget")}</Label>
                  <Select id="budget" defaultValue="">
                    <option value="" disabled>{t("fields.budgetPlaceholder")}</option>
                    <option value="under-500">{t("fields.budgets.under500")}</option>
                    <option value="500-1b">{t("fields.budgets.500to1b")}</option>
                    <option value="over-1b">{t("fields.budgets.over1b")}</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("fields.model")}</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
                    <input type="radio" name="model" value="kiosk" className="text-primary focus:ring-primary accent-primary w-4 h-4" />
                    <span className="text-on-surface text-sm font-medium">Kiosk</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
                    <input type="radio" name="model" value="express" className="text-primary focus:ring-primary accent-primary w-4 h-4" />
                    <span className="text-on-surface text-sm font-medium">Express</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
                    <input type="radio" name="model" value="lounge" className="text-primary focus:ring-primary accent-primary w-4 h-4" />
                    <span className="text-on-surface text-sm font-medium">Lounge</span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" variant="filled" size="lg" className="w-full bg-secondary text-on-secondary hover:bg-secondary/90">
                  {t("submit")}
                </Button>
                <p className="text-xs text-on-surface-variant text-center mt-3">
                  {t("disclaimer")}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
