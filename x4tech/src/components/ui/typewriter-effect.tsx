import { cn } from '@/lib/utils';
import { motion, stagger, useAnimate, useInView } from 'framer-motion';
import { useEffect } from 'react';

interface WordItem {
  text: string;
  className?: string;
}

interface TypewriterEffectProps {
  words: WordItem[];
  className?: string;
  cursorClassName?: string;
}

export const TypewriterEffect = ({ words, className, cursorClassName }: TypewriterEffectProps) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(''),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        'span',
        {
          display: 'inline-block',
          opacity: 1,
          width: 'fit-content',
        },
        {
          duration: 0.2,
          delay: stagger(0.03),
          ease: 'easeInOut',
        }
      );
    }
  }, [isInView, animate]);

  return (
    <div className={cn('text-base sm:text-lg md:text-xl font-medium text-left text-black', className)}>
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <motion.span
                initial={{}}
                key={`char-${index}`}
                  className={cn('text-black opacity-0 hidden', word.className)}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </div>
        ))}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('inline-block rounded-sm w-[3px] h-4 md:h-5 bg-black ml-1', cursorClassName)}
      />
    </div>
  );
};

export const TypewriterEffectSmooth = ({ words, className, cursorClassName }: TypewriterEffectProps) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(''),
  }));

  return (
    <div className={cn('flex items-start space-x-1 my-2', className)}>
      <motion.div
        className="overflow-hidden pb-1"
        initial={{ width: '0%' }}
        whileInView={{ width: 'fit-content' }}
        transition={{ duration: 1.2, ease: 'linear', delay: 0.1 }}
      >
        <div className="text-sm sm:text-base md:text-lg leading-relaxed">
          {wordsArray.map((word, idx) => (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span key={`char-${index}`} className={cn('text-black', word.className)}>
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          ))}
        </div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('block rounded-sm w-[3px] h-4 sm:h-5 bg-black', cursorClassName)}
      />
    </div>
  );
};