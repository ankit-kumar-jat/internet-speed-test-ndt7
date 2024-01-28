import React from "react";
import Needle from "./needle";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const gaugeIntervals = [0, 1, 5, 10, 20, 50, 75, 100];
const radius = 160;
const strokeWidth = radius * 0.2;
const innerRadius = radius - strokeWidth / 2;
const circumference = innerRadius * 2 * Math.PI;
const arc = circumference * (270 / 360);
const dashArray = `${arc} ${circumference}`;
const transform = `rotate(135, ${radius}, ${radius})`;
// const percentNormalized = Math.min(Math.max(percentage, 0), 100);

const claculateArcPercentage = (speed: number) => {
  for (let i = 1; i < gaugeIntervals.length; i++) {
    if (speed <= gaugeIntervals[i - 1]) {
      const rangeStart = gaugeIntervals[i - 1];
      const rangeEnd = gaugeIntervals[i];

      // calculate arc width percentage based on equal devision
      const intervalWidth = 100 / (gaugeIntervals.length - 1);
      const percentage =
        ((speed - rangeStart) / (rangeEnd - rangeStart)) * intervalWidth +
        (i - 1) * intervalWidth;
      return percentage;
    }
  }

  // If speed exceeds the last interval, set it to 100%
  return 100;
};

const Gauge = ({ speed, testState }: { speed: number; testState?: string }) => {
  const percentNormalized = claculateArcPercentage(speed);
  const offset = arc - (percentNormalized / 100) * arc;

  return (
    <div>
      <div className="relative max-w-80 overflow-hidden">
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="text-center">
            <p className="text-3xl font-bold">{speed.toFixed(2)}</p>
            <div className="flex gap-1 items-center justify-center">
              {testState === "downloading" ? (
                <ArrowDownIcon className="w-5 text-green-400" />
              ) : testState === "uploading" ? (
                <ArrowUpIcon className="w-5 text-yellow-400" />
              ) : null}
              <p>Mbps</p>
            </div>
          </div>
        </div>

        <div className="-rotate-[135deg] absolute inset-0 z-10">
          <Needle
            className="transition-all duration-300 w-full h-auto"
            style={{
              transform: `rotate(${percentNormalized * 2.7}deg)`,
            }}
          />
        </div>
        <div className="z-20">
          <svg
            viewBox="0 0 320 320"
            width="320"
            height="320"
            className="w-full h-auto"
          >
            <defs>
              <linearGradient
                id="gauge-gradient"
                gradientUnits="userSpaceOnUse"
                x1="108.43%"
                y1="63.49%"
                x2="-8.43%"
                y2="36.51%"
              >
                <stop stopColor="#1877F2" />
                <stop offset="1" stopColor="#0A5CA7" />
              </linearGradient>
            </defs>
            <circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill="transparent"
              stroke="#8d8f9121"
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              transform={transform}
            />
            <circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill="transparent"
              stroke="url(#gauge-gradient)"
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={offset}
              transform={transform}
              className="transition-all duration-300"
            />

            <text
              x="25%"
              y="75%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              0
            </text>
            <text
              x="15%"
              y="54%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              1
            </text>
            <text
              x="20%"
              y="33%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              5
            </text>
            <text
              x="38.5%"
              y="18%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              10
            </text>
            <text
              x="61.5%"
              y="18%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              20
            </text>
            <text
              x="79.5%"
              y="33%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              50
            </text>
            <text
              x="84%"
              y="54%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              75
            </text>
            <text
              x="74%"
              y="75%"
              fill="white"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              100+
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Gauge;
