"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const beliefPillars = [
  {
    title: "Prophetic Prayer",
    description:
      "We cultivate atmospheres where women hear God clearly and intercede with authority.",
  },
  {
    title: "Mentorship & Advocacy",
    description:
      "Every leader deserves covering. We pair women with seasoned mentors who walk alongside them.",
  },
  {
    title: "Kingdom Influence",
    description:
      "From the boardroom to the mission field, we equip women to steward their call and impact culture.",
  },
];

const timeline = [
  {
    year: "2014",
    title: "Birth of the Prayer Call",
    detail:
      "Pastor Deborah gathered a handful of women at 5AM daily. What began as intercession became a global movement.",
  },
  {
    year: "2018",
    title: "Mentorship Tracks",
    detail:
      "The first mentorship cohorts launched, pairing new voices with mothers in the faith to accelerate growth.",
  },
  {
    year: "2022",
    title: "Hybrid Prayer Rooms",
    detail:
      "LiveKit-enabled rooms opened, allowing women across nations to enter immersive prayer encounters online.",
  },
  {
    year: "2024",
    title: "Kingdom Labs",
    detail:
      "Strategic summits and city labs began, sparking entrepreneurship, missions, and policy conversations led by women.",
  },
];

const leadership = [
  {
    name: "Pastor Deborah A.",
    role: "Visionary & Lead Pastor",
    image: "/praise-1.jpg",
    quote:
      "We are raising a remnant of women who prophesy, build, and nurture cultures of heaven wherever they stand.",
  },
  {
    name: "Sarah Olu",
    role: "Executive Director",
    image: "/praise.jpg",
    quote:
      "My passion is to ensure every vision carrier receives the systems, teams, and prayers they need to flourish.",
  },
  {
    name: "Dr. Tola A.",
    role: "Global Programs Lead",
    image: "/praise-3.jpeg",
    quote:
      "From mentorship circles to kingdom labs, we design experiences that stretch capacity and release solutions.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-secondary text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 min-h-[70vh]">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/praise.jpg"
            alt="Prayer gathering"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-black/70 p-8 sm:p-10 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-[#FFC94A]">
              About Arise Deborah
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              Building altars of prayer and leadership for women across the
              globe
            </h1>
            <p className="mt-6 text-base text-white/80 sm:text-lg">
              We are a global family committed to intercession, mentorship, and
              kingdom solutions. At dawn, at noon, and under the night watch,
              women gather in our rooms to host God and release His heart to
              nations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#FFC94A]">
            Our heartbeat
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Three pillars that guide everything we build
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {beliefPillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-[#f7d9a6]/40 bg-[#2b1b0f]/80 p-6 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-[#FFE5B4]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm text-white/80">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 px-4 sm:px-6 bg-[#120a05]/70">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-[#FFC94A]">
              Our story
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Moments that shaped our movement
            </h2>
          </div>
          <div className="mt-12 grid gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#FFC94A]">
                      {item.year}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-white/80">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#FFC94A]">
            Leadership circle
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            Guided by mothers and builders
          </h2>
          <p className="mt-4 text-white/70">
            Our team brings decades of ministry, governance, therapy, and
            creative leadership to serve women in every sphere.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {leadership.map((leader) => (
            <motion.div
              key={leader.name}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-white/10 bg-black/40 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border border-[#FFC94A]/30">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#FFE5B4]">
                {leader.name}
              </h3>
              <p className="text-sm uppercase tracking-[0.3em] text-[#FFC94A]">
                {leader.role}
              </p>
              <p className="mt-4 text-sm text-white/80">{leader.quote}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#FFC94A]/40 bg-gradient-to-r from-[#2b1b0f] to-[#3a1f0c] p-8 sm:p-10 text-center shadow-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
            Walk with us
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">
            Ready to join the prayer rooms, mentorship circles, or upcoming
            labs?
          </h2>
          <p className="mt-4 text-white/70">
            Whether you want to volunteer, serve as a mentor, or bring Arise
            Deborah to your city, we would love to meet you.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/prayer-rooms"
              className="rounded-2xl bg-[#FFC94A] px-6 py-3 font-semibold text-[#2B1B0F]"
            >
              Explore Prayer Rooms
            </a>
            <a
              href="/contact"
              className="rounded-2xl border border-white/30 px-6 py-3 font-semibold text-white"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
