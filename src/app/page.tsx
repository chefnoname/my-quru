import { Header } from "@/components/Header";
import { MotionRoot } from "@/components/Motion";
import { Engine } from "@/components/sections/Engine";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Join } from "@/components/sections/Join";
import { PreviewStrip } from "@/components/sections/PreviewStrip";
import { Prices } from "@/components/sections/Prices";

export default function Home() {
  return (
    <MotionRoot>
      <div id="top">
        <PreviewStrip />
        <Header />
        <main>
          <Hero />
          <Engine />
          <Prices />
          <Faq />
          <Join />
        </main>
        <Footer />
      </div>
    </MotionRoot>
  );
}
