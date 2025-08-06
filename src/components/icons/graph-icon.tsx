import type { IconProps } from '@vtex/brand-ui'
import { Icon } from '@vtex/brand-ui'

const GraphIcon = (props: IconProps) => (
  <Icon
    {...props}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5993 9.03607H12.749L10.6112 11.2461L6.33574 6.82608L4.19799 9.03607H1.34766"
      stroke="currentcolor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 14V3C1 1.89543 1.89543 1 3 1H14C15.1046 1 16 1.89543 16 3V14C16 15.1046 15.1046 16 14 16H3C1.89543 16 1 15.1046 1 14Z"
      stroke="currentcolor"
      strokeWidth="1.5"
    />
  </Icon>
)

export default GraphIcon
