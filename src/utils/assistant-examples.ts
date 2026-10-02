import {
  FAQIcon,
  GearTroubleshootingIcon,
  GraphIcon,
  PaperIcon,
  StartHereIcon,
  TutorialsIcon,
} from '@vtexdocs/components'
import type { AskAssistantExampleCategory } from '@vtexdocs/components'
import { IntlShape } from 'react-intl'

export const assistantExamples = (
  intl: IntlShape
): AskAssistantExampleCategory[] => [
  {
    id: 'catalog',
    title: intl.formatMessage({ id: 'ask_assistant.catalog.title' }),
    Icon: PaperIcon,
    questions: [
      intl.formatMessage({ id: 'ask_assistant.catalog.q0' }),
      intl.formatMessage({ id: 'ask_assistant.catalog.q1' }),
      intl.formatMessage({ id: 'ask_assistant.catalog.q2' }),
    ],
  },
  {
    id: 'logistics',
    title: intl.formatMessage({ id: 'ask_assistant.logistics.title' }),
    Icon: GearTroubleshootingIcon,
    questions: [
      intl.formatMessage({ id: 'ask_assistant.logistics.q0' }),
      intl.formatMessage({ id: 'ask_assistant.logistics.q1' }),
      intl.formatMessage({ id: 'ask_assistant.logistics.q2' }),
    ],
  },
  {
    id: 'pricing',
    title: intl.formatMessage({ id: 'ask_assistant.pricing.title' }),
    Icon: GraphIcon,
    questions: [
      intl.formatMessage({ id: 'ask_assistant.pricing.q0' }),
      intl.formatMessage({ id: 'ask_assistant.pricing.q1' }),
      intl.formatMessage({ id: 'ask_assistant.pricing.q2' }),
    ],
  },
  {
    id: 'orders',
    title: intl.formatMessage({ id: 'ask_assistant.orders.title' }),
    Icon: TutorialsIcon,
    questions: [
      intl.formatMessage({ id: 'ask_assistant.orders.q0' }),
      intl.formatMessage({ id: 'ask_assistant.orders.q1' }),
      intl.formatMessage({ id: 'ask_assistant.orders.q2' }),
    ],
  },
  {
    id: 'payments',
    title: intl.formatMessage({ id: 'ask_assistant.payments.title' }),
    Icon: FAQIcon,
    questions: [
      intl.formatMessage({ id: 'ask_assistant.payments.q0' }),
      intl.formatMessage({ id: 'ask_assistant.payments.q1' }),
      intl.formatMessage({ id: 'ask_assistant.payments.q2' }),
    ],
  },
  {
    id: 'go-live',
    title: intl.formatMessage({ id: 'ask_assistant.go_live.title' }),
    Icon: StartHereIcon,
    questions: [
      intl.formatMessage({ id: 'ask_assistant.go_live.q0' }),
      intl.formatMessage({ id: 'ask_assistant.go_live.q1' }),
      intl.formatMessage({ id: 'ask_assistant.go_live.q2' }),
    ],
  },
]
