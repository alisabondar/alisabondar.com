import styles from './Tape.module.css';

export type TapeVariant = 'clear' | 'career';

/**
 * The strip of tape holding a polaroid or sticky note to the page. Career milestones get coral washi tape
 * so the career arc stands out in the Journey; everything else gets clear tape.
 */
export function Tape({ variant = 'clear', small = false }: { variant?: TapeVariant; small?: boolean }) {
  return (
    <span
      className={`${styles.tape} ${variant === 'career' ? styles.career : styles.clear} ${small ? styles.small : ''}`}
      aria-hidden
    />
  );
}
