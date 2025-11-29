"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const givingStreams = [
  {
    title: "Tithes",
    description: "Returning the first 10% keeps our altars resourced.",
    image: "/giving.jpg",
  },
  {
    title: "Offerings",
    description: "Fuel outreaches, trainings, and care packages.",
    image: "/giving-1.png",
  },
  {
    title: "Projects",
    description: "Partner with building, media, and relief initiatives.",
    image: "/giving-2.jpg",
  },
];

const impactStats = [
  { label: "Families Supported", value: "480+" },
  { label: "Nations Reached", value: "12" },
  { label: "Live Broadcasts", value: "96" },
];

const transferDetails = [
  { label: "Bank", value: "Kingdom Trust" },
  { label: "Account Name", value: "Arise Deborah Global" },
  { label: "Account Number", value: "0000 1234 5678" },
  { label: "Swift / Routing", value: "KDTRUS33" },
];

const quickGive = [
  {
    title: "Give Online",
    description: "Secure card + bank transfers managed by our giving portal.",
    cta: "Launch Portal",
    href: "/give",
  },
  {
    title: "Text to Give",
    description: "Send ARISE + amount to +1 (202) 555-0110 to receive a link.",
    cta: "Text Instructions",
    href: "/contact",
  },
];

export default function GivingPage() {
  return (
    <div className="min-h-screen bg-[#0f0905] text-white pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#2b1b0f] via-[#3a1f0c] to-[#4a2108] p-10 text-white">
          <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-[#ffc94a]/20 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
          <div className="relative space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
              Fuel the movement
            </p>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <h1 className="text-4xl font-bold leading-snug">
                  Every seed becomes discipleship, relief, and revival rooms.
                </h1>
                <p className="text-white/80">
                  Your generosity keeps prayer hubs open, equips marketplace
                  women, and pushes gospel media into new cities weekly.
                </p>
              </div>
              <Link
                href="/give"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#FFC94A] hover:text-[#FFC94A]"
              >
                Give securely online →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4"
                >
                  <p className="text-3xl font-semibold text-[#FFC94A]">
                    {stat.value}
                  </p>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Streams */}
        <section className="mt-12 grid gap-8 md:grid-cols-2">
          {givingStreams.map((stream, index) => (
            <motion.div
              key={stream.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="relative h-60 w-full">
                <Image
                  src={stream.image}
                  alt={stream.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20" />
              </div>
              <div className="space-y-3 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  {index === 2 ? "Capital" : "Partnership"}
                </p>
                <h3 className="text-2xl font-semibold">{stream.title}</h3>
                <p className="text-white/80">{stream.description}</p>
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-dashed border-[#FFC94A]/40 bg-[#1a120a] p-8"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              recurring generosity
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              Set up monthly automation
            </h3>
            <p className="mt-3 text-white/70">
              Scheduling transfers helps us forecast outreaches, pastoral care,
              and scholar stipends with confidence.
            </p>
            <Link
              href="/give"
              className="mt-6 inline-flex items-center rounded-full bg-[#FFC94A] px-5 py-2 text-sm font-semibold text-black"
            >
              Start a recurring gift
            </Link>
          </motion.div>
        </section>

        {/* Giving Tools */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              bank transfer
            </p>
            <h3 className="mt-3 text-3xl font-semibold">Direct deposits</h3>
            <p className="mt-3 text-white/70">
              Send via your banking portal or branch with the verified details
              below. Add a memo so our team can tag the right fund.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {transferDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-2xl border border-white/10 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {detail.label}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {quickGive.map((method) => (
              <div
                key={method.title}
                className="rounded-3xl border border-white/10 bg-[#18100a] p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#FFC94A]">
                  Quick option
                </p>
                <h4 className="mt-2 text-2xl font-semibold">{method.title}</h4>
                <p className="mt-2 text-white/70">{method.description}</p>
                <Link
                  href={method.href}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#FFC94A]"
                >
                  {method.cta} →
                </Link>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Assurance */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-[#150c07] via-[#201209] to-[#2a1409] p-8 text-center">
          <h3 className="text-2xl font-semibold text-white">
            We issue annual statements and thank-you letters for every gift.
          </h3>
          <p className="mt-3 text-white/70">
            Registered as a 501(c)(3) nonprofit. Need custom documentation for a
            foundation or company gift? Drop us a note and our finance team will
            respond within two business days.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-[#FFC94A]"
          >
            Email finance team
          </Link>
        </section>
      </div>
    </div>
  );
}
