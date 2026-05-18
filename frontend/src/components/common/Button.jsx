import { cn } from '../../styles/helpers';

export function Button({ className, as: Comp = 'button', children, ...props }) {
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200',
        'bg-[var(--brand)] text-white hover:bg-[#1f3829]',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
