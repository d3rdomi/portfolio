import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import '../styles/embla.css';

export default function EmblaCarousel({ slides = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, i) => (
            <div className="embla__slide" key={i}>
              {slide.title && <h2>{slide.title}</h2>}
              {slide.text && <p>{slide.text}</p>}
              {slide.image && (
                <img 
                  src={slide.image} 
                  alt={slide.alt || ''} 
                  className="object-cover h-full w-full" 
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <button 
        className="embla__prev" 
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        Prev      
      </button>      
      <button 
        className="embla__next" 
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        Next      
      </button>
    </div>
  );
}