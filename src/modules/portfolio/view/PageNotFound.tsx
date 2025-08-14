import { Button } from "@/modules/core/ui/button";
import { BackgroundParticles } from "../components/BackgroundParticles";
import { BlurScreen } from "../components/BlurScreen";
import Link from "next/link";

export const PageNotFound = () => (
  <div className="h-[100vh]">
    <div className="w-full h-full flex">
      <div className="m-auto flex flex-col items-center">
        <img src="/404.svg" alt="404" width={200} height={200} />
        <p className="text-3xl">Page not Found</p>
        <Button className="text-center mt-2">
          <Link href="/en">Go to Home</Link>
        </Button>
      </div>
    </div>
    <BackgroundParticles />
    <BlurScreen />
  </div>
);
