import type { GetStaticProps } from 'next'
import InsertAccountName from 'components/insert-account-name'

export default function TestInsertAccountName() {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>InsertAccountName component</h1>

      <h2>faq-security-restricted-content (7AmPOGXykmE9SYyYDzdAZ4)</h2>
      <InsertAccountName id="7AmPOGXykmE9SYyYDzdAZ4" />

      <h2>protection-against-transaction-attacks (5t6HaGHiHFVrCIvePJKkV6)</h2>
      <InsertAccountName id="5t6HaGHiHFVrCIvePJKkV6" />

      <h2>orderform-settings (4zkfF1asM3ayvIigsySevw)</h2>
      <InsertAccountName id="4zkfF1asM3ayvIigsySevw" />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}
