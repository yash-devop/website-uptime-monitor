import { auth } from '@/utils/auth'
import {mockDeep} from 'vitest-mock-extended'
export const mockedAuth = mockDeep<typeof auth>() 
