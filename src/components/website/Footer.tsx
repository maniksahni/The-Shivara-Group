import Link from "next/link";

// ─── Social icon helpers ───────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Footer Component ─────────────────────────────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F1B2D] text-white">
      {/* Thin gold top border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* ── Main footer grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo + tagline */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-[#C9A84C]"
                >
                  <path d="M19 2H9a2 2 0 00-2 2v3H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm-7 17H9v-2h3v2zm0-4H9v-2h3v2zm0-4H9v-2h3v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V9h4v2zm0-4H9V4h9v3z" />
                </svg>
              </div>
              <div>
                <span className="block font-[family-name:var(--font-playfair)] font-bold text-lg text-[#C9A84C]">
                  The Shivara Group
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-white/50">
                  Premium Real Estate
                </span>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Bespoke real estate strategies across Bareilly and Delhi NCR —
              defining legacies, one address at a time.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/theshivaragroup"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="
                  flex items-center justify-center w-9 h-9 rounded-full
                  bg-white/10 text-white/70
                  hover:bg-[#C9A84C] hover:text-white
                  transition-all duration-300
                "
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="
                  flex items-center justify-center w-9 h-9 rounded-full
                  bg-white/10 text-white/70
                  hover:bg-[#C9A84C] hover:text-white
                  transition-all duration-300
                "
              >
                <FacebookIcon />
              </a>
              <a
                href="https://wa.me/917060788407"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="
                  flex items-center justify-center w-9 h-9 rounded-full
                  bg-white/10 text-white/70
                  hover:bg-[#25D366] hover:text-white
                  transition-all duration-300
                "
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[#C9A84C] mb-5 flex items-center gap-2">
              <span className="block w-5 h-0.5 bg-[#C9A84C]" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Properties", href: "/properties" },
                { label: "Contact Us", href: "/contact" },
                { label: "Book a Site Visit", href: "/contact#site-visit" },
                { label: "CRM Login", href: "/crm/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      text-sm text-white/60
                      hover:text-[#C9A84C]
                      transition-colors duration-200
                      flex items-center gap-2
                      group
                    "
                  >
                    <span className="block w-0 group-hover:w-3 h-0.5 bg-[#C9A84C] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[#C9A84C] mb-5 flex items-center gap-2">
              <span className="block w-5 h-0.5 bg-[#C9A84C]" />
              Contact Info
            </h3>
            <ul className="space-y-4">
              {/* Address */}
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-[#C9A84C] mt-0.5 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-white/60 leading-relaxed">
                  Bareilly,
                  <br />
                  Uttar Pradesh
                  <br />
                  Full address: Manual completion required
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-[#C9A84C] flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href="tel:+917060788407"
                  className="text-sm text-white/60 hover:text-[#C9A84C] transition-colors duration-200"
                >
                  +91 7060788407
                </a>
              </li>

              {/* WhatsApp */}
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-[#25D366] flex-shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <a
                  href="https://wa.me/917060788407"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-[#25D366] transition-colors duration-200"
                >
                  WhatsApp: +91 7060788407
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-[#C9A84C] flex-shrink-0"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <a
                  href="https://www.instagram.com/theshivaragroup"
                  className="text-sm text-white/60 hover:text-[#C9A84C] transition-colors duration-200"
                >
                  @theshivaragroup
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Office Hours */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[#C9A84C] mb-5 flex items-center gap-2">
              <span className="block w-5 h-0.5 bg-[#C9A84C]" />
              Office Hours
            </h3>
            <ul className="space-y-3">
              {[
                { day: "Working Hours", hours: "Manual completion required" },
                { day: "Site Visits", hours: "By appointment" },
                { day: "Instagram", hours: "@theshivaragroup" },
              ].map((item) => (
                <li key={item.day} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-[#C9A84C]/80 uppercase tracking-wider">
                    {item.day}
                  </span>
                  <span className="text-sm text-white/60">{item.hours}</span>
                </li>
              ))}
            </ul>

            {/* Book site visit CTA */}
            <Link
              href="/contact#site-visit"
              className="
                mt-6 inline-flex items-center gap-2
                px-4 py-2.5
                bg-[#C9A84C] text-[#0F1B2D]
                text-sm font-semibold rounded-lg
                hover:bg-[#b8953d]
                transition-colors duration-300
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                  clipRule="evenodd"
                />
              </svg>
              Book Site Visit
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center md:text-left">
            © {currentYear} The Shivara Group. All rights reserved. | Bareilly,
            Uttar Pradesh.
          </p>
          <p className="text-xs text-white/30 text-center">
            Bespoke Real Estate Strategies
          </p>
        </div>
      </div>
    </footer>
  );
}
