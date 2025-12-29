import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import '../styles/embla.css';

export default function EmblaCarousel({ slides = [] }) {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {slides.map((slide, i) => (
          <div className="embla__slide" key={i}>
            {slide.title && 
            <h2>{slide.title}</h2>
            }
            {slide.text &&
            <p>{slide.text}</p>
            }
            {slide.image && 
            <img src={slide.image} alt={slide.alt || ''} className="object-cover h-full w-full" />
            }
          </div>
        ))}
      </div>
    </div>
  );
}