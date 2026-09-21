import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cookie Policy - FileConverter Pro' };

const sections = [
  ['What Are Cookies?', 'Cookies are small text files stored on your device by your browser when you visit a website. They allow us to recognise your device, remember your preferences, and provide a personalised experience.'],
  ['Necessary Cookies', 'These cookies are essential for the website to function and cannot be disabled. They include session identifiers, authentication tokens, and CSRF protection tokens. No personally identifiable information is stored in these cookies.'],
  ['Analytics Cookies', 'With your consent, we use anonymised analytics cookies to understand how visitors interact with our service — which pages are visited, how long sessions last, and where users come from. This data is aggregated and cannot identify you personally.'],
  ['Preference Cookies', 'We store your preferences (such as dark/light theme and language selection) in cookies so they persist across sessions. These are optional but improve your experience significantly.'],
  ['How to Control Cookies', 'You can control or delete cookies through your browser settings at any time. Blocking necessary cookies will prevent the service from functioning correctly. Most browsers also support "Do Not Track" signals, which we honour for analytics cookies.'],
  ['Third-Party Cookies', 'Our payment processor (Stripe) and analytics provider may set their own cookies subject to their privacy policies. We do not control these cookies. Please review their respective policies for details.'],
  ['Contact', 'Questions about our cookie usage? Email privacy@fileconverterpro.com and we will respond within 5 business days.'],
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 border-b bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">Last updated: January 1, 2025</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-10">
          {sections.map(([title, body]) => (
            <div key={title} className="border-b pb-8 last:border-0">
              <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
              <p className="text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
