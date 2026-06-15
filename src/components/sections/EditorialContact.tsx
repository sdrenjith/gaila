import { ContactForm } from "@/components/site/ContactForm";
import { getSiteSettings } from "@/lib/cms";

type Props = {
  title?: string;
  subtitle?: string;
};

export async function EditorialContact({ title, subtitle }: Props) {
  const settings = await getSiteSettings();
  return (
    <section className="relative bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[0.45fr_0.55fr]">
        <div>
          {title && (
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-5 max-w-md text-[15px] leading-8 text-[var(--ink-soft)]">{subtitle}</p>
          )}
          <dl className="mt-10 space-y-6 border-t border-[var(--hairline-strong)] pt-8 text-sm">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
                Studio
              </dt>
              <dd className="mt-2 text-[var(--ink)]">{settings.contact.address}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="border-b border-[var(--hairline-strong)] pb-0.5 text-[var(--ink)] hover:border-[var(--ink)]"
                >
                  {settings.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--ink-mute)]">
                Phone
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${settings.contact.phone}`}
                  className="border-b border-[var(--hairline-strong)] pb-0.5 text-[var(--ink)] hover:border-[var(--ink)]"
                >
                  {settings.contact.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
