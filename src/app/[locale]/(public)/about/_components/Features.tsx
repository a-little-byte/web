"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export type Feature = {
  id: string;
  translationKey: string;
  srcImage: string;
};

export const Features = ({ data }: { data: Array<Feature> }) => {
  const t = useTranslations("about");
  const [featureOpen, setFeatureOpen] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 10);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer > 10000) {
      setFeatureOpen((prev) => (prev + 1) % data.length);
      setTimer(0);
    }
  }, [timer]);

  return (
    <div className="container my-9">
      <div className="mb-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {t("whyChoose.title")}
        </h2>
      </div>
      <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-6 ">
          {data.map((item, index) => (
            <button
              className="w-full"
              key={item.id}
              onClick={() => {
                setFeatureOpen(index);
                setTimer(0);
              }}
              type="button"
            >
              <TextComponent
                content={t(`${item.translationKey}.description`)}
                isOpen={featureOpen === index}
                loadingWidthPercent={featureOpen === index ? timer / 100 : 0}
                number={index + 1}
                title={t(`${item.translationKey}.title`)}
              />
            </button>
          ))}
        </div>
        <div className="h-full">
          <div
            className={cn(
              "relative h-[500px] w-full overflow-hidden rounded-lg"
            )}
          >
            {data.map((item, index) => (
              <Image
                alt={t(`${item.translationKey}.title`)}
                className={cn(
                  "absolute h-[500px] w-full transform-gpu rounded-lg object-cover transition-all duration-300",
                  featureOpen === index ? "scale-100" : "scale-70",
                  featureOpen > index ? "translate-y-full" : ""
                )}
                height={800}
                key={item.id}
                src={item.srcImage}
                style={{ zIndex: data.length - index }}
                width={400}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TextComponent = ({
  number,
  title,
  content,
  isOpen,
  loadingWidthPercent,
}: Readonly<{
  number: number;
  title: string;
  content: string;
  isOpen: boolean;
  loadingWidthPercent?: number;
}>) => {
  return (
    <div
      className={cn(
        "transform-gpu rounded-lg transition-colors",
        isOpen ? "bg-primary/10" : "opacity-50 saturate-0"
      )}
    >
      <div className="flex w-full items-center gap-4 p-4">
        <p
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md bg-primary/20 text-primary"
          )}
        >
          {number}
        </p>
        <h2
          className={cn(
            "text-left font-medium text-gray-800 text-xl dark:text-gray-200"
          )}
        >
          {title}
        </h2>
      </div>
      <div
        className={cn(
          "w-full transform-gpu overflow-hidden text-left text-gray-600 transition-all duration-500 dark:text-gray-400",
          isOpen ? " max-h-64" : "max-h-0"
        )}
      >
        <p className="p-4 text-lg">{content}</p>
        <div className="w-full px-4 pb-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full">
            <div
              className={cn("absolute top-0 left-0 h-1 bg-violet-500")}
              style={{ width: `${loadingWidthPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
