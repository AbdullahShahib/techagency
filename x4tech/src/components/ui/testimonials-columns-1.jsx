import React from 'react';
import { motion } from 'motion/react';

export function TestimonialsColumn({ className, testimonials, duration = 10 }) {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-x4-card border-x4-border" key={`${name}-${i}-${index}`}>
                <div className="text-x4-text leading-7">{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5 text-x4-text">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight text-x4-muted">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
