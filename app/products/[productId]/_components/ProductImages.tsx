"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductImagesProps {
  mainImage: string | null | undefined;
  images: string[];
}

interface IndicatorsProps {
  noOfSlides: number;
  activeSlideIndex: number;
  onClick: (index: number) => void;
}

const Indicators = ({
  noOfSlides,
  onClick,
  activeSlideIndex,
}: IndicatorsProps) => {
  const maxIndicators = 6;
  const numIndicators = Math.min(maxIndicators, noOfSlides);

  const indexesToJump = activeSlideIndex - (maxIndicators - 3);
  const canGoToNextIndicators = activeSlideIndex + 2 <= noOfSlides - 1;
  const hasReachedSecLast = activeSlideIndex - (maxIndicators - 3) > 0;

  return (
    <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2">
      {Array.from({ length: numIndicators }, (_, i) => {
        const slideIndex =
          hasReachedSecLast && canGoToNextIndicators
            ? i + indexesToJump
            : hasReachedSecLast && !canGoToNextIndicators
            ? i + indexesToJump - (activeSlideIndex + 1 - (noOfSlides - 2))
            : i;

        const distanceFromEndIndex = Math.abs(
          activeSlideIndex - (noOfSlides - 1),
        );
        const distanceFromStartingIndex = Math.abs(activeSlideIndex - 0);

        const isPenultimateInd = i === maxIndicators - 2;
        const isLastInd = i === maxIndicators - 1;
        const isSecondInd = i === 1;
        const isFirstInd = i === 0;

        return (
          <div
            key={i}
            onClick={() => onClick(slideIndex)}
            className={cn(
              "h-1.5 w-1.5 cursor-pointer rounded-full bg-black/30 transition-all",
              distanceFromEndIndex > 2 && isLastInd
                ? "scale-50"
                : distanceFromEndIndex === 2 && isLastInd && "scale-75",
              distanceFromStartingIndex > 2 && isFirstInd
                ? "scale-50"
                : distanceFromStartingIndex === 2 && isFirstInd && "scale-75",
              distanceFromEndIndex > 1 &&
                isPenultimateInd &&
                distanceFromEndIndex !== 2 &&
                "scale-75",
              distanceFromStartingIndex > 1 &&
                isSecondInd &&
                distanceFromStartingIndex !== 2 &&
                "scale-75",
              slideIndex === activeSlideIndex && " scale-150 bg-black",
            )}
          />
        );
      })}
    </div>
  );
};

export const RevamedProductImages = ({
  mainImage,
  images,
}: ProductImagesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showingAll, setShowingAll] = useState(false);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setActiveSlideIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <div className="hidden flex-col items-center gap-6 min-[960px]:col-span-5 min-[960px]:flex">
        <div className="grid h-min max-h-min w-full grid-cols-2 gap-4 overflow-hidden">
          {images.map(
            (image, i) =>
              (showingAll || (!showingAll && i < 6)) && (
                <div key={i} className="relative aspect-[2/2.5] w-full">
                  <Image
                    src={image}
                    alt="Product Image"
                    className="object-cover"
                    fill
                  />
                </div>
              ),
          )}
        </div>

        {images.length > 6 &&
          (!showingAll ? (
            <Button
              className="uppercase"
              variant={"corners"}
              onClick={() => setShowingAll(true)}
            >
              More Media
            </Button>
          ) : (
            <Button
              className="uppercase"
              variant={"corners"}
              onClick={() => setShowingAll(false)}
            >
              Less Media
            </Button>
          ))}
      </div>

      <div className="min-[960px]:hidden">
        <Carousel className="relative w-full" setApi={setApi}>
          <CarouselContent>
            {images.map((image, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-[2/2.5] w-full">
                  <Image
                    src={image}
                    alt="Product Image"
                    className="object-cover object-center"
                    fill
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <Indicators
            onClick={(i: number) => {
              api?.scrollTo(i);
            }}
            activeSlideIndex={activeSlideIndex}
            noOfSlides={images.length}
          />
        </Carousel>
      </div>
    </>
  );
};
