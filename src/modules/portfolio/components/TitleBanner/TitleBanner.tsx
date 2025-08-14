"use client";

import { useState } from "react";
import { WrapperTitle } from "./WrapperTitle";
import Typer from "../Typer";
import { usePorfolioContext } from "../../context/PortfolioContext";

const TitleBanner = () => {
  const [isEndLine, setIsEndLine] = useState(false);
  const onComplete = () => {
    setIsEndLine(true);
  };
  const { title } = usePorfolioContext();

  return (
    <WrapperTitle>
      {isEndLine ? (
        <h3
          className="font-sans text-3xl lg:text-5xl"
          style={{ paddingTop: 1.699 }}
          color={"#000000"}
        >
          {title.big}
        </h3>
      ) : (
        <Typer
          color={"#000000"}
          className="font-sans text-3xl lg:text-5xl"
          fontSizeCursor={"3rem"}
          strings={[title.big]}
          typeSpeed={25}
          onComplete={onComplete}
        />
      )}

      {isEndLine ? (
        <Typer
          className="font-sans text-base lg:text-xl mt-2"
          color={"#000000"}
          fontSizeCursor="1.5rem"
          strings={[title.small]}
          typeSpeed={25}
        />
      ) : (
        <div className="mt-0 md:mt-2" />
      )}
    </WrapperTitle>
  );
};
export default TitleBanner;
