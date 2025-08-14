import { Button } from "@/modules/core/ui/button";
import { BackgroundParticles } from "../components/BackgroundParticles";
import { BlurScreen } from "../components/BlurScreen";
import Link from "next/link";

export const MaintancePage = () => (
  <div className="h-[100vh]">
    <div className="w-full h-full flex">
      <div className="m-auto flex flex-col items-center">
        <img
          src="/maintenance.svg"
          alt="maintenance"
          width={200}
          height={200}
        />
        <p className="text-3xl">This Page is Under Maintenance</p>
        <Button className="text-center mt-2">
          <Link href="/en">Go to Home</Link>
        </Button>
      </div>
    </div>
    <BackgroundParticles />
    <BlurScreen />
  </div>
);
