import type { IconProps } from '@vtex/brand-ui'
import { Icon } from '@vtex/brand-ui'

const WarningIcon = (props: IconProps) => (
  <Icon
    {...props}
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.71758 1.89497L1.36508 12.5C1.2341 12.7268 1.1648 12.9839 1.16407 13.2459C1.16334 13.5078 1.23119 13.7653 1.3609 13.9929C1.4906 14.2204 1.67762 14.41 1.90336 14.5429C2.12909 14.6757 2.38568 14.7471 2.64758 14.75H15.3526C15.6145 14.7471 15.8711 14.6757 16.0968 14.5429C16.3225 14.41 16.5096 14.2204 16.6393 13.9929C16.769 13.7653 16.8368 13.5078 16.8361 13.2459C16.8354 12.9839 16.766 12.7268 16.6351 12.5L10.2826 1.89497C10.1489 1.67455 9.96062 1.49231 9.73597 1.36583C9.51133 1.23936 9.25788 1.17291 9.00008 1.17291C8.74227 1.17291 8.48882 1.23936 8.26418 1.36583C8.03953 1.49231 7.85128 1.67455 7.71758 1.89497Z"
      stroke="currentcolor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 5.75V8.75"
      stroke="currentcolor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11.75H9.0075"
      stroke="red"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)

export default WarningIcon
