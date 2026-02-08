import {
  orderSchema,
  contactSchema,
  franchiseInquirySchema,
  productSchema,
  paymentLinkSchema,
  webhookSchema,
} from './validation';

describe('orderSchema', () => {
  const validOrder = {
    items: [
      { productId: 'p1', name: 'Trà Shan Tuyết', quantity: 2, price: 350000 },
    ],
    total: 700000,
    customerInfo: {
      name: 'Nguyen Van A',
      phone: '0901234567',
      address: '123 Nguyen Hue, Q1',
      city: 'Ho Chi Minh',
    },
  };

  it('accepts a valid order', () => {
    const result = orderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('accepts order with optional fields', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customerInfo: {
        ...validOrder.customerInfo,
        email: 'test@example.com',
        note: 'Giao buoi chieu',
      },
      paymentMethod: 'payos',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty items array', () => {
    const result = orderSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      items: [{ productId: 'p1', name: 'Tea', quantity: 1, price: -100 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects quantity 0', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      items: [{ productId: 'p1', name: 'Tea', quantity: 0, price: 100000 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects short customer name', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customerInfo: { ...validOrder.customerInfo, name: 'A' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects short phone', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customerInfo: { ...validOrder.customerInfo, phone: '123' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects short address', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customerInfo: { ...validOrder.customerInfo, address: '123' },
    });
    expect(result.success).toBe(false);
  });

  it('accepts item with id instead of productId', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      items: [{ id: 'p1', name: 'Tea', quantity: 1, price: 100000 }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty email (allows empty string)', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customerInfo: { ...validOrder.customerInfo, email: '' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customerInfo: { ...validOrder.customerInfo, email: 'not-email' },
    });
    expect(result.success).toBe(false);
  });
});

