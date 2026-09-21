import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service - FileConverter Pro' };

const sections = [
  ['1. Acceptance of Terms', 'By accessing FileConverter Pro you agree to these terms. If you do not agree, please discontinue use immediately.'],
  ['2. Use of Service', 'You may use the service for lawful purposes only. Abuse, including uploading malicious files or attempting to circumvent limits, is strictly prohibited.'],
  ['3. User Accounts', 'You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.'],
  ['4. Payment Terms', 'Subscription fees are billed monthly or annually in advance. Refunds are handled case-by-case within 7 days of the charge.'],
  ['5. Privacy', 'Your use of the service is subject to our Privacy Policy, which is incorporated into these terms by reference.'],
  ['6. Intellectual Property', 'FileConverter Pro and its content are protected by copyright and other laws. You retain full ownership of files you upload and convert.'],
  ['7. Limitation of Liability', 'We are not liable for indirect, incidental, or consequential damages arising from your use of the service, to the maximum extent permitted by law.'],
  ['8. Termination', 'We may suspend or terminate accounts that violate these terms at our sole discretion, with or without prior notice.'],
  ['9. Changes to Terms', 'We may update these terms at any time. We will notify you of material changes. Continued use after changes constitutes acceptance.'],
  ['10. Contact', 'Questions about these terms? Email us at legal@fileconverterpro.com and we will respond within 5 business days.'],
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 border-b bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
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
