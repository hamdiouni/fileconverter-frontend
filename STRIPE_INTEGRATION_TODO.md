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

### 1. Environment Variables Setup

Ensure your `.env` files contain matching variables:

#### In `backend/.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
```

#### In `converter-main/.env.local` (Frontend):
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. How the Integration Works

```
[Customer on /pricing]
       │
       ▼ (Clicks "Upgrade to Pro")
[Frontend: components/pricing/pricing-plans.tsx]
       │
       ▼ POST /api/v1/billing/checkout-session { priceId, successUrl, cancelUrl }
[API Gateway -> Billing Service: billing.service.ts]
       │
       ▼ stripe.checkout.sessions.create(sessionParams)
[Stripe Hosted Checkout Page]
       │
       ├─► Customer pays -> Redirects to /dashboard?checkout=success
       │
       ▼ Webhook: customer.subscription.created
[Billing Service: handleWebhook()]
       │
       ▼ Upserts subscription in PostgreSQL database and updates tier
```

### 3. Testing with Test Cards

Stripe provides standard test card numbers for test mode:
- **Card number:** `4242 4242 4242 4242`
- **Expiration date:** Any future date (e.g. `12/34`)
- **CVC:** Any 3 digits (e.g. `123`)
- **Postal code:** Any postal code (e.g. `10001`)

For 3D Secure and SCA authentication tests, refer to:
https://stripe.com/docs/testing#regulatory-cards

### 4. Local Webhook Testing with Stripe CLI

To test webhook events locally against the Docker billing service:
```bash
stripe listen --forward-to http://localhost/api/v1/billing/webhook
```
Copy the webhook signing secret output by the command (starts with `whsec_`) and set it as `STRIPE_WEBHOOK_SECRET` in your `backend/.env`.

### 5. Production Next Steps
1. Create real Products and Prices in the [Stripe Dashboard](https://dashboard.stripe.com/products).
2. Configure live API keys (`sk_live_...`, `pk_live_...`).
3. Add your production webhook endpoint in [Stripe Webhooks Dashboard](https://dashboard.stripe.com/workbench/webhooks) pointing to:
   `https://api.yourdomain.com/api/v1/billing/webhook`
   with events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

---

## Resources
- [Stripe Checkout Documentation](https://docs.stripe.com/checkout)
- [Stripe Customer Support](https://support.stripe.com)
- [Stripe MCP Tools](https://docs.stripe.com/mcp)
