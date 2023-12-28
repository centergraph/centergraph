import { reportContext } from '@/contexts/ReportContext'
import { useContext } from 'react'

export const useValidate = () => {
  return useContext(reportContext)
}
