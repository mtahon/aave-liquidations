import Image from "next/image";
import LiquidationChart from "./chart";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="flex flex-row w-full items-center justify-between font-mono text-sm flex-wrap">
        <div className="flex flex-grow p-8 place-content-center">
          <p>AAVE Liquidations: mainnet</p>
        </div>
        <div className="flex flex-grow p-8 place-content-center">
          <a
            className="pointer-events-none flex place-items-center"
            href="https://thegraph.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <Image
              src="/thegraph.svg"
              alt="The Graph Logo"
              width={150}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center w-full">
        <LiquidationChart/>
      </div>
    </main>
  );
}
