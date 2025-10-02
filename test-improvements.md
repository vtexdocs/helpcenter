# Copy for LLM Test Improvements

## Current Test Weaknesses

### 1. **Content Validation is Weak**
- ✅ Checks: Content is not empty
- ❌ Missing: Actual content verification
  
**Fix**: Add assertions like:
```javascript
// Verify content contains the actual page title
expect(text).to.include('How does VTEX support work')
// Verify content has substantial length (not just header)
expect(text.length).to.be.greaterThan(500)
// Verify it's actually markdown, not HTML
expect(text).to.not.include('<div')
expect(text).to.not.include('<p>')
```

### 2. **API Not Tested Directly**
- ❌ Missing: Direct API endpoint testing

**Fix**: Add API tests:
```javascript
it('Should return valid content from API endpoint', () => {
  cy.request({
    url: '/api/llm-content',
    qs: { section: 'tutorials', slug: 'how-does-vtex-support-work', locale: 'en' }
  }).then((response) => {
    expect(response.status).to.equal(200)
    expect(response.body.content).to.exist
    expect(response.body.content).to.include('# ')
  })
})
```

### 3. **Single Page Testing**
- ❌ Only tests one tutorial page

**Fix**: Test multiple content types:
```javascript
const testPages = [
  { section: 'tutorials', slug: 'some-tutorial', type: 'tutorial' },
  { section: 'faq', slug: 'some-faq', type: 'faq' },
  { section: 'announcements', slug: 'some-announcement', type: 'announcement' },
]
```

### 4. **No Error Handling Tests**
- ❌ What happens when things fail?

**Fix**: Add negative tests:
```javascript
it('Should handle API errors gracefully', () => {
  // Intercept API and make it fail
  cy.intercept('/api/llm-content*', { statusCode: 500 }).as('apiError')
  cy.visit(tutorialUrl)
  cy.contains('button', 'Copy for LLM').click()
  // Verify user gets appropriate feedback
})

it('Should handle missing content', () => {
  cy.visit('/docs/tutorials/nonexistent-page')
  // Should show 404 or appropriate message
})
```

### 5. **No Content Structure Validation**
- ❌ Just checks for any markdown character

**Fix**: Validate actual structure:
```javascript
// Should have frontmatter-like metadata (even if removed in future)
expect(text).to.match(/title:/i)
expect(text).to.match(/locale:/i)

// Should have meaningful headings
const headings = text.match(/^#+\s+.+$/gm)
expect(headings).to.have.length.greaterThan(1)

// Should preserve code blocks
if (text.includes('```')) {
  expect(text).to.match(/```[\s\S]+?```/)
}
```

### 6. **Language Content Not Validated**
- ✅ Checks: Content differs between languages
- ❌ Missing: Content is actually in the correct language

**Fix**: Add language detection:
```javascript
// Simple heuristics for language validation
it('Should have Spanish-specific content', () => {
  const spanishIndicators = ['cómo', 'qué', 'cuál', 'más', 'también']
  const hasSpanish = spanishIndicators.some(word => 
    copiedContents.es.toLowerCase().includes(word)
  )
  expect(hasSpanish).to.be.true
})
```

### 7. **No Performance/Size Checks**
- ❌ What if content is 10MB?

**Fix**: Add sanity checks:
```javascript
// Content shouldn't be suspiciously large or small
expect(text.length).to.be.within(100, 100000)
```

## Priority Fixes

### High Priority
1. Add API endpoint tests
2. Test multiple content types (tutorials, FAQ, etc.)
3. Validate actual content includes page title/key phrases
4. Add error handling tests

### Medium Priority  
5. Test special cases (code blocks, images, tables)
6. Add language-specific content validation
7. Test different viewport sizes

### Low Priority
8. Performance/load testing
9. Accessibility testing
10. Cross-browser testing

## Recommended Next Steps

1. **Snapshot Testing**: Save expected output for key pages and compare
2. **Contract Testing**: Define API response schema and validate
3. **Integration Tests**: Test the full flow from GitHub fetch to clipboard
4. **Visual Regression**: Screenshot tests to catch UI breaking changes
