"use client";

import Image from "next/image";
import { LazyMotion, m } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Leaf, Recycle } from "lucide-react";

const loadFeatures = () =>
  import("@/app/_utils/motion_features").then((res) => res.default);

export function HeroSection() {
  const [hoveredFeature, setHoveredFeature] = useState<null | number>(null);

  const features = [
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Crafted with the finest materials",
    },
    {
      icon: Leaf,
      title: "Sustainable",
      description: "Eco-friendly production processes",
    },
    {
      icon: Recycle,
      title: "Timeless Design",
      description: "Styles that transcend seasons",
    },
  ];

  return (
    <section
      id="overlay-image"
      className="relative -top-[80px] h-full min-h-[calc(100vh+80px)] w-full"
    >
      <Image
        fill
        priority
        src={"/images/hero.jpg"}
        className="object-cover"
        alt="Fashion collection background"
      />

      <div className="absolute inset-0 bg-black/50" />

      <LazyMotion features={loadFeatures}>
        <div className="absolute inset-0 flex flex-col p-4 sm:p-8 md:p-16">
          <div className="mt-[80px] flex flex-grow flex-col items-center justify-center text-center">
            <m.h1
              className="mb-4 bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:mb-6 sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Elevate Your
              <br />
              Professional Style
            </m.h1>

            <m.p
              className="mb-6 max-w-xl px-4 text-lg text-gray-300 sm:mb-8 sm:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover our curated collection of sophisticated essentials.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                variant={"outline"}
                className="h-12 rounded-none bg-white/10 px-12 text-base text-white hover:bg-white/20 hover:text-white md:px-16"
              >
                Expore Collections
              </Button>
            </m.div>
          </div>

          <m.div
            className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-16 sm:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {features.map((feature, index) => (
              <m.div
                key={feature.title}
                className="group w-1/3 text-center sm:w-auto"
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <div className="mb-2 inline-block rounded-full bg-white/10 p-2 backdrop-blur-sm transition-transform group-hover:scale-110 sm:p-3">
                  <feature.icon className="h-4 w-4 text-white sm:h-6 sm:w-6" />
                </div>

                <h3 className="text-xs font-semibold text-white sm:text-sm">
                  {feature.title}
                </h3>

                <m.p
                  className="mx-auto mt-1 max-w-[120px] text-xs text-gray-300"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredFeature === index ? 1 : 0,
                    height: hoveredFeature === index ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.description}
                </m.p>
              </m.div>
            ))}
          </m.div>
        </div>
      </LazyMotion>
    </section>
  );
}
