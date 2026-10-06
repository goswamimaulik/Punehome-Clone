'use client';
import { useState } from 'react';

export default function Emi() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const r = rate / 12 / 100, n = years * 12;
  const emi = r ? (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : amount / n;
  const total = emi * n;
  const inr = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Home Loan EMI Calculator</h1>
      <div className="card space-y-4 p-5">
        <div><label className="label">Loan amount (₹)</label><input type="number" className="input" value={amount} onChange={(e) => setAmount(+e.target.value)} /></div>
        <div><label className="label">Interest rate (% per year)</label><input type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(+e.target.value)} /></div>
        <div><label className="label">Tenure (years)</label><input type="number" className="input" value={years} onChange={(e) => setYears(+e.target.value)} /></div>
      </div>
      <div className="card mt-4 grid grid-cols-3 gap-3 p-5 text-center">
        <div><p className="text-xs text-slate-500">Monthly EMI</p><p className="text-lg font-bold text-brand">{inr(emi)}</p></div>
        <div><p className="text-xs text-slate-500">Total interest</p><p className="text-lg font-bold">{inr(total - amount)}</p></div>
        <div><p className="text-xs text-slate-500">Total payment</p><p className="text-lg font-bold">{inr(total)}</p></div>
      </div>
    </div>
  );
}
