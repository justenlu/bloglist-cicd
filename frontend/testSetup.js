//Should this file be in the root of the repository?
//https://fullstackopen.com/en/part5/testing_react_apps

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
