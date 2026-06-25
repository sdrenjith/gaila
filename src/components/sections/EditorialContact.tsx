import { ContactForm } from "@/components/site/ContactForm";
import { getSiteSettings } from "@/lib/cms";

type Props = {
  title?: string;
  subtitle?: string;
};

export async function EditorialContact({ title, subtitle }: Props) {
  const settings = await getSiteSettings();
  return (
    <section className="relative bg-transparent px-5 editorial-section-padding sm:px-8 lg:px-14">
      <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[0.45fr_0.55fr]">
        <div>
          {title && (
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-5 max-w-md text-base leading-8 text-white/80">{subtitle}</p>
          )}
          <dl className="mt-10 space-y-6 border-t border-[var(--hairline-strong)] pt-8">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/80 sm:text-sm">
                Studio
              </dt>
              <dd className="mt-2.5 text-base leading-7 text-white/90">{settings.contact.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/80 sm:text-sm">
                Email
              </dt>
              <dd className="mt-2.5">
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="border-b border-white/20 pb-0.5 text-base text-white/90 transition hover:border-[var(--event-cyan)] hover:text-[var(--event-cyan)]"
                >
                  {settings.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/80 sm:text-sm">
                Phone
              </dt>
              <dd className="mt-2.5">
                <a
                  href={`tel:${settings.contact.phone}`}
                  className="border-b border-white/20 pb-0.5 text-base text-white/90 transition hover:border-[var(--event-cyan)] hover:text-[var(--event-cyan)]"
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
