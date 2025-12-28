import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import '../styles/embla.css';

export default function EmblaCarousel({ slides = [] }) {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="embla h-56 overflow-hidden mx-auto mt-12 max-w-lg border" ref={emblaRef}>
      <div className="embla__container flex h-full">
        {slides.map((slide, i) => (
          <div className="embla__slide flex-shrink-0 w-full flex items-center justify-center" key={i}>
            {slide.title && <h2>{slide.title}</h2>}
            {slide.image && <img src={slide.image} alt={slide.alt || ''} className="object-cover h-full w-full" />}
          </div>
        ))}
      </div>
    </div>
  );
}
