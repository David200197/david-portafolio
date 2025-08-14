"use client";

import { useEffect, useState } from "react";
import { loadFull } from "tsparticles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useGetService } from "@/modules/core/contexts/DiContext";
import { PortfolioService } from "../services/portfolio-service";

export const BackgroundParticles = () => {
  const [init, setInit] = useState(false);
  const portfolioService = useGetService(PortfolioService);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={portfolioService.getParticlesOptions()}
      />
    );
  }

  return <></>;
};
