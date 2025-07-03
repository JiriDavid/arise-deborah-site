"use client";

import Navigation from "../components/Navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const ministries = [
  {
    name: "Youth Ministry",
    description:
      "Engaging programs and activities for young people to grow in their faith.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    activities: [
      "Bible Study",
      "Youth Group",
      "Community Service",
      "Worship Team",
    ],
  },
  {
    name: "Women's Ministry",
    description:
      "Support, fellowship, and spiritual growth opportunities for women.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    activities: [
      "Bible Study",
      "Prayer Group",
      "Fellowship Events",
      "Outreach Programs",
    ],
  },
  {
    name: "Outreach",
    description:
      "Making a difference in our community through service and love.",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
    activities: [
      "Food Bank",
      "Homeless Ministry",
      "Community Events",
      "Mission Trips",
    ],
  },
  {
    name: "Worship Team",
    description:
      "Leading the congregation in worship through music and praise.",
    image:
      "/praise.jpg",
    activities: ["Sunday Worship", "Choir", "Praise Band", "Special Events"],
  },
  {
    name: "Children's Ministry",
    description: "Nurturing young hearts and minds in the love of Christ.",
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80",
    activities: [
      "Sunday School",
      "Vacation Bible School",
      "Children's Choir",
      "Family Events",
    ],
  },
  {
    name: "Men's Ministry",
    description: "Building strong men of faith through fellowship and study.",
    image:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80",
    activities: ["Bible Study", "Men's Group", "Service Projects", "Retreats"],
  },
];

export default function MinistriesPage() {
  return (
    <>
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
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
                Our Ministries
              </h1>
              <p className="mt-6 text-lg leading-8 text-white">
                Discover ways to serve, grow, and connect with others in our
                church community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Ministries Grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 ">
            {ministries.map((ministry) => (
              <motion.article
                key={ministry.name}
                className="flex flex-col items-start p-2 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-full">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-secondary-light">
                    <Image
                      src={ministry.image}
                      alt={ministry.name}
                      width={800}
                      height={450}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="h-full w-full object-cover"
                      quality={85}
                    />
                  </div>
                </div>
                <div className="max-w-xl">
                  <div className="mt-6 flex items-center gap-x-6">
                    <h3 className="text-lg font-semibold leading-8 text-primary">
                      {ministry.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-base leading-7 text-white">
                    {ministry.description}
                  </p>
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-primary">
                      Activities:
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {ministry.activities.map((activity) => (
                        <li key={activity} className="text-sm text-white">
                          • {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-secondary-light px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Get Involved Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white">
              Join one of our ministries and be part of our growing community.
              There's a place for everyone to serve and grow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#contact"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Contact Us
              </a>
              <a
                href="/events"
                className="text-sm font-semibold leading-6 text-white"
              >
                View Events <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
