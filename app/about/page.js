"use client";

import Navigation from "../components/Navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const staff = [
  {
    name: "Pastor John Doe",
    role: "Senior Pastor",
    image: "/praise-1.jpg",
  },
  {
    name: "Sarah Smith",
    role: "Worship Leader",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    bio: "Guiding our worship ministry with passion and dedication.",
  },
  {
    name: "Michael Johnson",
    role: "Youth Pastor",
    image:
      "https://images.unsplash.com/photo-1573497161529-95eb65b7a2fb?auto=format&fit=crop&w=800&q=80",
    bio: "Inspiring the next generation in their faith journey.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-secondary pt-12">
        {/* Hero Section */}
        <div className="relative isolate">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 py-10 sm:py-32 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
                About Arise Deborah International
              </h1>
              <p className="mt-6 text-lg leading-8 text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos. Lorem Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam, quos. Lorem
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-secondary-light grid grid-cols-2 gap-4 items-center justify-between mx-4 ">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 shadow-sm shadow-primary/20 shadow-[#FFC94A] p-4 rounded-lg col-span-2 md:col-span-1">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Our Mission
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                To spread God's love and make disciples
              </p>
              <p className="mt-6 text-lg leading-8 text-white">
                We are committed to creating a welcoming environment where
                everyone can experience God's love and grow in their faith
                journey.
              </p>
            </div>
          </div>

          {/* Core Beliefs */}
          <div className="mx-auto max-w-7xl px-6   col-span-2 md:col-span-1 shadow-sm shadow-primary/20 shadow-[#FFC94A] p-4 rounded-lg">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Core Beliefs
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                What We Believe In to Push Us Forward
              </p>
              <p className="mt-6 text-lg leading-8 text-white">
                Our faith is grounded in the fundamental truths of Christianity.
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos. Lorem ipsum dolor sit
              </p>
            </div>
          </div>
        </div>

        <div className="mx-4 mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none ">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: "The Bible",
                description:
                  "We believe the Bible is the inspired and infallible Word of God.",
              },
              {
                title: "Salvation",
                description:
                  "Salvation comes through faith in Jesus Christ alone.",
              },
              {
                title: "The Church",
                description:
                  "The church is the body of Christ, called to make disciples.",
              },
            ].map((belief) => (
              <motion.div
                key={belief.title}
                className="flex flex-col shadow-sm shadow-primary/20 shadow-[#FFC94A] p-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-primary">
                  {belief.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-white">
                  <p className="flex-auto">{belief.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Staff Section */}
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Our Leadership
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet Our Team
            </p>
            <p className="mt-6 text-lg leading-8 text-white">
              Our dedicated team of leaders is committed to serving our
              community.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {staff.map((person) => (
              <motion.article
                key={person.name}
                className="flex flex-col items-start"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-full">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-secondary-light">
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={400}
                      height={500}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="h-full w-full object-cover"
                      quality={85}
                    />
                  </div>
                </div>
                <div className="max-w-xl">
                  <div className="mt-6 flex items-center gap-x-6">
                    <h3 className="text-lg font-semibold leading-8 text-primary">
                      {person.name}
                    </h3>
                    <p className="text-sm font-semibold leading-6 text-white">
                      {person.role}
                    </p>
                  </div>
                  <p className="mt-4 text-base leading-7 text-white">
                    {person.bio}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
