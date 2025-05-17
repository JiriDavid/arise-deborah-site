"use client";

import { motion } from "framer-motion";
import Navigation from "../components/Navigation";

export default function GivingPage() {
  return (
    <div className="min-h-screen">
      {/* <Navigation /> */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto mt-16">
          {/* Hero Section with Background Image */}
          <div className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/images/hero-background.jpg)" }}
            ></div>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-center py-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Support Our Ministry
              </h1>
              <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
                Your generous support helps us continue spreading God's love and
                making a difference in our community.
              </p>
            </motion.div>
          </div>

          {/* Giving Options with Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 mt-16">
            {[
              {
                title: "Tithe",
                description:
                  "Give 10% of your income as an act of worship and obedience.",
                image: "/giving.jpg",
              },
              {
                title: "Offering",
                description:
                  "Support our ministry and community programs through regular offerings.",
                image: "/giving-1.png",
              },
              {
                title: "Special Projects",
                description:
                  "Contribute to specific initiatives and building projects.",
                image: "/giving-2.jpg",
              },
            ].map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-lg shadow-sm border border-primary/20  hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={option.image}
                  alt={option.title}
                  className="w-full h-48 object-cover mb-4 rounded-t-lg"
                />
                <h3 className="text-xl font-semibold text-tertiary mb-2">
                  {option.title}
                </h3>
                <p className="text-accent mb-4">{option.description}</p>
                <button className="w-full bg-primary text-tertiary px-6 py-3 rounded-md font-semibold hover:bg-primary-light transition-colors duration-200">
                  Give Now
                </button>
              </motion.div>
            ))}
          </div>

          {/* Giving Information with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 rounded-lg shadow-sm border border-primary/20 "
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-6">
                Bank Transfer
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🏦</span>
                    <h3 className="text-lg font-medium text-accent">Bank Details</h3>
                  </div>
                  <p className="text-accent">Bank Name: Your Bank Name</p>
                  <p className="text-accent">Account Name: Arise Deborah Church</p>
                  <p className="text-accent">Account Number: XXXX-XXXX-XXXX-XXXX</p>
                  <p className="text-accent">Routing Number: XXXX-XXXX-XX</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">📝</span>
                    <h3 className="text-lg font-medium text-accent">Instructions</h3>
                  </div>
                  <p className="text-accent">
                    1. Log in to your bank's online banking
                    <br />
                    2. Add Arise Deborah Church as a new payee
                    <br />
                    3. Enter the account details above
                    <br />
                    4. Complete the transfer
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 rounded-lg shadow-sm border border-primary/20 "
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-6">
                In-Person Giving
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">⏰</span>
                    <h3 className="text-lg font-medium text-accent">Service Times</h3>
                  </div>
                  <p className="text-accent">Sunday: 10:00 AM</p>
                  <p className="text-accent">Wednesday: 7:00 PM</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">📍</span>
                    <h3 className="text-lg font-medium text-accent">Location</h3>
                  </div>
                  <p className="text-accent">123 Church Street</p>
                  <p className="text-accent">City, State 12345</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">📞</span>
                    <h3 className="text-lg font-medium text-accent">Contact</h3>
                  </div>
                  <p className="text-accent">Phone: (123) 456-7890</p>
                  <p className="text-accent">Email: giving@arisedeborah.org</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tax Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center p-6 bg-primary/5 rounded-lg"
          >
            <p className="text-accent">
              All donations are tax-deductible. We will provide you with a
              receipt for your records.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}