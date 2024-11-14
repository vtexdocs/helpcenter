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
  WhatsNextDataElement,
  ResourceDataElement,
  FaqDataElement,
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
import LongArrowIcon from 'components/icons/long-arrow-icon'
import TroubleshootingIcon from 'components/icons/troubleshooting-icon'

libraryConfig
export const messages = getMessages()

export const documentationData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'Start here',
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
      id: 'Tutorials',
      Icon: TutorialsIcon,
      title: intl.formatMessage({
        id: 'documentation_tutorials.title',
      }),
      description: intl.formatMessage({
        id: 'documentation_tutorials.description',
      }),
      link: '/docs/tutorial',
    },
    {
      id: 'Developers Portal',
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

export const menuDocumentationData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'Start here',
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
      id: 'Tutorials',
      Icon: TutorialsIcon,
      title: intl.formatMessage({
        id: 'documentation_tutorials.title',
      }),
      description: intl.formatMessage({
        id: 'documentation_tutorials.description',
      }),
      link: '/docs/tutorial',
    },
    {
      id: 'Developers Portal',
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

export const updatesData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'FAQ',
      Icon: FAQIcon,
      title: intl.formatMessage({ id: 'updates_info_notes.title' }),
      description: intl.formatMessage({
        id: 'updates_info_notes.description',
      }),
      link: '/faq',
    },
    {
      id: 'Announcements',
      Icon: MegaphoneIcon,
      title: intl.formatMessage({
        id: 'announcements_page.title',
      }),
      description: intl.formatMessage({
        id: 'announcements_page.description',
      }),
      link: '/announcements',
    },
  ]
  return data
}

export const feedbackSectionData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'Feedback',
      Icon: LongArrowIcon,
      title: intl.formatMessage({
        id: 'landing_page_header_feedback.message',
      }),
      description: '',
      link: getFeedbackURL(),
    },
  ]

  return data
}

export const knownIssuesData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'Known Issues',
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
    {
      id: 'Troubleshooting',
      Icon: TroubleshootingIcon,
      title: intl.formatMessage({
        id: 'sidebar_troubleshooting.title',
      }),
      description: 'sidebar_troubleshooting.description',
      link: '/troubleshooting',
    },
  ]

  return data
}

export const menuSupportData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'Known Issues',
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
      id: 'Status',
      Icon: GraphIcon,
      title: intl.formatMessage({
        id: 'menu_status.title',
      }),
      description: intl.formatMessage({
        id: 'menu_status.description',
      }),
      link: 'https://status.vtex.com',
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
    {
      id: 'Troubleshooting',
      Icon: TroubleshootingIcon,
      title: intl.formatMessage({ id: 'menu_troubleshooting.title' }),
      description: intl.formatMessage({
        id: 'menu_troubleshooting.description',
      }),
      link: '/troubleshooting',
    },
  ]

  return data
}

export const faqData = (intl: IntlShape) => {
  const data: FaqDataElement[] = [
    {
      Icon: PaperIcon,
      title: intl.formatMessage({
        id: 'faq_order_error.title',
      }),
      description: intl.formatMessage({
        id: 'faq_order_error.description',
      }),
      productTeam: 'Channels',
      link: '/faq/order-errors-in-marketplace-integrations',
    },
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
        id: 'faq_carrier.title',
      }),
      description: intl.formatMessage({
        id: 'faq_carrier.description',
      }),
      productTeam: 'Post-purchase',
      link: '/faq/why-cant-i-see-my-carrier-on-checkout',
    },
  ]
  return data
}

export const supportData = (intl: IntlShape) => {
  const data: DocDataElement[] = [
    {
      id: 'Known Issues',
      Icon: WarningIcon,
      title: intl.formatMessage({
        id: 'support_known_issues.title',
      }),
      description: intl.formatMessage({
        id: 'support_known_issues.description',
      }),
      link: '/known-issues',
    },
    {
      id: 'Support Plans',
      Icon: PaperIcon,
      title: intl.formatMessage({
        id: 'support_plans.title',
      }),
      description: intl.formatMessage({
        id: 'support_plans.description',
      }),
      link: intl.formatMessage({
        id: 'support_plans.link',
      }),
    },
    {
      id: 'Status',
      Icon: GraphIcon,
      title: intl.formatMessage({
        id: 'support_status.title',
      }),
      description: intl.formatMessage({
        id: 'support_status.description',
      }),
      isExternalLink: true,
      link: 'https://status.vtex.com/',
    },
  ]
  return data
}

