import { Dumpables } from "./__types__";

export default class DumpableError extends Error {
  constructor(message: string, readonly dumpables: Dumpables) {
    super(message)
  }
}
