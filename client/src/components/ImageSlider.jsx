import React, { useState, useEffect } from 'react';
import '../css/ImageSlider.css';

const ImageSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const next = (current + 1) % slides.length;
    const id = setTimeout(() => setCurrent(next), 3000);
    return () => clearTimeout(id);
  }, [current, slides.length]);

  return (
    <div className="image-slider">
      {slides.map((src, index) => (
        <img
          key={index}
          className={index === current ? 'slide active' : 'slide'}
          src={src}
          alt=""
        />
      ))}
    </div>
  );
};

export default ImageSlider;