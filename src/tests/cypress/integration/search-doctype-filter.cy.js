/// <reference types="cypress" />

// Blocked: depends on EDU-18406 (portal-side doctype filter UI)
describe.skip('Doctype filter UI (unblock after EDU-18406)', () => {
  it('renders filter tabs with per-doctype result counts')
  it('clicking a doctype tab narrows the result list')
  it('result counts reflect the active query')
  it('selecting "All" restores the unfiltered result list')
})
