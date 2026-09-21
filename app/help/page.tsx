import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileType, HardDrive, Code2, User, CreditCard } from 'lucide-react';

export const metadata: Metadata = { title: 'Help & FAQ - FileConverter Pro' };

const faqs = [
  {
    icon: Upload,
    question: 'How do I convert a file?',
    answer:
      'Upload your file by dragging it onto the converter or clicking "Choose File". Select your desired output format from the dropdown, then click "Convert". Your file will be ready to download within seconds.',
  },
  {
    icon: FileType,
    question: 'What formats are supported?',
    answer:
      'We support 200+ formats across documents (PDF, DOCX, ODT), images (PNG, JPG, WEBP, SVG), audio (MP3, WAV, FLAC), video (MP4, MOV, AVI), and archives (ZIP, TAR, 7Z). See the full list on our formats page.',
  },
  {
    icon: HardDrive,
    question: 'What is the file size limit?',
    answer:
      'Free accounts can upload files up to 100 MB. Pro accounts support up to 2 GB per file. Enterprise accounts have custom limits — contact us for details.',
  },
  {
    icon: Code2,
    question: 'How do I use the API?',
    answer:
      'Generate an API key in your dashboard under Settings → API Keys. Use the REST API with your key in the Authorization header. Full documentation with code examples is available at /docs/api.',
  },
  {
    icon: User,
    question: 'How do I manage my account?',
    answer:
      'Visit your dashboard to update your profile, change your password, manage your subscription, view conversion history, and download invoices. Two-factor authentication can be enabled in Security Settings.',
  },
  {
    icon: CreditCard,
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual enterprise plans. All payments are securely processed by Stripe.',
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 border-b bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & FAQ</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find quick answers to the most common questions about FileConverter Pro.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map(({ icon: Icon, question, answer }) => (
            <Card key={question} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">{question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center rounded-xl border bg-muted/40 p-8">
          <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-4">Our support team is available Monday – Friday, 9 am – 6 pm UTC.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
