/**
 * Declare any modules here that don't have a types file available nor a @types package
 *
 * Or for any modules that have been extended, we can merge declarations
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */

declare module 'mongoose' {
  interface Model<T extends Document, QueryHelpers = {}> {
    log: typeof log;
  }
}