describe('contactSchema', () => {
  const validContact = {
    name: 'Nguyen Van B',
    email: 'test@example.com',
    message: 'Toi muon hoi ve san pham tra co thu',
    subject: 'general' as const,
  };

  it('accepts valid contact', () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it('accepts all valid subject types', () => {
    const subjects = ['general', 'order', 'wholesale', 'franchise', 'partnership', 'feedback', 'support'] as const;
    for (const subject of subjects) {
      expect(contactSchema.safeParse({ ...validContact, subject }).success).toBe(true);
    }
  });

  it('rejects invalid subject', () => {
    expect(contactSchema.safeParse({ ...validContact, subject: 'invalid' }).success).toBe(false);
  });

  it('rejects short message', () => {
    expect(contactSchema.safeParse({ ...validContact, message: 'Hi' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(contactSchema.safeParse({ ...validContact, email: 'bad' }).success).toBe(false);
  });

  it('accepts optional phone in correct format', () => {
    expect(contactSchema.safeParse({ ...validContact, phone: '0901234567' }).success).toBe(true);
  });

  it('rejects phone with wrong format', () => {
    expect(contactSchema.safeParse({ ...validContact, phone: '123' }).success).toBe(false);
  });
});

describe('productSchema', () => {
  const validProduct = {
    name: 'Trà Shan Tuyết',
    price: 350000,
    category: 'tra-co-thu',
  };

  it('accepts valid product', () => {
    expect(productSchema.safeParse(validProduct).success).toBe(true);
  });

  it('accepts product with all optional fields', () => {
    const result = productSchema.safeParse({
      ...validProduct,
      name_en: 'Shan Tuyet Tea',
      description: 'Trà cổ thụ Shan Tuyết',
      description_en: 'Ancient Shan Tuyet tea',
      image_url: 'https://example.com/tea.jpg',
      weight: '200g',
      origin: 'Hà Giang',
      in_stock: true,
      featured: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative price', () => {
    expect(productSchema.safeParse({ ...validProduct, price: -1 }).success).toBe(false);
  });

  it('rejects price exceeding max', () => {
    expect(productSchema.safeParse({ ...validProduct, price: 200_000_000 }).success).toBe(false);
  });

  it('defaults in_stock to true', () => {
    const result = productSchema.parse(validProduct);
    expect(result.in_stock).toBe(true);
  });

  it('defaults featured to false', () => {
    const result = productSchema.parse(validProduct);
    expect(result.featured).toBe(false);
  });
});

describe('paymentLinkSchema', () => {
  const validPaymentLink = {
    orderCode: 1234567890,
    description: 'Don hang 84tea',
    returnUrl: 'https://84tea.com/success',
    cancelUrl: 'https://84tea.com/cancel',
    items: [{ name: 'Trà Shan Tuyết', quantity: 2, price: 350000 }],
  };

  it('accepts valid payment link', () => {
    expect(paymentLinkSchema.safeParse(validPaymentLink).success).toBe(true);
  });

  it('accepts with buyer info', () => {
    const result = paymentLinkSchema.safeParse({
      ...validPaymentLink,
      buyerName: 'Nguyen Van A',
      buyerPhone: '0901234567',
      buyerEmail: 'test@example.com',
      buyerAddress: '123 Nguyen Hue',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-positive orderCode', () => {
    expect(paymentLinkSchema.safeParse({ ...validPaymentLink, orderCode: 0 }).success).toBe(false);
    expect(paymentLinkSchema.safeParse({ ...validPaymentLink, orderCode: -1 }).success).toBe(false);
  });

  it('rejects non-integer orderCode', () => {
    expect(paymentLinkSchema.safeParse({ ...validPaymentLink, orderCode: 1.5 }).success).toBe(false);
  });

  it('rejects invalid returnUrl', () => {
    expect(paymentLinkSchema.safeParse({ ...validPaymentLink, returnUrl: 'not-url' }).success).toBe(false);
  });

  it('rejects empty items', () => {
    expect(paymentLinkSchema.safeParse({ ...validPaymentLink, items: [] }).success).toBe(false);
  });
});

describe('webhookSchema', () => {
  const validWebhook = {
    code: '00',
    desc: 'Success',
    data: {
      orderCode: 1234567890,
      amount: 700000,
      description: 'Don hang 84tea',
    },
    signature: 'abc123signature',
  };

  it('accepts valid webhook payload', () => {
    expect(webhookSchema.safeParse(validWebhook).success).toBe(true);
  });

  it('accepts webhook with all optional data fields', () => {
    const result = webhookSchema.safeParse({
      ...validWebhook,
      data: {
        ...validWebhook.data,
        accountNumber: '123456',
        reference: 'ref123',
        transactionDateTime: '2026-02-08T10:00:00Z',
        paymentLinkId: 'pl123',
        counterAccountBankId: null,
        counterAccountBankName: null,
        counterAccountName: null,
        counterAccountNumber: null,
        virtualAccountName: null,
        virtualAccountNumber: null,
        currency: 'VND',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing signature', () => {
    const { signature: _, ...noSig } = validWebhook;
    expect(webhookSchema.safeParse(noSig).success).toBe(false);
  });

  it('rejects missing data.orderCode', () => {
    const { orderCode: _, ...noOrderCode } = validWebhook.data;
    expect(webhookSchema.safeParse({ ...validWebhook, data: noOrderCode }).success).toBe(false);
  });

  it('rejects missing data.amount', () => {
    const { amount: _, ...noAmount } = validWebhook.data;
    expect(webhookSchema.safeParse({ ...validWebhook, data: noAmount }).success).toBe(false);
  });

  it('passes through unknown data fields', () => {
    const result = webhookSchema.safeParse({
      ...validWebhook,
      data: { ...validWebhook.data, customField: 'value' },
    });
    expect(result.success).toBe(true);
  });
});

describe('franchiseInquirySchema', () => {
  const validInquiry = {
    personalInfo: {
      name: 'Nguyen Van C',
      email: 'franchise@example.com',
      phone: '0901234567',
    },
    businessInfo: {
      city: 'Ha Noi',
      investmentBudget: 'under-500m' as const,
      experience: 'none' as const,
    },
  };

  it('accepts valid inquiry', () => {
    expect(franchiseInquirySchema.safeParse(validInquiry).success).toBe(true);
  });

  it('accepts all budget options', () => {
    const budgets = ['under-500m', '500m-1b', '1b-2b', 'over-2b'] as const;
    for (const budget of budgets) {
      const result = franchiseInquirySchema.safeParse({
        ...validInquiry,
        businessInfo: { ...validInquiry.businessInfo, investmentBudget: budget },
      });
      expect(result.success).toBe(true);
    }
  });

  it('accepts all experience levels', () => {
    const levels = ['none', 'some', 'extensive'] as const;
    for (const exp of levels) {
      const result = franchiseInquirySchema.safeParse({
        ...validInquiry,
        businessInfo: { ...validInquiry.businessInfo, experience: exp },
      });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid budget', () => {
    const result = franchiseInquirySchema.safeParse({
      ...validInquiry,
      businessInfo: { ...validInquiry.businessInfo, investmentBudget: 'invalid' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone format', () => {
    const result = franchiseInquirySchema.safeParse({
      ...validInquiry,
      personalInfo: { ...validInquiry.personalInfo, phone: '123' },
    });
    expect(result.success).toBe(false);
  });
});