export const getIcon = (doc: string, intl: IntlShape) => {
  return (
    documentationData(intl).find((icon) => icon.title === doc)?.Icon ||
    updatesData(intl).find((icon) => icon.title === doc)?.Icon
  )
}

export const whatsNextData = (intl: IntlShape) => {
  const data: WhatsNextDataElement[] = [
    {
      title: intl.formatMessage({
        id: 'app_development_page_new_to_app_development.title',
      }),
      description: intl.formatMessage({
        id: 'app_development_page_new_to_app_development.description',
      }),
      linkTitle: intl.formatMessage({
        id: 'app_development_page_new_to_app_development.link',
      }),
      linkTo: '/docs/guides/vtex-io-getting-started',
    },
    {
      title: intl.formatMessage({
        id: 'app_development_page_solve_real_world_issues.title',
      }),
      description: intl.formatMessage({
        id: 'app_development_page_solve_real_world_issues.description',
      }),
      linkTitle: intl.formatMessage({
        id: 'app_development_page_solve_real_world_issues.link',
      }),
      linkTo: '/docs/guides/app-development-guides',
    },
    {
      title: intl.formatMessage({
        id: 'app_development_page_build_foundations.title',
      }),
      description: intl.formatMessage({
        id: 'app_development_page_build_foundations.description',
      }),
      linkTitle: intl.formatMessage({
        id: 'app_development_page_build_foundations.link',
      }),
      linkTo: '/docs/guides/concepts',
    },
    {
      title: intl.formatMessage({
        id: 'app_development_page_go_further.title',
      }),
      description: intl.formatMessage({
        id: 'app_development_page_go_further.description',
      }),
      linkTitle: intl.formatMessage({
        id: 'app_development_page_go_further.link',
      }),
      linkTo:
        '/docs/guides/vtex-io-documentation-homologation-requirements-for-vtex-app-store',
    },
  ]
  return data
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
        id: 'No fix',
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

export const TroubleshootingFilters = (intl: IntlShape) => {
  const data = {
    name: intl.formatMessage({ id: 'troubleshooting_filter_module.title' }),
    options: [
      { id: 'Catalog', name: 'Catalog' },
      { id: 'Order', name: 'Order' },
      { id: 'Shipping', name: 'Shipping' },
      { id: 'VTEX Admin', name: 'VTEX Admin' },
      { id: 'Prices', name: 'Prices' },
      { id: 'Message Center', name: 'Message Center' },
      { id: 'Trade Policy', name: 'Trade Policy' },
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

export const additionalResourcesSitemap = (intl: IntlShape) => {
  const data: {
    documentation: string
    children: { name: string; link: string; icon: boolean }[]
  } = {
    documentation: intl.formatMessage({
      id: 'sitemap_page_section_additional_resources.title',
    }),
    children: [
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.faq',
        }),
        link: '/faq',
        icon: false,
      },
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.known_issues',
        }),
        link: '/known-issues',
        icon: false,
      },
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.support_rules',
        }),
        link: '#', // TODO: trocar rota
        icon: false,
      },
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.announcements',
        }),
        link: '/announcements',
        icon: false,
      },
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.dev_portal',
        }),
        link: getDeveloperPortalURL(),
        icon: true,
      },
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.support',
        }),
        link: getSupportURL(),
        icon: true,
      },
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.community',
        }),
        link: getCommunityURL(),
        icon: true,
      },
      {
        name: intl.formatMessage({
          id: 'sitemap_page_section_additional_resources.feedback',
        }),
        link: getFeedbackURL(),
        icon: true,
      },
    ],
  }

  return data
}
