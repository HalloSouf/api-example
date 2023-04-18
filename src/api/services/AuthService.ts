import jwtPkg, { type Jwt, type SignOptions, type VerifyErrors } from 'jsonwebtoken';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { ICustomJwt } from 'src/types/global.interface';
import { readFileSync } from 'fs';
import config from '../../configuration/config';
import { resolve } from 'path';

const { sign } = jwtPkg;

class AuthService {
  /**
   * Hash data
   * @param data Data to hash
   */
  public hash(data: string): string {
    return hashSync(data, genSaltSync(10));
  }

  /**
   * Compare a hash with a data
   * @param data Data to compare with the hash
   * @param hash Hash to compare with the data
   */
  public compareHash(data: string | Buffer, hash: string): boolean {
    return compareSync(data, hash);
  }

  /**
   * Sign JWT token
   * @param data Data to sign in the token
   * @param options Options to sign the token
   */
  public signToken(data: object | Buffer, options?: SignOptions): string {
    return sign(
      { ...data },
      readFileSync(resolve(config.keys.privatePath), {
        encoding: 'utf-8'
      }),
      {
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
        algorithm: 'RS256',
        ...options
      }
    );
  }

    /**
   * Verify JWT token
   * @param token Token to verify
   */
    public verifyToken(token: string): Promise<ICustomJwt | undefined> {
      return new Promise(
        (
          promiseResolve: (value: ICustomJwt | undefined) => void,
          reject: (reason?: VerifyErrors) => void
        ) => {
          jwtPkg.verify(
            token,
            readFileSync(resolve(config.keys.publicPath), {
              encoding: 'utf-8'
            }),
            {
              audience: config.jwt.audience,
              issuer: config.jwt.issuer,
              algorithms: ['RS256'],
              complete: true
            },
            (error: VerifyErrors | null, payload: Jwt | undefined) => {
              if (error) reject(error);
              promiseResolve(payload as ICustomJwt);
            }
          );
        }
      );
    }
}

export default AuthService;
