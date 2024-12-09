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

export const documentationData = (locale: 'en' | 'pt' | 'es') => {
  const data: DocDataElement[] = [
    {
      id: 'Start here',
      Icon: StartHereIcon,
      title: messages[locale]['documentation_start_here.title'],
      description: messages[locale]['documentation_start_here.description'],
      link: '/docs/tracks',
    },
    {
      id: 'Tutorials',
      Icon: TutorialsIcon,
      title: messages[locale]['documentation_tutorials.title'],
      description: messages[locale]['documentation_tutorials.description'],
      link: '/docs/tutorial',
    },
    {
      id: 'Developers Portal',
      Icon: DeveloperPortalIcon,
      title: messages[locale]['documentation_developers_portal.title'],
      description:
        messages[locale]['documentation_developers_portal.description'],
      link: 'https://developers.vtex.com/',
      isExternalLink: true,
    },
  ]
  return data
}

export const menuDocumentationData = (locale: 'en' | 'pt' | 'es') => {
  const data: DocDataElement[] = [
    {
      id: 'Start here',
      Icon: StartHereIcon,
      title: messages[locale]['documentation_start_here.title'],
      description: messages[locale]['documentation_start_here.description'],
      link: '/docs/tracks',
    },
    {
      id: 'Tutorials',
      Icon: TutorialsIcon,
      title: messages[locale]['documentation_tutorials.title'],
      description: messages[locale]['documentation_tutorials.description'],
      link: '/docs/tutorial',
    },
    {
      id: 'Developers Portal',
      Icon: DeveloperPortalIcon,
      title: messages[locale]['documentation_developers_portal.title'],
      description:
        messages[locale]['documentation_developers_portal.description'],
      link: 'https://developers.vtex.com/',
      isExternalLink: true,
    },
  ]
  return data
}

export const updatesData = (locale: 'en' | 'pt' | 'es') => {
  const data: DocDataElement[] = [
    {
      id: 'FAQ',
      Icon: FAQIcon,
      title: messages[locale]['updates_info_notes.title'],
      description: messages[locale]['updates_info_notes.description'],
      link: '/faq',
    },
    {
      id: 'Announcements',
      Icon: MegaphoneIcon,
      title: messages[locale]['announcements_page.title'],
      description: messages[locale]['announcements_page.description'],
      link: '/announcements',
    },
  ]
  return data
}

export const feedbackSectionData = (locale: 'en' | 'pt' | 'es') => {
  const data: DocDataElement[] = [
    {
      id: 'Feedback',
      Icon: LongArrowIcon,
      title: messages[locale]['landing_page_header_feedback.message'],
      description: '',
      link: getFeedbackURL(),
    },
  ]

  return data
}

export const knownIssuesData = (locale: 'en' | 'pt' | 'es') => {
  const data: DocDataElement[] = [
    {
      id: 'Known Issues',
      Icon: WarningIcon,
      title: messages[locale]['sidebar_known_issues.title'],
      description: messages[locale]['sidebar_known_issues.description'],
      link: '/known-issues',
    },
    {
      id: 'Support Rules',
      Icon: PaperIcon,
      title: messages[locale]['sidebar_support_rules.title'],
      description: messages[locale]['sidebar_support_rules.description'],
      link: messages[locale]['sidebar_support_rules.link'],
    },
    {
      id: 'Troubleshooting',
      Icon: TroubleshootingIcon,
      title: messages[locale]['sidebar_troubleshooting.title'],
      description: messages[locale]['sidebar_troubleshooting.description'],
      link: '/troubleshooting',
    },
  ]

  return data
}

