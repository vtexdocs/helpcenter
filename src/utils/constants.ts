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
import SignalIcon from 'components/icons/signal-icon'
import MegaphoneIcon from 'components/icons/megaphone-icon'
import InfoIcon from 'components/icons/info-icon'
import LongArrowIcon from 'components/icons/long-arrow-icon'

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
      id: 'Tutorials & Solutions',
      Icon: TutorialsIcon,
      title: intl.formatMessage({
        id: 'documentation_tutorials.title',
      }),
      description: intl.formatMessage({
        id: 'documentation_tutorials.description',
      }),
      link: '/docs/tutorial',
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
      id: 'Tutorials & Solutions',
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
      Icon: InfoIcon,
      title: 'FAQ',
      description: intl.formatMessage({
        id: 'updates_info_notes.description',
      }),
      link: '/updates/announcements', //TODO: mudar rota
    },
    {
      id: 'Announcements',
      Icon: MegaphoneIcon,
      title: intl.formatMessage({
        id: 'updates_announcements_notes.title',
      }),
      description: intl.formatMessage({
        id: 'updates_announcements_notes.description',
      }),
      link: '/updates/announcements', //TODO: verificar rota
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
      link: '#', //TODO: trocar rota
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
      link: '/known-issues', //TODO: Trocar rota
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
      link: '#', // TODO: trocar rota
    },
    {
      id: 'Health Check',
      Icon: SignalIcon,
      title: intl.formatMessage({
        id: 'menu_health_check.title',
      }),
      description: intl.formatMessage({
        id: 'menu_health_check.description',
      }),
      link: '#', // TODO: trocar rota
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
      link: '#', //TODO: trocar rota
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
      type: intl.formatMessage({
        id: 'faq_order_error.type',
      }),
      link: '/',
    },
    {
      Icon: WarningIcon,
      title: intl.formatMessage({
        id: 'faq_handling.title',
      }),
      description: intl.formatMessage({
        id: 'faq_handling.description',
      }),
      type: intl.formatMessage({
        id: 'faq_handling.type',
      }),
      link: '/',
    },
    {
      Icon: GraphIcon,
      title: intl.formatMessage({
        id: 'faq_product_visible.title',
      }),
      description: intl.formatMessage({
        id: 'faq_product_visible.description',
      }),
      type: intl.formatMessage({
        id: 'faq_product_visible.type',
      }),
      link: '/',
    },
    {
      Icon: PaperIcon,
      title: intl.formatMessage({
        id: 'faq_carrier.title',
      }),
      description: intl.formatMessage({
        id: 'faq_carrier.description',
      }),
      type: intl.formatMessage({
        id: 'faq_carrier.type',
      }),
      link: '/',
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
      link: '/support-plans',
    },
    {
      id: 'Health Check',
      Icon: SignalIcon,
      title: intl.formatMessage({
        id: 'support_health_check.title',
      }),
      description: intl.formatMessage({
        id: 'support_health_check.description',
      }),
      isExternalLink: true,
      link: 'http://healthcheck.vtex.com/',
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

export const knownIssueSortBy = (intl: IntlShape) => {
  const data = [
    {
      value: 'recently_updated',
      content: intl.formatMessage({ id: 'known_issues_sort.recently_updated' }),
    },
    {
      value: 'newest',
      content: intl.formatMessage({ id: 'known_issues_sort.newest' }),
    },
  ]

  return data
}
