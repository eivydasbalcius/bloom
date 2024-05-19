import React, { useRef } from 'react';
import Hero from "./homepage/Hero";
import Collections from "./homepage/Collections";
import Trending from "./homepage/Trending";
import Testimonials from "./homepage/Testimonials";
import Sale from "./homepage/Sale";

export default function Homepage() {
  const saleRef = useRef<HTMLDivElement>(null);

  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'sale' && saleRef.current) {
      saleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Hero onScrollToSection={handleScrollToSection} />
      <Trending />
      <Collections />
      <div className="relative overflow-hidden">
        <div ref={saleRef}>
          <Sale />
        </div>
      </div>
    </>
  );
}
