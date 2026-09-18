import type { IconProps } from '@vtex/brand-ui'
import { Icon } from '@vtex/brand-ui'

import type { IconComponent } from 'utils/typings/types'

const KnownIssueFixedIcon = (props: IconProps) => (
  <Icon {...props} viewBox="0 0 16 16" fill="none">
    <path
      d="M2.8 8.6 6.2 12 13.2 4.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)

const KnownIssueScheduledIcon = (props: IconProps) => (
  <Icon {...props} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5.9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 4.7V8.3l2.5 1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)

const KnownIssueClosedIcon = (props: IconProps) => (
  <Icon {...props} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5.9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5.2 8h5.6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
)

const KnownIssueBacklogIcon = (props: IconProps) => (
  <Icon {...props} viewBox="0 0 16 16" fill="none">
    <path
      d="M2.6 4.4h10.8M2.6 8h10.8M2.6 11.6h6.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Icon>
)

const KnownIssueUnknownIcon = (props: IconProps) => (
  <Icon {...props} viewBox="0 0 16 16" fill="none">
    <path
      d="M5.6 5.6c.3-1.2 1.3-2 2.6-2 1.5 0 2.5 1 2.5 2.3 0 1.1-.7 1.7-1.7 2.3-.8.4-1.1.8-1.1 1.6v.3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7.9" cy="12.4" r="1.05" fill="currentColor" />
  </Icon>
)

const KnownIssueNoFixIcon = (props: IconProps) => (
  <Icon {...props} viewBox="0 0 16 16" fill="none">
    <path
      d="M3.6 3.6l8.8 8.8M12.4 3.6l-8.8 8.8"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </Icon>
)

export const knownIssueStatusIcons: Record<string, IconComponent> = {
  Fixed: KnownIssueFixedIcon,
  Scheduled: KnownIssueScheduledIcon,
  Closed: KnownIssueClosedIcon,
  Backlog: KnownIssueBacklogIcon,
  Unknown: KnownIssueUnknownIcon,
  No_Fix: KnownIssueNoFixIcon,
}
