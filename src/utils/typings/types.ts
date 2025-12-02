import { NextPage } from 'next'
import { IconProps } from '@vtex/brand-ui'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Item } from '@vtexdocs/components'
import { MouseEventHandler } from 'react'
import {
  UpdatesTitle,
  ResourceTitle,
  SectionId,
  KnownIssueStatus,
} from './unionTypes'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Page<P = {}, IP = P> = NextPage<P, IP> & {
  sidebarfallback?: any //eslint-disable-line
  hideSidebar?: boolean
  isPreview?: boolean
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

// Article Render Types
export interface MarkDownProps {
  content: string
  serialized: MDXRemoteSerializeResult
  contributors: ContributorsType[]
  path: string
  headingList: Item[]
  seeAlsoData: {
    url: string
    title: string
    category: string
  }[]
  slug: string
  isListed: boolean
  branch: string
  pagination?: {
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
  headings: Item[]
  type: SectionId
}

// Article Index Types
export interface ArticleIndexingProps {
  name: string
  children: { name: string; slug: string }[]
  hidePaginationPrevious: boolean
  hidePaginationNext: boolean
  type: string
}

export type IconComponent = (props: IconProps) => JSX.Element

// Documentation Card Types
export interface DocumentProps extends DataElement {
  title: string
}

export interface CardProps extends DocumentProps {
  containerType: 'dropdown' | 'see-also' | 'mobile'
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined
}

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

export type CardDataElement = {
  title: string
  createdAt: string
  updatedAt: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'CHANGED' | string
}

export interface AnnouncementDataElement extends CardDataElement {
  url: string
  synopsis?: string
}

export interface KnownIssueDataElement extends CardDataElement {
  slug: string
  id: string
  kiStatus: KnownIssueStatus
  module: string
}

export interface FaqCardDataElement extends CardDataElement {
  slug: string
  productTeam: string
}

export interface TroubleshootingDataElement extends CardDataElement {
  slug: string
  tags: string[]
}

export interface ContributorsType {
  name: string
  login: string
  avatar: string
  userPage: string
}
