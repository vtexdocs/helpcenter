/**
 * Push custom GA event for locale switch to GTM dataLayer.
 * Configure a GTM trigger on event name "locale-switch" to send to GA4.
 */
export function trackLocaleSwitch(fromLocale: string, toLocale: string): void {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any
  if (win.dataLayer) {
    win.dataLayer.push({
      event: 'locale-switch',
      locale_from: fromLocale,
      locale_to: toLocale,
    })
  }
}
