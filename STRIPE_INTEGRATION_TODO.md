# Stripe Integration — Setup & Next Steps

This document is the single source of truth for the Stripe Checkout integration and remaining configuration steps.

---

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**
- [backend/services/billing-service/src/services/billing.service.ts](backend/services/billing-service/src/services/billing.service.ts)
- [backend/.env.example](backend/.env.example)
- [components/pricing/pricing-plans.tsx](components/pricing/pricing-plans.tsx)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| `line_items[].price` | `priceId` (defaults to `price_pro_mock` / `price_business_mock`) | Your actual Stripe recurring Price ID from the Dashboard (https://dashboard.stripe.com/prices) or API (e.g. `price_1P...`). |
| `STRIPE_SECRET_KEY` | `sk_test_replace_with_real_key` / `sk_test_mock` | Your secret API key from the Stripe Dashboard (https://dashboard.stripe.com/test/apikeys). |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_replace_with_real_key` | Your publishable API key from the Stripe Dashboard. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_replace_with_real_secret` / `whsec_mock_secret` | Your webhook signing secret from Stripe CLI or Dashboard (https://dashboard.stripe.com/workbench/webhooks). |

---

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly in the Checkout Session creation call.

**Files containing these parameters:**
- [backend/services/billing-service/src/services/billing.service.ts](backend/services/billing-service/src/services/billing.service.ts)

| Parameter | Value | Description |
|-----------|-------|-------------|
| `ui_mode` | `"hosted_page"` | Hosted Stripe checkout page (SDK ≥21.0.0; if using SDK <21.0.0, use `"hosted"`). |
| `mode` | `"subscription"` | Recurring subscription billing for Pro and Business plans. |
| `billing_address_collection` | `"auto"` | Automatically collects billing address if needed. |
| `phone_number_collection` | `{ "enabled": false }` | Phone number collection disabled. |
| `automatic_tax` | `{ "enabled": false }` | Automatic tax calculation disabled. |
| `allow_promotion_codes` | `true` | Allows customers to enter promotion / coupon codes at checkout. |
| `payment_method_collection` | `"always"` | Always collect payment method for subscriptions. |
| `submit_type` | `"auto"` | Automatic submit button text based on context. |
| `saved_payment_method_options` | `{ "payment_method_save": "enabled" }` | Enables saving payment method for future reuse. |
| `integration_identifier` | `"hosted_web_0001"` | Fixed studio integration identifier. |
| `origin_context` | `"web"` | Checkout initiated from web application. |
| `line_items` | `[{ price: priceId, quantity: 1 }]` | Subscribes user to selected plan price ID. |
| `success_url` | `successUrl` (dynamic: `${origin}/dashboard?checkout=success`) | Post-payment success page URL. |
| `cancel_url` | `cancelUrl` (dynamic: `${origin}/pricing`) | Return page URL when customer cancels. |

---

## Setup and Next Steps

## Environment Variables Setup

Configure your `backend/.env` with your Stripe credentials and Price IDs:

```env
# Stripe API Keys (Dashboard -> Developers -> API keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Webhook Secret (Dashboard -> Developers -> Webhooks -> Signing secret)
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (Generated via automated script or Dashboard)
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_YEARLY=price_...
```

For frontend (`.env.local` or Vercel environment variables):
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY=price_...
```

---

## Automated Product & Price Provisioning

An automated setup script is available in the backend to create all 4 Products and recurring Prices in 5 seconds:

```bash
cd backend
npm run stripe:setup -- <YOUR_STRIPE_SECRET_KEY> --update-env
```

Or using Node directly:
```bash
node scripts/setup-stripe-products.js <YOUR_STRIPE_SECRET_KEY> --update-env
```

This automatically:
1. Creates `FileConverter Free` ($0 tier)
2. Creates `FileConverter Pro` with:
   - Monthly: $29.00 USD/mo
   - Yearly: $290.00 USD/yr (2 months free discount)
3. Creates `FileConverter Business` with:
   - Monthly: $99.00 USD/mo
   - Yearly: $990.00 USD/yr (2 months free discount)
4. Creates `FileConverter Enterprise` (Custom tier)
5. Automatically writes `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PRICE_BUSINESS_MONTHLY`, `STRIPE_PRICE_BUSINESS_YEARLY` into `backend/.env`.

---

## Stripe Webhook Setup

1. Open **Stripe Dashboard** -> **Developers** -> **Webhooks** (or https://dashboard.stripe.com/webhooks).
2. Click **Add destination** / **Add endpoint**.
3. Set **Endpoint URL**:
   ```
   https://api.yourdomain.com/api/v1/billing/webhook
   ```
4. Select the following **3 events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   *(Optional for invoices: `invoice.payment_succeeded`, `invoice.payment_failed`)*
5. Click **Add endpoint**.
6. Reveal the **Signing secret** (starts with `whsec_`) and set it as `STRIPE_WEBHOOK_SECRET` in `backend/.env`.

---

## Testing with Test Cards

Stripe provides standard test card numbers for test mode:
- **Card number:** `4242 4242 4242 4242`
- **Expiration date:** Any future date (e.g. `12/34`)
- **CVC:** Any 3 digits (e.g. `123`)
- **Postal code:** Any postal code (e.g. `10001`)

For 3D Secure and SCA authentication tests, refer to:
https://stripe.com/docs/testing#regulatory-cards

---

## Resources
- [Stripe Checkout Documentation](https://docs.stripe.com/checkout)
- [Stripe Customer Support](https://support.stripe.com)
- [Stripe MCP Tools](https://docs.stripe.com/mcp)
