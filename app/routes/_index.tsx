import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import ndt7 from "@m-lab/ndt7";
import Gauge from "~/components/gauge";

import type {
  CompleteMesurement,
  Mesurement,
  Server,
  ServerLocation,
} from "~/types/ndt7";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

export const meta: MetaFunction = () => {
  return [
    { title: "Check internet speed test right now" },
    {
      name: "description",
      content:
        "Check your Internet speed in under 30 seconds. The speed test usually transfers less than 40 MB of data, but may transfer more data on fast connections.",
    },
  ];
};

type TestStates =
  | "idle"
  | "connecting"
  | "downloading"
  | "uploading"
  | "completed"
  | "error";

type Result = {
  downloadSpeed: number;
  uploadSpeed: number;
};

export default function Index() {
  const [testState, setTestState] = useState<TestStates>("idle");
  const [serverLocation, setServerLocation] = useState<ServerLocation>();
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);

  const [result, setResult] = useState<Result>({
    downloadSpeed: 0,
    uploadSpeed: 0,
  });

  const handleStartTest = () => {
    setTestState("connecting");
    setCurrentSpeed(0);
    setServerLocation(undefined);
    ndt7.test(
      {
        userAcceptedDataPolicy: true,
      },
      {
        serverChosen: (server: Server) => {
          console.log("🚀 ~ handleStartTest ~ Server:", server);
          setTestState("downloading");
          setServerLocation(server.location);
        },
        downloadMeasurement: (data: Mesurement) => {
          console.log("🚀 ~ handleStartTest ~ data:", data);
          if (data.Source === "client") {
            setCurrentSpeed(data.Data.MeanClientMbps);
          }
        },
        downloadComplete: (data: CompleteMesurement) => {
          // const serverBw =
          //   (data.LastServerMeasurement.BBRInfo.BW * 8) / 1000000;
          const clientGoodput = data.LastClientMeasurement.MeanClientMbps;
          setTestState("uploading");
          setCurrentSpeed(0);
          setResult((prev) => ({
            ...prev,
            downloadSpeed: clientGoodput,
          }));
        },
        uploadMeasurement: (data: Mesurement) => {
          console.log("🚀 ~ handleStartTest ~ data:", data);
          if (data.Source === "server") {
            const speed =
              (data.Data.TCPInfo.BytesReceived /
                data.Data.TCPInfo.ElapsedTime) *
              8;
            console.log("Upload: " + speed.toFixed(2) + " Mb/s");
            setCurrentSpeed(speed);
          }
        },
        uploadComplete: (data: CompleteMesurement) => {
          const bytesReceived =
            data.LastServerMeasurement.TCPInfo.BytesReceived;
          const elapsed = data.LastServerMeasurement.TCPInfo.ElapsedTime;
          // bytes * bits/byte / microseconds = Mbps
          const throughput = (bytesReceived * 8) / elapsed;
          setTestState("completed");
          setCurrentSpeed(0);
          setResult((prev) => ({
            ...prev,
            uploadSpeed: throughput,
          }));
        },
        error: (err: any) => {
          console.log("Error while running the test:", err.message);
          setTestState("error");
          setCurrentSpeed(0);
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 min-h-screen">
      <header>
        <h1 className="text-center font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl my-6 lg:my-9">
          Test Your Internet Speed
        </h1>
      </header>
      <main className="flex-grow flex flex-col gap-4 items-center">
        <div className="flex justify-center">
          <Gauge speed={currentSpeed} testState={testState} />
        </div>
        {testState !== "idle" && (
          <p>
            {testState === "connecting" ? (
              "Finding Server..."
            ) : (
              <>
                Server: {serverLocation?.city}, {serverLocation?.country}
              </>
            )}
          </p>
        )}

        {testState === "completed" && <ResultSection result={result} />}

        {testState === "idle" && <PrivacyNotice />}

        {(testState === "idle" || testState === "completed") && (
          <button
            onClick={handleStartTest}
            className="z-50 mt-4 py-3 px-6 bg-[#0A5CA7] rounded-lg text-lg hover:bg-[#0A5CA7]/70 focus:bg-[#0A5CA7]/70"
          >
            {testState === "completed" ? "Test Again" : "Start Test"}
          </button>
        )}
      </main>
      <footer className="text-xs text-center text-gray-600">
        <p>&copy;2024 Ankit Kumar Jat</p>
      </footer>
    </div>
  );
}

const ResultSection = ({ result }: { result: Result }) => {
  return (
    <div className="flex gap-4 max-w-sm justify-around w-full">
      <div className="flex gap-2 items-center">
        <div className="bg-green-400/15 rounded-full p-4">
          <ArrowDownIcon className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm opacity-75">Download</p>
          <p>
            <span className="text-xl font-semibold">
              {result.downloadSpeed.toFixed(2)}
            </span>{" "}
            Mbps
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="bg-yellow-400/15 rounded-full p-4">
          <ArrowUpIcon className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-sm opacity-75">Upload</p>
          <p>
            <span className="text-xl font-semibold">
              {result.uploadSpeed.toFixed(2)}
            </span>{" "}
            Mbps
          </p>
        </div>
      </div>
    </div>
  );
};

const PrivacyNotice = () => {
  return (
    <div className="max-w-xl text-center">
      <p className="text-base opacity-75 mb-4">
        Check your Internet speed in under 30 seconds. The speed test usually
        transfers less than 40 MB of data, but may transfer more data on fast
        connections.
      </p>
      <p className="text-sm opacity-75 ">
        *To run the test, you'll be connected to{" "}
        <a
          href="https://www.measurementlab.net/"
          target="_blank"
          className="text-[#77B0FD] underline underline-offset-4"
        >
          Measurement Lab
        </a>{" "}
        (M-Lab) and your IP address will be shared with them and processed by
        them in accordance with their{" "}
        <a
          href="https://www.measurementlab.net/privacy/"
          target="_blank"
          className="text-[#77B0FD] underline underline-offset-4"
        >
          privacy policy
        </a>
        . M-Lab conducts the test and publicly publishes all test results to
        promote Internet research. Published information includes your IP
        address and test results, but doesn’t include any other information
        about you as an Internet user.
      </p>
    </div>
  );
};
