import type { IconProps } from '@vtex/brand-ui'
import { Icon } from '@vtex/brand-ui'

// <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
// </svg>

const ListViewIcon = (props: IconProps) => (
  <Icon
    {...props}
    viewBox="0 0 18.3333 18.3333"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{}}
  >
    <rect
      x="0.555542"
      y="0.333374"
      width="18.3333"
      height="18.3333"
      rx="1.52778"
      fill={props.fill ?? 'none'}
    />
    <path
      d="M1.63892 9.04173C1.63892 8.15695 1.82357 7.97229 2.70836 7.97229H15.8472C16.732 7.97229 16.9167 8.15695 16.9167 9.04173V9.9584C16.9167 10.8432 16.732 11.0278 15.8472 11.0278H2.70836C1.82357 11.0278 1.63892 10.8432 1.63892 9.9584V9.04173Z"
      stroke="#5E6E84"
      stroke-width="1.14583"
      stroke-linecap="round"
    />
    <path
      d="M1.63892 2.93065C1.63892 2.04586 1.82357 1.86121 2.70836 1.86121H15.8472C16.732 1.86121 16.9167 2.04586 16.9167 2.93065V3.84732C16.9167 4.7321 16.732 4.91676 15.8472 4.91676H2.70836C1.82357 4.91676 1.63892 4.7321 1.63892 3.84732V2.93065Z"
      stroke="#5E6E84"
      stroke-width="1.14583"
      stroke-linecap="round"
    />
    <path
      d="M1.63892 15.1528C1.63892 14.268 1.82357 14.0834 2.70836 14.0834H15.8472C16.732 14.0834 16.9167 14.268 16.9167 15.1528V16.0695C16.9167 16.9543 16.732 17.1389 15.8472 17.1389H2.70836C1.82357 17.1389 1.63892 16.9543 1.63892 16.0695V15.1528Z"
      stroke="#5E6E84"
      stroke-width="1.14583"
      stroke-linecap="round"
    />
  </Icon>
)

export default ListViewIcon
