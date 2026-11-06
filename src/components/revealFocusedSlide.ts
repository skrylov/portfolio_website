import type { FocusEvent } from 'react'

export function revealFocusedSlide({
  currentTarget,
  target,
}: FocusEvent<HTMLElement>) {
  if (
    currentTarget.contains(target) &&
    target.matches(':focus-visible') &&
    currentTarget.scrollWidth > currentTarget.clientWidth
  ) {
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
}
