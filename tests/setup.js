import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/node.js'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => server.close())
