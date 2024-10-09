"use client";

import Image from "next/image";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const loadFeatures = () =>
  import("@/app/_utils/motion_features").then((res) => res.default);

const trendingStyles = [
  {
    name: "Cozy Monochrome",
    image: "/images/trendingStyles/CozyMonochrome.jpg",
    description:
      "Embrace warmth with our chunky knit sweater and leather boots combo.",
    items: [
      "Chunky Knit Sweater",
      "Leather Boots",
      "Wool Scarf",
      "Leather Pants",
    ],
  },
  {
    name: "Minimalist Chic",
    image: "/images/trendingStyles/MinimalistChic.png",
    description:
      "Elevate your look with our crisp white shirt and sleek black trousers.",
    items: [
      "White Button-Down Shirt",
      "Black Trousers",
      "Canvas Tote Bag",
      "Minimalist Watch",
    ],
  },
  {
    name: "Urban Edge",
    image: "/images/trendingStyles/UrbanEdge.png",
    description:
      "Make a statement with our bold leather jacket and accessories.",
    items: ["Leather Jacket", "Fedora Hat", "Sunglasses", "Handbag"],
  },
  {
    name: "Sporty Comfort",
    image: "/images/trendingStyles/SportyComfort.png",
    description:
      "Stay comfortable and stylish with our Adidas hoodie and sweatpants set.",
    items: ["Adidas Hoodie", "Sweatpants", "Sneakers", "Baseball Cap"],
  },
];

export default function TrendingStyles() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStyle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingStyles.length);
  };

  const prevStyle = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + trendingStyles.length) % trendingStyles.length,
    );
  };

  return (
    <section className=" bg-gray-50 py-32 sm:py-40">
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold uppercase text-gray-900 sm:text-4xl">
          Trending Styles
        </h2>

        <LazyMotion features={loadFeatures}>
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="relative w-full md:w-2/3">
              <AnimatePresence mode="wait">
                <m.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-h-2 aspect-w-3 relative h-auto sm:aspect-w-[3.5]"
                >
                  <Image
                    src={trendingStyles[currentIndex].image}
                    alt={trendingStyles[currentIndex].name}
                    className="object-cover"
                    fill
                  />
                </m.div>
              </AnimatePresence>

              <button
                onClick={prevStyle}
                className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-1.5 shadow-md sm:p-2"
                aria-label="Previous style"
              >
                <ChevronLeft className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" />
              </button>

              <button
                onClick={nextStyle}
                className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-1.5 shadow-md sm:p-2"
                aria-label="Next style"
              >
                <ChevronRight className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="w-full md:w-1/3">
              <AnimatePresence mode="wait">
                <m.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                    {trendingStyles[currentIndex].name}
                  </h3>

                  <p className="mb-6 text-gray-600">
                    {trendingStyles[currentIndex].description}
                  </p>

                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    Included Items:
                  </h4>

                  <ul className="mb-6 list-inside list-disc text-gray-600">
                    {trendingStyles[currentIndex].items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <Button variant={"outline"} size={"lg"}>
                    Shop This Trend
                  </Button>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
