import bcrypt from 'bcrypt';

export const hash = async (toHash: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(toHash, salt);
};

export const isHashEqual = async (toHash: string, toCompare?: string) => {
  if (!toCompare) {
    return false;
  }
  return await bcrypt.compare(toHash, toCompare);
};
