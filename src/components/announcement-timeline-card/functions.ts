import type { IconComponent } from 'utils/typings/types'
import { getMessages } from 'utils/get-messages'

import AddedIcon from 'components/icons/added-icon'
import DeprecatedIcon from 'components/icons/deprecated-icon'
import DocumentationUpdatesIcon from 'components/icons/documentation-updates-icon'
import FixedIcon from 'components/icons/fixed-icon'
import ImprovedIcon from 'components/icons/improved-icon'
import AnnouncementIcon from 'components/icons/announcement-icon'
import RemovedIcon from 'components/icons/removed-icon'

export const messages = getMessages()

export type ActionType =
  | 'added'
  | 'deprecated'
  | 'fixed'
  | 'improved'
  | 'removed'

export type UpdateType = 'documentation-updates' | 'announcements'

export interface Action {
  type: ActionType
  title: string
  Icon: IconComponent
}

export interface Update {
  type: UpdateType
  title: string
  description: string
  Icon: IconComponent
}

const actions: Action[] = [
  {
    type: 'added',
    title: 'Added',
    Icon: AddedIcon,
  },
  {
    type: 'deprecated',
    title: 'Deprecated',
    Icon: DeprecatedIcon,
  },
  {
    type: 'fixed',
    title: 'Fixed',
    Icon: FixedIcon,
  },
  {
    type: 'improved',
    title: 'Improved',
    Icon: ImprovedIcon,
  },
  {
    type: 'removed',
    title: 'Removed',
    Icon: RemovedIcon,
  },
]

const updates = (locale: 'en' | 'pt' | 'es') => {
  const data: Update[] = [
    {
      type: 'documentation-updates',
      title: 'Documentation Updates',
      description: 'See what is new and latest documentation version',
      Icon: DocumentationUpdatesIcon,
    },
    {
      type: 'announcements',
      title: messages[locale]['announcements_page.title'],
      description: messages[locale]['announcements_page.description'],
      Icon: AnnouncementIcon,
    },
  ]
  return data
}

export const getAction = (actionType: ActionType): Action => {
  return actions.find((action) => action.type === actionType) as Action
}

export const getUpdate = (
  updateType: UpdateType,
  locale: 'en' | 'pt' | 'es'
): Update => {
  return updates(locale).find((update) => update.type === updateType) as Update
}