export const menuSupportData = (locale: 'en' | 'pt' | 'es') => {
  const data: DocDataElement[] = [
    {
      id: 'Known Issues',
      Icon: WarningIcon,
      title: messages[locale]['sidebar_known_issues.title'],
      description: messages[locale]['sidebar_known_issues.description'],
      link: '/known-issues',
    },
    {
      id: 'Status',
      Icon: GraphIcon,
      title: messages[locale]['menu_status.title'],
      description: messages[locale]['menu_status.description'],
      link: 'https://status.vtex.com',
    },
    {
      id: 'Support Rules',
      Icon: PaperIcon,
      title: messages[locale]['sidebar_support_rules.title'],
      description: messages[locale]['sidebar_support_rules.description'],
      link: messages[locale]['sidebar_support_rules.link'],
    },
    {
      id: 'Troubleshooting',
      Icon: TroubleshootingIcon,
      title: messages[locale]['menu_troubleshooting.title'],
      description: messages[locale]['menu_troubleshooting.description'],
      link: '/troubleshooting',
    },
  ]

  return data
}

export const faqData = (locale: 'en' | 'pt' | 'es') => {
  const data: FaqDataElement[] = [
    {
      Icon: PaperIcon,
      title: messages[locale]['faq_order_error.title'],
      description: messages[locale]['faq_order_error.description'],
      productTeam: 'Channels',
      link: '/faq/order-errors-in-marketplace-integrations',
    },
    {
      Icon: WarningIcon,
      title: messages[locale]['faq_handling.title'],
      description: messages[locale]['faq_handling.description'],
      productTeam: 'Post-purchase',
      link: '/faq/why-has-my-order-stopped-on-ready-for-handling',
    },
    {
      Icon: GraphIcon,
      title: messages[locale]['faq_product_visible.title'],
      description: messages[locale]['faq_product_visible.description'],
      productTeam: 'Marketing & Merchandising',
      link: '/faq/why-is-the-product-not-visible-on-the-website',
    },
    {
      Icon: PaperIcon,
      title: messages[locale]['faq_carrier.title'],
      description: messages[locale]['faq_carrier.description'],
      productTeam: 'Post-purchase',
      link: '/faq/why-cant-i-see-my-carrier-on-checkout',
    },
  ]
  return data
}

export const supportData = (locale: 'en' | 'pt' | 'es') => {
  const data: DocDataElement[] = [
    {
      id: 'Known Issues',
      Icon: WarningIcon,
      title: messages[locale]['support_known_issues.title'],
      description: messages[locale]['support_known_issues.description'],
      link: '/known-issues',
    },
    {
      id: 'Support Plans',
      Icon: PaperIcon,
      title: messages[locale]['support_plans.title'],
      description: messages[locale]['support_plans.description'],
      link: messages[locale]['support_plans.link'],
    },
    {
      id: 'Status',
      Icon: GraphIcon,
      title: messages[locale]['support_status.title'],
      description: messages[locale]['support_status.description'],
      isExternalLink: true,
      link: 'https://status.vtex.com/',
    },
  ]
  return data
}

export const getIcon = (doc: string, locale: 'en' | 'pt' | 'es') => {
  return (
    documentationData(locale).find((icon) => icon.title === doc)?.Icon ||
    updatesData(locale).find((icon) => icon.title === doc)?.Icon
  )
}

export const whatsNextData = (locale: 'en' | 'pt' | 'es') => {
  const data: WhatsNextDataElement[] = [
    {
      title:
        messages[locale]['app_development_page_new_to_app_development.title'],
      description:
        messages[locale][
          'app_development_page_new_to_app_development.description'
        ],
      linkTitle:
        messages[locale]['app_development_page_new_to_app_development.link'],
      linkTo: '/docs/guides/vtex-io-getting-started',
    },
    {
      title:
        messages[locale]['app_development_page_solve_real_world_issues.title'],
      description:
        messages[locale][
          'app_development_page_solve_real_world_issues.description'
        ],
      linkTitle:
        messages[locale]['app_development_page_solve_real_world_issues.link'],
      linkTo: '/docs/guides/app-development-guides',
    },
    {
      title: messages[locale]['app_development_page_build_foundations.title'],
      description:
        messages[locale]['app_development_page_build_foundations.description'],
      linkTitle:
        messages[locale]['app_development_page_build_foundations.link'],
      linkTo: '/docs/guides/concepts',
    },
    {
      title: messages[locale]['app_development_page_go_further.title'],
      description:
        messages[locale]['app_development_page_go_further.description'],
      linkTitle: messages[locale]['app_development_page_go_further.link'],
      linkTo:
        '/docs/guides/vtex-io-documentation-homologation-requirements-for-vtex-app-store',
    },
  ]
  return data
}

