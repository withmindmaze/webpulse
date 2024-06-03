//@ts-nocheck
import clsx from 'clsx'
import Link from 'next/link'

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors',
  outline:
    'inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors',
}

const variantStyles = {
  solid: {
    cyan: 'relative overflow-hidden bg-cyan-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-cyan-600 active:text-white/80 before:transition-colors',
    white:
      'bg-white text-cyan-900 hover:bg-white/90 active:bg-white/90 active:text-cyan-900/70',
    gray: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80',
  },
  outline: {
    gray: 'border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80',
  },
}

type ButtonProps = (
  | {
    variant?: 'solid'
    color?: keyof typeof variantStyles.solid
  }
  | {
    variant: 'outline'
    color?: keyof typeof variantStyles.outline
  }
) &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'>
    | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & {
      href?: undefined
    })
  ) & {
    disabled?: boolean
  }

export function Button({ className, disabled, ...props }: ButtonProps) {
  props.variant ??= 'solid'
  props.color ??= 'gray'

  const appliedColor =
    disabled ? 'gray' : props.color

  className = clsx(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[appliedColor]
      : props.variant === 'solid'
        ? variantStyles.solid[appliedColor]
        : undefined,
    className,
    disabled && 'cursor-not-allowed opacity-50'
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} disabled={disabled} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
