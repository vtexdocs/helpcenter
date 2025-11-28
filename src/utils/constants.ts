import { getMessages } from 'utils/get-messages'
import {
  getCommunityURL,
  getLearningCenterURL,
  getDeveloperPortalURL,
  getSupportURL,
  getFeedbackURL,
} from 'utils/get-url'

import {
  DocDataElement,
  ResourceDataElement,
  FaqDataElement,
  IconComponent,
} from './typings/types'
import { IntlShape } from 'react-intl'
import libraryConfig from './libraryConfig'
import DeveloperPortalIcon from 'components/icons/developer-portal-icon'
import StartHereIcon from 'components/icons/start-here-icon'
import TutorialsIcon from 'components/icons/tutorials-icon'
import PaperIcon from 'components/icons/paper-icon'
import WarningIcon from 'components/icons/warning-icon'
import GraphIcon from 'components/icons/graph-icon'
import MegaphoneIcon from 'components/icons/megaphone-icon'
import FAQIcon from 'components/icons/faq-icon'
import { LongArrowIcon } from '@vtexdocs/components'
import TroubleshootingIcon from 'components/icons/troubleshooting-icon'

libraryConfig
export const messages = getMessages()

export const menuDocumentationData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'tracks',
      Icon: StartHereIcon,
      title: intl.formatMessage({
        id: 'documentation_start_here.title',
      }),
      description: intl.formatMessage({
        id: 'documentation_start_here.description',
      }),
      link: '/docs/tracks',
    },
    {
      id: 'tutorials',
      Icon: TutorialsIcon,
      title: intl.formatMessage({
        id: 'documentation_tutorials.title',
      }),
      description: intl.formatMessage({
        id: 'documentation_tutorials.description',
      }),
      link: '/docs/tutorials',
    },
  ]
  return data
}

export const updatesData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'announcements',
      Icon: MegaphoneIcon,
      title: intl.formatMessage({
        id: 'announcements_page.title',
      }),
      description: intl.formatMessage({
        id: 'announcements_page.description',
      }),
      link: '/announcements',
    },
    {
      id: 'Status',
      Icon: GraphIcon,
      title: intl.formatMessage({
        id: 'menu_status.title',
      }),
      description: intl.formatMessage({
        id: 'menu_status.description',
      }),
      link: 'https://status.vtex.com',
      isExternalLink: true,
    },
    {
      id: 'Developer Portal',
      Icon: DeveloperPortalIcon,
      title: intl.formatMessage({
        id: 'documentation_developers_portal.title',
      }),
      description: intl.formatMessage({
        id: 'documentation_developers_portal.description',
      }),
      link: 'https://developers.vtex.com/',
      isExternalLink: true,
    },
  ]
  return data
}

export const feedbackSectionData = (intl: IntlShape, currentUrl?: string) => {
  const data: DocDataElement[] = [
    {
      id: 'Feedback',
      Icon: LongArrowIcon,
      title: intl.formatMessage({
        id: 'landing_page_header_feedback.message',
      }),
      description: '',
      link: getFeedbackURL(currentUrl),
    },
  ]

  return data
}

export const menuSupportData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'faq',
      Icon: FAQIcon,
      title: intl.formatMessage({ id: 'updates_info_notes.title' }),
      description: intl.formatMessage({
        id: 'updates_info_notes.description',
      }),
      link: '/faq',
    },
    {
      id: 'known-issues',
      Icon: WarningIcon,
      title: intl.formatMessage({
        id: 'sidebar_known_issues.title',
      }),
      description: intl.formatMessage({
        id: 'sidebar_known_issues.description',
      }),
      link: '/known-issues',
    },
    {
      id: 'troubleshooting',
      Icon: TroubleshootingIcon,
      title: intl.formatMessage({ id: 'menu_troubleshooting.title' }),
      description: intl.formatMessage({
        id: 'menu_troubleshooting.description',
      }),
      link: '/troubleshooting',
    },
    {
      id: 'Support Rules',
      Icon: PaperIcon,
      title: intl.formatMessage({
        id: 'sidebar_support_rules.title',
      }),
      description: intl.formatMessage({
        id: 'sidebar_support_rules.description',
      }),
      link: intl.formatMessage({
        id: 'sidebar_support_rules.link',
      }),
    },
  ]

  return data
}