export const resources = (locale: 'en' | 'pt' | 'es') => {
  const data: ResourceDataElement[] = [
    {
      title: 'Community',
      description:
        messages[locale][
          'app_development_page_other_resources_community.description'
        ],
      link: getCommunityURL(),
    },
    {
      title: 'Learning Center',
      description:
        messages[locale][
          'app_development_page_other_resources_learning_center.description'
        ],
      link: getLearningCenterURL(),
    },
    {
      title: 'Developer Portal',
      description:
        messages[locale][
          'app_development_page_other_resources_github.description'
        ],
      link: getDeveloperPortalURL(),
    },
    {
      title: 'Support',
      description:
        messages[locale][
          'app_development_page_other_resources_support.description'
        ],
      link: getSupportURL(),
    },
  ]

  return data
}

export const knownIssuesStatusFilter = (locale: 'en' | 'pt' | 'es') => {
  const data = {
    name: messages[locale]['known_issues_filter_status.title'],
    options: [
      {
        id: 'Closed',
        name: messages[locale]['known_issues_filter_status.closed'],
      },
      {
        id: 'Fixed',
        name: messages[locale]['known_issues_filter_status.fixed'],
      },
      {
        id: 'Backlog',
        name: messages[locale]['known_issues_filter_status.backlog'],
      },
      {
        id: 'Scheduled',
        name: messages[locale]['known_issues_filter_status.scheduled'],
      },
      {
        id: 'No_Fix',
        name: messages[locale]['known_issues_filter_status.no_fix'],
      },
    ],
  }

  return data
}

export const knownIssuesModulesFilters = (locale: 'en' | 'pt' | 'es') => {
  const data = {
    name: messages[locale]['known_issues_filter_modules.title'],
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

export const TroubleshootingFilters = (locale: 'en' | 'pt' | 'es') => {
  const data = {
    name: messages[locale]['troubleshooting_filter_module.title'],
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

export const sortBy = (locale: 'en' | 'pt' | 'es') => {
  const data = [
    {
      value: 'recently_updated',
      content: messages[locale]['sort.recently_updated'],
    },
    {
      value: 'newest',
      content: messages[locale]['sort.newest'],
    },
  ]

  return data
}

export const faqFilter = (locale: 'en' | 'pt' | 'es') => {
  const data = {
    name: messages[locale]['faq_filter.title'],
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

export const additionalResourcesSitemap = (locale: 'en' | 'pt' | 'es') => {
  const data: {
    documentation: string
    children: { name: string; link: string; icon: boolean }[]
  } = {
    documentation:
      messages[locale]['sitemap_page_section_additional_resources.title'],
    children: [
      {
        name: messages[locale]['sitemap_page_section_additional_resources.faq'],
        link: '/faq',
        icon: false,
      },
      {
        name: messages[locale][
          'sitemap_page_section_additional_resources.known_issues'
        ],
        link: '/known-issues',
        icon: false,
      },
      {
        name: messages[locale][
          'sitemap_page_section_additional_resources.support_rules'
        ],
        link: '#', // TODO: trocar rota
        icon: false,
      },
      {
        name: messages[locale][
          'sitemap_page_section_additional_resources.announcements'
        ],
        link: '/announcements',
        icon: false,
      },
      {
        name: messages[locale][
          'sitemap_page_section_additional_resources.dev_portal'
        ],
        link: getDeveloperPortalURL(),
        icon: true,
      },
      {
        name: messages[locale][
          'sitemap_page_section_additional_resources.support'
        ],
        link: getSupportURL(),
        icon: true,
      },
      {
        name: messages[locale][
          'sitemap_page_section_additional_resources.community'
        ],
        link: getCommunityURL(),
        icon: true,
      },
      {
        name: messages[locale][
          'sitemap_page_section_additional_resources.feedback'
        ],
        link: getFeedbackURL(),
        icon: true,
      },
    ],
  }

  return data
}
