"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import { motion } from "framer-motion";

const givingOptions = [
  {
    id: "tithe",
    name: "Tithe",
    description: "Give 10% of your income as an act of worship and obedience.",
    icon: "💰",
  },
  {
    id: "offering",
    name: "Offering",
    description:
      "Give above and beyond your tithe to support the church's mission.",
    icon: "🎁",
  },
  {
    id: "building",
    name: "Building Fund",
    description: "Support our church building and maintenance projects.",
    icon: "🏛️",
  },
  {
    id: "missions",
    name: "Missions",
    description: "Support our local and global mission work.",
    icon: "🌍",
  },
];

export default function GivePage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle donation submission logic here
    console.log("Donation submitted:", {
      option: selectedOption,
      amount,
      frequency,
      ...formData,
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen  pt-24">
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
                Give
              </h1>
              <p className="mt-6 text-lg leading-8 text-white">
                Support our ministry and make a difference in our community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Giving Options */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Giving Options List */}
            <motion.div
              className="flex flex-col items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-primary mb-8">
                Ways to Give
              </h2>
              <div className="space-y-6">
                {givingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full text-left p-6 rounded-lg border transition-colors ${
                      selectedOption === option.id
                        ? "border-primary bg-primary/10"
                        : "border-primary/20 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {option.name}
                        </h3>
                        <p className="mt-1 text-sm text-white">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Donation Form */}
            <motion.div
              className="flex flex-col items-start"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-primary mb-8">
                Make a Donation
              </h2>
              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-white"
                  >
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full pl-7 rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="frequency"
                    className="block text-sm font-medium text-white"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="one-time">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-white"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-white"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-white"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-white"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-white"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-primary/20 bg-secondary text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Continue to Payment
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