export const faqData = (intl: IntlShape) => {
  const data: FaqDataElement[] = [
    {
      Icon: WarningIcon,
      title: intl.formatMessage({
        id: 'faq_handling.title',
      }),
      description: intl.formatMessage({
        id: 'faq_handling.description',
      }),
      productTeam: 'Post-purchase',
      link: '/faq/why-has-my-order-stopped-on-ready-for-handling',
    },
    {
      Icon: PaperIcon,
      title: intl.formatMessage({
        id: 'faq_carrier.title',
      }),
      description: intl.formatMessage({
        id: 'faq_carrier.description',
      }),
      productTeam: 'Post-purchase',
      link: '/faq/why-cant-i-see-my-carrier-on-checkout',
    },
    {
      Icon: GraphIcon,
      title: intl.formatMessage({
        id: 'faq_product_visible.title',
      }),
      description: intl.formatMessage({
        id: 'faq_product_visible.description',
      }),
      productTeam: 'Marketing & Merchandising',
      link: '/faq/why-is-the-product-not-visible-on-the-website',
    },
    {
      Icon: PaperIcon,
      title: intl.formatMessage({
        id: 'faq_order_error.title',
      }),
      description: intl.formatMessage({
        id: 'faq_order_error.description',
      }),
      productTeam: 'Post-purchase',
      link: '/faq/why-was-my-order-canceled',
    },
  ]
  return data
}

export const ICON_REGISTRY: Record<string, IconComponent> = {
  tracks: StartHereIcon,
  tutorials: TutorialsIcon,
  announcements: MegaphoneIcon,
  faq: FAQIcon,
  'known-issues': WarningIcon,
  troubleshooting: TroubleshootingIcon,
}

export const getIcon = (categoryId: string): IconComponent => {
  return ICON_REGISTRY[categoryId] || TutorialsIcon
}

export const resources = (intl: IntlShape) => {
  const data: ResourceDataElement[] = [
    {
      title: 'Community',
      description: intl.formatMessage({
        id: 'app_development_page_other_resources_community.description',
      }),
      link: getCommunityURL(),
    },
    {
      title: 'Learning Center',
      description: intl.formatMessage({
        id: 'app_development_page_other_resources_learning_center.description',
      }),
      link: getLearningCenterURL(),
    },
    {
      title: 'Developer Portal',
      description: intl.formatMessage({
        id: 'app_development_page_other_resources_github.description',
      }),
      link: getDeveloperPortalURL(),
    },
    {
      title: 'Support',
      description: intl.formatMessage({
        id: 'app_development_page_other_resources_support.description',
      }),
      link: getSupportURL(),
    },
  ]

  return data
}

export const knownIssuesStatusFilter = (intl: IntlShape) => {
  const data = {
    name: intl.formatMessage({
      id: 'known_issues_filter_status.title',
    }),
    options: [
      {
        id: 'Unknown',
        name: intl.formatMessage({ id: 'known_issues_filter_status.unknown' }),
      },
      {
        id: 'Closed',
        name: intl.formatMessage({ id: 'known_issues_filter_status.closed' }),
      },
      {
        id: 'Fixed',
        name: intl.formatMessage({ id: 'known_issues_filter_status.fixed' }),
      },
      {
        id: 'Backlog',
        name: intl.formatMessage({ id: 'known_issues_filter_status.backlog' }),
      },
      {
        id: 'Scheduled',
        name: intl.formatMessage({
          id: 'known_issues_filter_status.scheduled',
        }),
      },
      {
        id: 'No_Fix',
        name: intl.formatMessage({ id: 'known_issues_filter_status.no_fix' }),
      },
    ],
  }

  return data
}

