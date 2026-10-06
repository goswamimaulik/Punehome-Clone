import EnquiryForm from '@/components/EnquiryForm';
import { SITE } from '@/lib/site';

export const metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-10 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold">Contact us</h1>
        <p className="mt-4">{SITE.address}</p>
        <p className="mt-1">{SITE.email}</p>
        <p className="mt-1">{SITE.phone}</p>
      </div>
      <EnquiryForm title="Talk to an expert" />
    </div>
  );
}
