import { createContext, useContext } from 'react'
import type { DataTablesData, ResolvedDataTable } from './datatable.types'

const DataTablesContext = createContext<DataTablesData>({})

export const DataTablesProvider = DataTablesContext.Provider

export function useDataTable(src: string): ResolvedDataTable | undefined {
  return useContext(DataTablesContext)[src]
}
