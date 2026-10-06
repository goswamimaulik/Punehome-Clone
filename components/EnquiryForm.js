'use client';
import { useState } from 'react';

export default function EnquiryForm({ projectId, title = 'Enquire now' }) {
  const [s, setS] = useState({});
  const [state, setState] = useState('idle');
  const on = (k) => (e) => setS({ ...s, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState('loading');
    const r = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, project: projectId }),
    });
    setState(r.ok ? 'done' : 'error');
  }

  if (state === 'done') return <div className="card p-5 text-green-700">Thank you! Our team will contact you shortly.</div>;
  return (
    <form onSubmit={submit} className="card space-y-3 p-5">
      <h3 className="font-semibold">{title}</h3>
      <input required className="input" placeholder="Your name" onChange={on('name')} />
      <input required className="input" placeholder="Phone number" inputMode="tel" onChange={on('phone')} />
      <input type="email" className="input" placeholder="Email (optional)" onChange={on('email')} />
      <textarea className="input" rows={3} placeholder="Message (optional)" onChange={on('message')} />
      {state === 'error' && <p className="text-sm text-red-600">Please enter a valid name and 10-digit phone number.</p>}
      <button className="btn w-full" disabled={state === 'loading'}>{state === 'loading' ? 'Sending…' : 'Send enquiry'}</button>
    </form>
  );
}
