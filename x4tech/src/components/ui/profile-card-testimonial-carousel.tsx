"use client";

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Github,
  Twitter,
  Youtube,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { AnimatedText } from '@/components/ui/animated-shiny-text';
import { BubbleText } from '@/components/ui/bubble-text';

export interface Testimonial {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  gmailUrl?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Michael Chen',
    title: 'Senior Software Engineer, Cloud Infrastructure',
    description:
      'Working with this team completely changed our infrastructure game. The support and expertise were incredible. They delivered beyond our expectations and helped us scale to millions of users.',
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    githubUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    linkedinUrl: '#',
  },
  {
    name: 'Jessica Roberts',
    title: 'Lead Data Scientist, InsightX',
    description:
      'The data analytics platform they built gave our team the confidence and tools needed for true data-driven decisions. Their dashboarding capabilities went above and beyond our expectations.',
    imageUrl:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80',
    githubUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    linkedinUrl: '#',
  },
  {
    name: 'William Carter',
    title: 'VP Product, NovaLabs',
    description:
      'NovaLabs helped our products find the perfect market fit. Their engineering team exceeded every delivery milestone and provided exceptional technical leadership.',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    githubUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    linkedinUrl: '#',
  },
];

export interface TestimonialCarouselProps {
  className?: string;
  testimonials?: Testimonial[];
}

export function TestimonialCarousel({ className, testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = useMemo(() => (testimonials && testimonials.length ? testimonials : defaultTestimonials), [testimonials]);
  const currentTestimonial = items[currentIndex] ?? items[0];

  const handleNext = () => setCurrentIndex((index) => (index + 1) % items.length);
  const handlePrevious = () => setCurrentIndex((index) => (index - 1 + items.length) % items.length);

  const socialIcons = [
    { icon: Github, url: currentTestimonial.githubUrl, label: 'GitHub' },
    { icon: Twitter, url: currentTestimonial.twitterUrl, label: 'Twitter' },
    { icon: Youtube, url: currentTestimonial.youtubeUrl, label: 'YouTube' },
    { icon: Linkedin, url: currentTestimonial.linkedinUrl, label: 'LinkedIn' },
    { icon: Instagram, url: currentTestimonial.instagramUrl, label: 'Instagram' },
    { icon: Mail, url: currentTestimonial.gmailUrl, label: 'Email' },
  ].filter(({ url }) => Boolean(url));

  const bioWords = currentTestimonial.description
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => ({ text }));

  return (
    <div className={cn('w-full max-w-5xl mx-auto px-4', className)}>
      <div className="hidden md:flex relative items-center">
        <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-gray-200 dark:bg-neutral-800 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <img
                src={currentTestimonial.imageUrl}
                alt={currentTestimonial.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 ml-[-80px] z-10 max-w-xl flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="mb-6">
                <AnimatedText
                  text={currentTestimonial.name}
                  className="py-0"
                  textClassName="text-3xl md:text-4xl font-bold"
                  hoverEffect
                />
                <BubbleText text={currentTestimonial.title} className="mt-1" />
              </div>

              <TypewriterEffectSmooth
                words={bioWords}
                className="mb-8 text-base leading-relaxed text-black"
                cursorClassName="bg-black"
              />

              <div className="flex space-x-4 flex-wrap gap-y-3">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url || '#'}
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                    className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white dark:text-gray-900" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="md:hidden max-w-sm mx-auto text-center bg-transparent">
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-3xl overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <img
                src={currentTestimonial.imageUrl}
                alt={currentTestimonial.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-4 py-5 bg-white rounded-3xl shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <AnimatedText
                text={currentTestimonial.name}
                className="justify-center py-0"
                textClassName="text-2xl sm:text-3xl font-bold"
                hoverEffect
              />
              <BubbleText text={currentTestimonial.title} className="text-center mt-1 mb-4" />
              <TypewriterEffectSmooth
                words={bioWords}
                className="justify-center mb-6 text-black"
                cursorClassName="bg-black"
              />

              <div className="flex justify-center space-x-4 flex-wrap gap-y-3">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url || '#'}
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                    className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white dark:text-gray-900" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={handlePrevious}
          aria-label="Previous testimonial"
          className="w-12 h-12 rounded-full bg-gray-100 dark:bg-card border border-gray-300 dark:border-card/40 shadow-md flex items-center justify-center hover:bg-gray-200 dark:hover:bg-card/80 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-50" />
        </button>

        <div className="flex gap-2">
          {items.map((_, testimonialIndex) => (
            <button
              key={testimonialIndex}
              onClick={() => setCurrentIndex(testimonialIndex)}
              className={cn(
                'w-3 h-3 rounded-full transition-colors cursor-pointer',
                testimonialIndex === currentIndex ? 'bg-gray-900 dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'
              )}
              aria-label={`Go to testimonial ${testimonialIndex + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="w-12 h-12 rounded-full bg-gray-100 dark:bg-card border border-gray-300 dark:border-card/40 shadow-md flex items-center justify-center hover:bg-gray-200 dark:hover:bg-card/80 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-50" />
        </button>
      </div>
    </div>
  );
}
