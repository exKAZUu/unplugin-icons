import { importModule } from 'local-pkg'
import { expect, it, vi } from 'vitest'
import { Vue3Compiler } from '../src/core/compilers/vue3'

vi.mock('local-pkg', async importOriginal => ({
  ...await importOriginal<typeof import('local-pkg')>(),
  importModule: vi.fn((path: string) => import(path)),
}))

const fixture = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>'

it('vue3 compiler resolves @vue/compiler-sfc from this package', async () => {
  const code = await Vue3Compiler(fixture, 'mdi', 'square', {} as any)
  expect(code).toContain('import { markRaw } from \'vue\'')
  expect(code).toContain('export default markRaw({ name: \'mdi-square\', render })')
  // A bare specifier would be resolved from local-pkg's own location, which fails in strict layouts.
  expect(importModule).toHaveBeenCalledWith(expect.stringMatching(/^file:\/\/.*\/@vue\/compiler-sfc\//))
})
