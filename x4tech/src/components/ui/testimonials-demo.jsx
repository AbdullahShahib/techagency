import React from 'react';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { motion } from 'motion/react';

const testimonials = [
  {
    text: 'This ERP revolutionized our operations, streamlining finance and inventory. The cloud platform keeps us productive remotely.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    name: 'Briana Patton',
    role: 'Operations Manager',
  },
  {
    text: 'Implementation was smooth and quick. The customizable interface made team onboarding effortless.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    name: 'Bilal Ahmed',
    role: 'IT Manager',
  },
  {
    text: 'The support team is exceptional, guiding us through setup and ongoing optimization.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    name: 'Saman Malik',
    role: 'Customer Support Lead',
  },
  {
    text: 'This solution improved operations and efficiency with an intuitive user experience.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    name: 'Omar Raza',
    role: 'CEO',
  },
  {
    text: 'Robust features and quick support transformed our workflow significantly.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
    name: 'Zainab Hussain',
    role: 'Project Manager',
  },
  {
    text: 'The smooth implementation exceeded expectations and improved business outcomes.',
    image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&q=80',
    name: 'Aliza Khan',
    role: 'Business Analyst',
  },
  {
    text: 'Our presence and conversions improved significantly after launch.',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=100&q=80',
    name: 'Farhan Siddiqui',
    role: 'Marketing Director',
  },
  {
    text: 'They understood our needs and delivered a solution beyond expectations.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    name: 'Sana Sheikh',
    role: 'Sales Manager',
  },
  {
    text: 'Using this platform, our performance and team efficiency improved rapidly.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
    name: 'Hassan Ali',
    role: 'E-commerce Manager',
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function TestimonialsDemo() {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
