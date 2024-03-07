import { hash, genSalt, compare } from "bcrypt";
export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await genSalt();
  const hashPwd = await hash(password, salt);
  return hashPwd;
};
export const comparePassword = async (
  password: string,
  hashPassword: string
): Promise<Boolean> => {
  return await compare(password, hashPassword);
};
