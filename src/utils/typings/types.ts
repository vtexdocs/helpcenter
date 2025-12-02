import { NextPage } from 'next'
import { IconProps } from '@vtex/brand-ui'

import { ActionType } from 'components/announcement-timeline-card/functions'
import { UpdatesTitle, ResourceTitle } from './unionTypes'
import { MarkDownProps } from 'components/article-render'
import { Item } from '@vtexdocs/components'
import { ArticleIndexingProps } from 'components/article-index'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Page<P = {}, IP = P> = NextPage<P, IP> & {
  sidebarfallback?: any //eslint-disable-line
  hideSidebar?: boolean
  isPreview?: boolean
}

export type IconComponent = (props: IconProps) => JSX.Element

export type DataElement = {
  link: string
  Icon: IconComponent
  description: string
}

export interface DocDataElement extends DataElement {
  id: string
  title: string
  isExternalLink?: boolean
}

export interface FaqDataElement extends DataElement {
  title: string
  productTeam: string
}

export interface UpdatesDataElement extends DataElement {
  title: UpdatesTitle
}

export interface ExternalLinkDataElement extends DataElement {
  title: string
}

export type UpdateElement = {
  slug: string
  title: string
  createdAt: string
  hidden: boolean
  description: string
  actionType: ActionType
}

export type WhatsNextDataElement = {
  title: string
  description: string
  linkTitle: string
  linkTo: string
}

export type WhatsNextDataElementTutorial = {
  title: string
  linkTitle: string
  linkTo: string
}

export type ResourceDataElement = {
  title: ResourceTitle
  description: string
  link: string
}

export type KnownIssueStatus =
  | 'Fixed'
  | 'Closed'
  | 'Backlog'
  | 'Scheduled'
  | 'No_Fix'

export type KnownIssueDataElement = {
  title: string
  id: string
  kiStatus: KnownIssueStatus
  module: string
  slug: string
  createdAt: string
  updatedAt: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'CHANGED' | string
}

export type AnnouncementDataElement = {
  title: string
  url: string
  createdAt: string
  updatedAt: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'CHANGED' | string
  synopsis?: string
}

export type SortByType = 'newest' | 'recently_updated'

export type FaqCardDataElement = {
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  productTeam: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'CHANGED' | string
}

export type TroubleshootingDataElement = {
  title: string
  slug: string
  tags: string[]
  createdAt: string
  updatedAt: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'CHANGED' | string
}

export type ArticlePageProps =
  | {
      sectionSelected: string
      slug: string
      parentsArray: string[] | null[]
      // path: string
      isListed: boolean
      branch: string
      pagination: {
        previousDoc: {
          slug: string | null
          name: string | null
        }
        nextDoc: {
          slug: string | null
          name: string | null
        }
      }
      breadcrumbList: { slug: string; name: string; type: string }[]
      mdFileExists: true
      componentProps: MarkDownProps
      headingList: Item[]
    }
  | {
      sectionSelected: string
      slug: string
      parentsArray: string[] | null[]
      isListed: boolean
      branch: string
      pagination: {
        previousDoc: {
          slug: string | null
          name: string | null
        }
        nextDoc: {
          slug: string | null
          name: string | null
        }
      }
      breadcrumbList: { slug: string; name: string; type: string }[]
      mdFileExists: false
      componentProps: ArticleIndexingProps
      headingList?: Item[]
    }

export interface ContributorsType {
  name: string
  login: string
  avatar: string
  userPage: string
}
