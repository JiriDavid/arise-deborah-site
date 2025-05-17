"use client";

import { motion } from "framer-motion";
import Navigation from "../components/Navigation";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-tertiary mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-accent">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                1. Information We Collect
              </h2>
              <p className="text-accent">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc list-inside text-accent mt-2 space-y-2">
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Payment information (when making donations)</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-accent">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-accent mt-2 space-y-2">
                <li>Process your donations and send receipts</li>
                <li>Send you updates about our ministry</li>
                <li>Respond to your requests and inquiries</li>
                <li>Improve our website and services</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                3. Information Sharing
              </h2>
              <p className="text-accent">
                We do not sell or share your personal information with third
                parties except as described in this policy. We may share your
                information with:
              </p>
              <ul className="list-disc list-inside text-accent mt-2 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
                <li>Other parties with your consent</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                4. Data Security
              </h2>
              <p className="text-accent">
                We implement appropriate security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                5. Your Rights
              </h2>
              <p className="text-accent">You have the right to:</p>
              <ul className="list-disc list-inside text-accent mt-2 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                6. Contact Us
              </h2>
              <p className="text-accent">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="text-accent mt-2">
                Email: privacy@arisedeborah.org
                <br />
                Phone: (123) 456-7890
                <br />
                Address: 123 Church Street, City, State 12345
              </p>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
