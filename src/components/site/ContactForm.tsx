"use client";

import { useActionState } from "react";
import { submitLead, type LeadActionState } from "@/app/actions/public";

const initialState: LeadActionState = { ok: false, message: "" };

const fieldClass =
  "w-full border-0 border-b border-[var(--hairline-strong)] bg-transparent px-0 py-3 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-mute)] focus:border-[var(--ink)]";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  return (
    <form action={formAction} className="grid gap-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
          Name
          <input name="name" required placeholder="Your name" className={fieldClass} />
        </label>
        <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
          Email
          <input name="email" type="email" required placeholder="you@brand.com" className={fieldClass} />
        </label>
        <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
          Phone
          <input name="phone" placeholder="+971 …" className={fieldClass} />
        </label>
        <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
          Service
          <select name="service" className={fieldClass}>
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
      <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
        Company
        <input name="company" placeholder="Brand or company" className={fieldClass} />
      </label>
      <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
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
          className="group inline-flex items-center gap-3 self-start rounded-full bg-[var(--ink)] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--ink-soft)] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send enquiry"}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? "text-[var(--gold-deep)]" : "text-red-600"}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}
