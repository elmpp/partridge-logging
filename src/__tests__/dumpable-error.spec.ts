import DumpableError from '../dumpable-error'

it('works', () => {
  const dumpable1: any = {something1: 'else1'}
  const dumpable2: any = {something2: 'else2'}
  const dumpableError = new DumpableError('message', {dumpable1, dumpable2})

  expect(dumpableError).toBeInstanceOf(DumpableError)
  expect(dumpableError.dumpables).toEqual({dumpable1, dumpable2})
})