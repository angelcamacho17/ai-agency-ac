/**
 * Anchor navigation that works in both modes. In track mode the chapter's
 * vertical position is its index along the wrapper; otherwise the browser's
 * own anchor jump is correct.
 */
export function scrollToChapter(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const rail = target.closest<HTMLElement>('[data-track]')
  const wrapper = rail?.parentElement?.parentElement
  if (!rail || !wrapper) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  const index = Array.from(rail.children).indexOf(target)
  const top = wrapper.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: top + index * window.innerHeight, behavior: 'smooth' })
}
