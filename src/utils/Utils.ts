/**
 * Exclude fields from an instance of a class
 * @param instance Instance of a class to exclude fields from
 * @param fields Fields to exclude from the instance
 * @link https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields#excluding-the-password-field
 */
export const excludeField = <I, Field extends keyof I>(
  instance: I,
  fields: Field[]
): Omit<I, Field> => {
  for (const field of fields) delete instance[field];
  return instance;
};
