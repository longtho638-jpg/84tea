import '@testing-library/jest-dom'
import React from 'react'

// Mock next-intl for Jest tests - fully mocked without requireActual due to ESM issues
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string | number>) => {
    if (params) {
      let result = key
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v))
      })
      return result
    }
    return key
  },
  useLocale: () => 'vi',
  useMessages: () => ({}),
  useNow: () => new Date(),
  useTimeZone: () => 'Asia/Ho_Chi_Minh',
  useFormatter: () => ({
    number: (n: number) => n.toLocaleString(),
    dateTime: (d: Date) => d.toISOString(),
  }),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  IntlProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}))
