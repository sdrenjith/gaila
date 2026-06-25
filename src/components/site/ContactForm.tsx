"use client";

import { useActionState } from "react";
import { submitLead, type LeadActionState } from "@/app/actions/public";

const initialState: LeadActionState = { ok: false, message: "" };

const labelClass =
  "grid gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/80 sm:text-sm";

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-base text-white outline-none backdrop-blur-sm transition placeholder:text-white/50 focus:border-[var(--event-cyan)]/60 focus:bg-white/[0.08] focus:ring-2 focus:ring-[var(--event-cyan)]/30";

const selectClass = `${fieldClass} cursor-pointer appearance-none [&>option]:bg-[#180b35] [&>option]:py-2 [&>option]:text-white`;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  return (
    <form action={formAction} className="grid gap-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-6 sm:grid-cols-2">
        <label className={labelClass}>
          Name
          <input name="name" required placeholder="Your name" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" required placeholder="you@brand.com" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Phone
          <input name="phone" placeholder="+971 …" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Service
          <select name="service" className={selectClass}>
            <option value="">Choose a service</option>
            <option>Corporate Events</option>
            <option>Conferences &amp; Summits</option>
            <option>Weddings &amp; Celebrations</option>
            <option>Event Production &amp; AV</option>
            <option>Creative Direction &amp; Décor</option>
            <option>Venue Sourcing &amp; Logistics</option>
            <option>Full Event Management</option>
          </select>
        </label>
      </div>
      <label className={labelClass}>
        Company
        <input name="company" placeholder="Brand or company" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Message
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your event — date, guest count, venue, and goals…"
          className={`${fieldClass} resize-y`}
        />
      </label>
      <div className="flex flex-col gap-3 border-t border-[var(--hairline-strong)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 self-start rounded-full gold-gradient cta-shadow px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-inset ring-white/25 transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send enquiry"}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? "text-[var(--gold-light)]" : "text-red-400"}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}
