
import Image from "next/image";
import Hero from "./homepage/Hero";
import Collections from "./homepage/Collections";
import Trending from "./homepage/Trending";
import Testimonials from "./homepage/Testimonials";
import Sale from "./homepage/Sale";

export default function Homepage() {
  return (
    <>
    <Hero/>
    <Trending/>
    <Collections/>
    <div className="relative overflow-hidden">
        <Sale/>
        <Testimonials/>
    </div>

    </>
  );
}
