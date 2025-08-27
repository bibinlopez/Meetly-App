import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { compareValue } from 'utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: any = await this.userService.findOne(email);
    const isMatch = await compareValue(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { email: string; userId: number }) {
    const payload = { email: user.email, userId: user.userId };
    console.log(payload);

    return { acceess_token: this.jwtService.sign(payload) };
  }
}
