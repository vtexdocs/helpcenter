import { createContext, useContext } from 'react'
import type { DataTablesData, ResolvedDataTable } from './datatable.types'

// Empty object default: useDataTable returns undefined for every src when
// rendered outside a DataTablesProvider, which triggers the unavailable state.
const DataTablesContext = createContext<DataTablesData>({})

export const DataTablesProvider = DataTablesContext.Provider

export function useDataTable(src: string): ResolvedDataTable | undefined {
  return useContext(DataTablesContext)[src]
}
