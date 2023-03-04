import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hashPassord(password) {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, userPasswordHash: string) {
    const isMatched = await bcrypt.compare(password, userPasswordHash);
    return isMatched;
  }
}
