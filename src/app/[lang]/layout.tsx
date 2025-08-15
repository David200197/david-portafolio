import { Navbar } from "@/modules/core/components/navbar";
import { getService } from "@/modules/core/utils/di-utils";
import { PortfolioService } from "@/modules/portfolio/services/portfolio-service";

const portfolioService = getService(PortfolioService);

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export default async function RootLayout({
  children,
  params,
}: Readonly<Props>) {
  const { lang } = await params;

  return (
    <>
      <Navbar
        items={await portfolioService.getItemMenus(lang)}
        icon={{
          src: "/favicon.svg",
          title: "Portfolio",
        }}
      />
      {children}
    </>
  );
}
