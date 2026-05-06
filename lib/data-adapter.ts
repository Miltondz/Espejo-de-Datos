import paulaProfile from '@/data/demo-financial-profile-paula.json'
import luisProfile from '@/data/demo-financial-profile-luis.json'
import type { FinancialProfile } from '@/types/profile'

export function getFinancialProfileFromMock(demoId: 'paula' | 'luis'): FinancialProfile {
  if (demoId === 'paula') return paulaProfile as FinancialProfile
  return luisProfile as FinancialProfile
}
