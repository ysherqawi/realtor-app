import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface SignupParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email }: SignupParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExist) {
      throw new ConflictException();
    }

    console.log(userExist);
  }
}
