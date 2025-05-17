"use client";

import { motion } from "framer-motion";
import Navigation from "../components/Navigation";

export default function TermsPage() {
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
              Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p className="text-accent">
                By accessing and using this website, you accept and agree to be
                bound by the terms and conditions of this agreement.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                2. Use License
              </h2>
              <p className="text-accent">
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Arise Deborah's website
                for personal, non-commercial transitory viewing only.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                3. Donations and Payments
              </h2>
              <p className="text-accent">
                When making donations through our website:
              </p>
              <ul className="list-disc list-inside text-accent mt-2 space-y-2">
                <li>All donations are non-refundable</li>
                <li>We will provide receipts for tax purposes</li>
                <li>Your payment information is processed securely</li>
                <li>We maintain records of all transactions</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                4. User Conduct
              </h2>
              <p className="text-accent">Users agree not to:</p>
              <ul className="list-disc list-inside text-accent mt-2 space-y-2">
                <li>Use the website for any unlawful purpose</li>
                <li>
                  Attempt to gain unauthorized access to any portion of the
                  website
                </li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Use the website to distribute malware or harmful code</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-accent">
                All content on this website, including text, graphics, logos,
                images, and software, is the property of Arise Deborah and is
                protected by copyright laws.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-accent">
                Arise Deborah shall not be liable for any damages arising from
                the use or inability to use the materials on this website.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-accent">
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes via email or through the
                website.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-4">
                8. Contact Information
              </h2>
              <p className="text-accent">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <p className="text-accent mt-2">
                Email: legal@arisedeborah.org
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
