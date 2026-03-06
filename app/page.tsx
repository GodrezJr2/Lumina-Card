import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    icon: "qr_code_scanner",
    title: "QR Check-In App",
    desc: "Scan tamu dalam hitungan detik. Bekerja offline, sinkron otomatis saat online kembali.",
  },
  {
    icon: "send",
    title: "WhatsApp Blast",
    desc: "Kirim undangan digital langsung ke WhatsApp tamu dengan satu klik. Template bisa dikustomisasi.",
  },
  {
    icon: "bar_chart",
    title: "Real-time Analytics",
    desc: "Pantau RSVP, check-in, dan kehadiran secara live dari dashboard yang intuitif.",
  },
  {
    icon: "palette",
    title: "Template Undangan",
    desc: "Pilihan desain premium untuk pernikahan, wisuda, gala dinner, dan acara korporat.",
  },
  {
    icon: "how_to_reg",
    title: "RSVP Online",
    desc: "Tamu konfirmasi kehadiran langsung dari undangan digital tanpa perlu aplikasi tambahan.",
  },
  {
    icon: "lock",
    title: "Aman & Terpercaya",
    desc: "Data tamu dienkripsi dan dilindungi. SSL & GDPR compliant di semua paket.",
  },
];

const PRICING = [
  {
    name: "Basic",
    price: "Rp 299K",
    per: "/event",
    desc: "Untuk acara kecil & intimate.",
    highlight: false,
    cta: "Pilih Basic",
    ctaStyle:
      "bg-slate-50 border border-slate-200 text-navy hover:border-navy hover:bg-white",
    features: ["QR Code Check-in", "Real-time Guest Sync", "1 Akun Staff", "Hingga 200 tamu", "Email Support"],
    featureColor: "text-gold",
  },
  {
    name: "Professional",
    price: "Rp 799K",
    per: "/event",
    desc: "Solusi lengkap untuk pernikahan.",
    highlight: true,
    cta: "Pilih Professional",
    ctaStyle: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30",
    features: ["Semua fitur Basic", "Unlimited Staff", "Hingga 1.000 tamu", "WA Blast Sender", "Analytics Dashboard", "Priority Support 24/7"],
    featureColor: "text-primary",
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    desc: "Untuk event berskala besar.",
    highlight: false,
    cta: "Hubungi Kami",
    ctaStyle: "bg-navy text-white hover:bg-navy-light shadow-md",
    features: ["Semua fitur Pro", "White-label App", "API & Integrasi", "Account Manager Khusus", "Custom SLA"],
    featureColor: "text-gold",
  },
];


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light text-text-main font-display">

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6">
        {/* Dot grid */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-7">
            <span className="w-fit rounded-full bg-gold/10 border border-gold/30 px-4 py-1.5 text-xs font-bold text-gold uppercase tracking-widest">
              #1 Platform Manajemen Tamu Pernikahan
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-navy leading-tight">
              Undangan Digital &amp;{" "}
              <span className="text-gold">Absensi Cerdas</span>{" "}
              dalam Satu Platform
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
              Buat undangan cantik, kirim via WhatsApp, kelola RSVP, dan scan check-in tamu di hari H — semua dari satu dashboard yang mudah digunakan.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/admin/login"
                className="px-8 py-3.5 rounded-full bg-navy text-white font-bold text-base hover:bg-navy-light transition-all shadow-xl shadow-navy/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg leading-none">rocket_launch</span>
                Mulai Gratis
              </Link>
              <Link
                href="/catalog"
                className="px-8 py-3.5 rounded-full border-2 border-navy/20 text-navy font-bold text-base hover:border-navy hover:bg-white transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg leading-none">grid_view</span>
                Lihat Template
              </Link>
            </div>
            <p className="text-sm text-text-secondary/60 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-gold">verified</span>
              Dipercaya 10.000+ penyelenggara acara di Indonesia
            </p>
          </div>

          {/* Right — mock invite card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-10 -right-10 size-72 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 size-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative rounded-3xl shadow-2xl shadow-navy/15 overflow-hidden border border-white bg-white">
                <div className="h-2 bg-gradient-to-r from-gold via-yellow-300 to-gold" />
                <div className="p-8 text-center space-y-4">
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase text-text-secondary">
                    Undangan Pernikahan
                  </p>
                  <div className="relative h-52 rounded-2xl overflow-hidden">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-4mI6sHS7NKDDzVAEvMbt66Jok4I-K97uR-LYGQkJ1S8vkDnaGfK5pKV-_pfnSj1TNgE4k1wC0wtTqswpJ_wqDTW7fBNV4xnx7keQ-w_e4MLwOUuubYvMDsFGto8I0At8sdp-MopvPbVnUCzpGZQSkT1Lf6PKPbxjRotRgNZfv56_qehR0AQl8tF-1Dk1qS-0_OsgM0Nj343wMTwTXEJoE4lR3SwVXsNooIUPWozyftnNfsC0FOyrX64tiCOa-kCHUCtWqAG0E0-"
                      alt="Wedding invitation preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-navy">Andi &amp; Sari</h3>
                    <p className="text-xs text-text-secondary mt-1">Sabtu, 12 April 2026 · Ballroom Grand Hyatt</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 bg-navy text-white text-xs font-bold rounded-xl">RSVP Sekarang</button>
                    <button className="px-4 py-2.5 bg-slate-100 text-navy text-xs font-bold rounded-xl flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm leading-none">qr_code_2</span>
                      QR
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-gradient-to-r from-gold via-yellow-300 to-gold" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── LOGO BAR ───── */}
      <div className="border-y border-navy/10 bg-white py-8">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-xs font-bold text-text-secondary/50 uppercase tracking-[0.2em] mb-6">
            Dipercaya oleh penyelenggara event terbaik
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-50">
            {["Grand Hyatt", "Shangri-La", "AYANA Resort", "Four Seasons", "The Ritz-Carlton"].map((b) => (
              <span key={b} className="text-lg font-black text-navy tracking-tight">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ───── FEATURES ───── */}
      <section id="features" className="py-24 px-6 bg-background-light">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-navy mb-4">Semua yang Kamu Butuhkan</h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Dari undangan hingga check-in — satu platform untuk seluruh perjalanan event-mu.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-navy/[0.08] shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 group"
              >
                <div className="size-12 rounded-xl bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center text-navy group-hover:text-gold transition-all mb-5">
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-navy/[0.08]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-navy mb-4">Harga Transparan</h2>
            <p className="text-lg text-text-secondary">Bayar per event, tanpa biaya langganan bulanan tersembunyi.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlight
                    ? "border-2 border-gold shadow-2xl shadow-gold/10 md:-translate-y-4 z-10 bg-white"
                    : "border border-navy/10 shadow-sm hover:shadow-xl hover:border-gold/30 bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-white text-xs font-bold px-4 py-1.5 rounded-full shadow uppercase tracking-wider">
                      Paling Populer
                    </span>
                  </div>
                )}
                <div className="mb-6 mt-2">
                  <h3 className="text-xl font-bold text-navy mb-1">{plan.name}</h3>
                  <p className="text-sm text-text-secondary">{plan.desc}</p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className={`font-extrabold text-navy ${plan.highlight ? "text-5xl" : "text-4xl"}`}>{plan.price}</span>
                  {plan.per && <span className="text-text-secondary font-medium">{plan.per}</span>}
                </div>
                <Link
                  href="/pricing"
                  className={`w-full text-center font-bold py-3.5 rounded-xl transition-all mb-8 block text-sm ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
                <div className="flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-text-main">
                      <span className={`material-symbols-outlined text-[20px] shrink-0 ${plan.featureColor}`}>check_circle</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-navy font-bold text-sm hover:text-gold transition-colors"
            >
              Lihat perbandingan lengkap semua fitur
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── CTA BANNER ───── */}
      <section className="relative bg-navy py-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 size-64 bg-primary/20 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative max-w-[800px] mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-5">
            Siap membuat event yang tak terlupakan?
          </h2>
          <p className="text-slate-300 mb-10 text-lg leading-relaxed max-w-xl mx-auto">
            Bergabung bersama ribuan penyelenggara event yang sudah menggunakan Lumina Card untuk check-in yang mulus dan undangan yang memukau.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/login"
              className="bg-gold text-white font-bold px-8 py-3.5 rounded-full hover:bg-gold-hover transition-all shadow-xl shadow-gold/20"
            >
              Mulai Gratis Sekarang
            </Link>
            <Link
              href="/pricing"
              className="bg-transparent border border-white/30 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Lihat Harga Lengkap
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-white border-t border-navy/10 py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-gold text-2xl">celebration</span>
                <span className="font-bold text-lg text-navy">Lumina Card</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Platform manajemen tamu &amp; undangan digital terbaik untuk pernikahan dan acara profesional di Indonesia.
              </p>
            </div>
            {[
              {
                title: "Produk",
                links: [
                  { label: "Fitur", href: "/#features" },
                  { label: "Harga", href: "/pricing" },
                  { label: "Template", href: "/catalog" },
                  { label: "API", href: "#" },
                ],
              },
              {
                title: "Perusahaan",
                links: [
                  { label: "Tentang Kami", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Karir", href: "#" },
                  { label: "Kontak", href: "#" },
                ],
              },
              {
                title: "Bantuan",
                links: [
                  { label: "Pusat Bantuan", href: "#" },
                  { label: "Panduan", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-bold text-navy mb-5">{title}</h4>
                <ul className="space-y-3 text-sm text-text-secondary">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="hover:text-navy transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-navy/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
            <p>© 2026 Lumina Card. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-gold transition-colors">
                <span className="material-symbols-outlined text-xl">public</span>
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <span className="material-symbols-outlined text-xl">group</span>
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
