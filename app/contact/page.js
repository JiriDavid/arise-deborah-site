"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-42 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
             <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-white">
              We'd love to hear from you. Get in touch with us through any of
              the following channels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className=" p-8 rounded-lg shadow-sm border border-primary/20"
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-accent mb-2">
                    Address
                  </h3>
                  <p className="text-accent">
                    123 Church Street
                    <br />
                    City, State 12345
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-accent mb-2">
                    Phone
                  </h3>
                  <p className="text-accent">(123) 456-7890</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-accent mb-2">
                    Email
                  </h3>
                  <p className="text-accent">info@arisedeborah.org</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-accent mb-2">
                    Service Times
                  </h3>
                  <p className="text-accent">
                    Sunday: 10:00 AM
                    <br />
                    Wednesday: 7:00 PM
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className=" p-8 rounded-lg shadow-sm border border-primary/20"
            >
              <h2 className="text-2xl font-semibold text-tertiary mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-accent mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-accent mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-accent mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full px-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-tertiary px-6 py-3 rounded-md font-semibold hover:bg-primary-light transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-semibold text-tertiary mb-6">
              Connect With Us
            </h2>
            <div className="flex justify-center space-x-8 text-[#FFC94A]">
              <a
                href="#"
                className="text-accent hover:text-primary transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook className="w-8 h-8" />
              </a>
              <a
                href="#"
                className="text-accent hover:text-primary transition-colors duration-200 "
                aria-label="Instagram"
              >
                <FaInstagram className="w-8 h-8" />
              </a>
              <a
                href="#"
                className="text-accent hover:text-primary transition-colors duration-200"
                aria-label="YouTube"
              >
                <FaYoutube className="w-8 h-8 text-[" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
