import { cn } from '../../styles/helpers';

export function Button({ className, as: Comp = 'button', children, ...props }) {
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.08em] uppercase transition duration-200',
        'bg-[var(--brand)] text-white shadow-[0_14px_35px_rgba(41,73,54,0.18)] hover:-translate-y-0.5 hover:bg-[#1f3829]',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
