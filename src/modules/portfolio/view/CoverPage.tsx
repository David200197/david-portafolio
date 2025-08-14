import { BackgroundParticles } from "../components/BackgroundParticles";
import { BlurScreen } from "../components/BlurScreen";
import DownButton from "../components/DownButton";
import TitleBanner from "../components/TitleBanner";
import className from "./CoverPage.module.css";

export const CoverPage = () => {
  return (
    <section className={className.cover_page} id="home">
      <TitleBanner />
      <DownButton />
      <BackgroundParticles />
      <BlurScreen height="150%" />
    </section>
  );
};