export const knownIssuesModulesFilters = (intl: IntlShape) => {
  const data = {
    name: intl.formatMessage({
      id: 'known_issues_filter_modules.title',
    }),
    options: [
      {
        id: 'Pricing & Promotions',
        name: 'Pricing & Promotions',
      },
      {
        id: 'Catalog',
        name: 'Catalog',
      },
      {
        id: 'Connections',
        name: 'Connections',
      },
      {
        id: 'CMS',
        name: 'CMS',
      },
      {
        id: 'Checkout',
        name: 'Checkout',
      },
      {
        id: 'Identity',
        name: 'Identity',
      },
      {
        id: 'Storage',
        name: 'Storage',
      },
      {
        id: 'B2B',
        name: 'B2B',
      },
      {
        id: 'VTEX Shipping Network',
        name: 'VTEX Shipping Network',
      },
      {
        id: 'Message Center',
        name: 'Message Center',
      },
      {
        id: 'Store Framework',
        name: 'Store Framework',
      },
      {
        id: 'Payments',
        name: 'Payments',
      },
      {
        id: 'Portal',
        name: 'Portal',
      },
      {
        id: 'Suggestions',
        name: 'Suggestions',
      },
      {
        id: 'Order Management',
        name: 'Order Management',
      },
      {
        id: 'Physical Stores',
        name: 'Physical Stores',
      },
      {
        id: 'Marketplace',
        name: 'Marketplace',
      },
      {
        id: 'Analytics',
        name: 'Analytics',
      },
      {
        id: 'Intelligent Search',
        name: 'Intelligent Search',
      },
      {
        id: 'Logistics',
        name: 'Logistics',
      },
      {
        id: 'Gift Card',
        name: 'Gift Card',
      },
      {
        id: 'Master Data',
        name: 'Master Data',
      },
      {
        id: 'My Orders',
        name: 'My Orders',
      },
      {
        id: 'Webservice',
        name: 'Webservice',
      },
      {
        id: 'License Manager',
        name: 'License Manager',
      },
    ],
  }

  return data
}

export const sortBy = (intl: IntlShape) => {
  const data = [
    {
      value: 'recently_updated',
      content: intl.formatMessage({ id: 'sort.recently_updated' }),
    },
    {
      value: 'newest',
      content: intl.formatMessage({ id: 'sort.newest' }),
    },
  ]

  return data
}

export const faqFilter = (intl: IntlShape) => {
  const data = {
    name: intl.formatMessage({ id: 'faq_filter.title' }),
    options: [
      {
        id: 'Shopping',
        name: 'Shopping',
      },
      {
        id: 'Post-purchase',
        name: 'Post-purchase',
      },
      {
        id: 'Marketing & Merchandising',
        name: 'Marketing & Merchandising',
      },
      {
        id: 'Financial',
        name: 'Financial',
      },
      {
        id: 'Channels',
        name: 'Channels',
      },
      {
        id: 'VTEX IO',
        name: 'VTEX IO',
      },
      {
        id: 'Master Data',
        name: 'Master Data',
      },
      {
        id: 'Identity',
        name: 'Identity',
      },
      {
        id: 'Reliability',
        name: 'Reliability',
      },
      {
        id: 'Others',
        name: 'Others',
      },
      {
        id: 'Apps',
        name: 'Apps',
      },
      {
        id: 'Billing',
        name: 'Billing',
      },
      {
        id: 'Management',
        name: 'Management',
      },
    ],
  }

  return data
}

export const contentfulAuthor: { [key: string]: string } = {
  '2p7evLfTcDrhc5qtrzbLWD': 'anabaarbosa',
  YRJ73j8mt38D5TUleocQB: 'barbara-celi',
  '127RQ7SUoFfyTh5gbXUpdM': 'brunoamui',
  '1u80f14cWqneWquMc8tUq1': 'carolinamenezes',
  '2AhArvGNSPKwUAd8GOz0iU': 'geisecosta',
  '4ubliktPJIsvyl1hq91RdK': 'henriquessb',
  '5l9ZQjiivHzkEVjafL4O6v': 'Isabella-Veloso',
  '1malnhMX0vPThsaJaZMYm2': 'julia-rabello',
  '2o8pvz6z9hvxvhSoKAiZzg': 'karenkrieger',
  '4oTZzwYoyhy1tDBwLuemdG': 'mariana-caetano',
  '4JJllZ4I71DHhIOaLOE3nz': 'mariananantua',
  '2Gy429C47ie3tL9XUEjeFL': 'PedroAntunesCosta',
  '6DODK49lJPk3yvcoe6GB6g': 'ricardoaerobr',
  '56yU9Wz6mLwmzo82TjgAHy': 'georgebrindeiro',
}
