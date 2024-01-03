import type { IconProps } from '@vtex/brand-ui'
import { Icon } from '@vtex/brand-ui'

const NewIcon = (props: IconProps) => (
  <Icon
    {...props}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8.50146" cy="8" r="8" fill="#F71963" />
    <g clipPath="url(#clip0_462_17766)">
      <path
        d="M12.6681 6L8.7098 9.95833L6.62646 7.875L3.50146 11"
        stroke="#FFF3F6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1685 6H12.6685V8.5"
        stroke="#FFF3F6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_462_17766">
        <rect
          width="11"
          height="9"
          fill="white"
          transform="translate(2.50146 4)"
        />
      </clipPath>
    </defs>
  </Icon>
)

export default NewIcon
