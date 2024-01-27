import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Check internet speed test right now" },
    {
      name: "description",
      content: "Check internet speed using ndt7 by M-Lab",
    },
  ];
};

export default function Index() {
  return <div>Hello, World!</div>;
}
