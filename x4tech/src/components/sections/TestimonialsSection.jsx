import React, { useEffect, useMemo, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { getAll, COLS } from '../../lib/firestore';
import { sanitizeImageUrl } from '../../lib/utils';
import { TestimonialsColumn } from '../../components/ui/testimonials-columns-1';
import { motion } from 'motion/react';

const testimonials = [
  {
    text: 'X4Tech completely transformed our online presence. The website they built for us loads fast and converts better than ever.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    name: 'Arjun Mehta',
    role: 'CEO, NovaTrade',
  },
  {
    text: 'They understood our business quickly and delivered polished design and development with great communication throughout.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    name: 'Priya Sharma',
    role: 'Founder, Bloom Wellness',
  },
  {
    text: 'Our app shipped ahead of schedule and the quality is excellent. We finally have a partner we can trust long term.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
    name: 'Daniel Osei',
    role: 'CTO, FlowFinance',
  },
  {
    text: 'They challenged weak ideas and proposed better solutions. That strategic input made a huge difference in our product.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    name: 'Sara Liu',
    role: 'Product Manager, Orbit SaaS',
  },
  {
    text: 'Support has been exceptional from kickoff to launch. Every milestone was clear, and delivery was reliable.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    name: 'Sana Sheikh',
    role: 'Sales Manager',
  },
  {
    text: 'The new platform improved team productivity immediately. It is intuitive, fast, and very stable in daily use.',
    image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&q=80',
    name: 'Bilal Ahmed',
    role: 'IT Manager',
  },
  {
    text: 'From design to implementation, execution quality was top tier. We saw conversion improvements within weeks.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    name: 'Farhan Siddiqui',
    role: 'Marketing Director',
  },
  {
    text: 'Their team moved quickly without sacrificing quality. We now have a website and admin workflow that scales.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
    name: 'Zainab Hussain',
    role: 'Project Manager',
  },
  {
    text: 'This collaboration exceeded expectations. Their blend of design thinking and engineering discipline is rare.',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=100&q=80',
    name: 'Hassan Ali',
    role: 'E-commerce Manager',
  },
];

export default function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const sectionRef = useReveal();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAll(COLS.TESTIMONIALS);
        if (alive && Array.isArray(data) && data.length) {
          const mapped = data
            .filter(t => t.visible !== false)
            .map(t => ({
              id: t.id,
              text: t.quote || '',
              image: sanitizeImageUrl(t.avatarUrl),
              name: t.clientName || 'Client',
              role: [t.role, t.company].filter(Boolean).join(', '),
            }));
          setItems(mapped);
        }
      } catch (_) {
        // Keep local fallback data if Firestore read fails.
      }
    })();
    return () => { alive = false; };
  }, []);

  const testimonialsToShow = items.length ? items : testimonials;
  const normalized = useMemo(() => {
    const list = testimonialsToShow.filter(t => t.text && t.name);
    if (!list.length) return testimonials;
    return list;
  }, [testimonialsToShow]);

  const firstColumn = normalized.slice(0, 3);
  const secondColumn = normalized.slice(3, 6);
  const thirdColumn = normalized.slice(6, 9);

  return (
    <section ref={sectionRef} className="bg-background my-20 relative">
      <div className="container z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-x4-border py-1 px-4 rounded-lg text-x4-cyan font-mono text-xs uppercase tracking-[0.2em]">Testimonials</div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mt-5 text-center">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75 text-x4-muted">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn.length ? firstColumn : normalized.slice(0, 3)} duration={15} />
          <TestimonialsColumn testimonials={secondColumn.length ? secondColumn : normalized.slice(0, 3)} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn.length ? thirdColumn : normalized.slice(0, 3)} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80';
