import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignupParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ name, email, phone, password }: SignupParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExist) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    const token = await jwt.sign(
      {
        id: user.id,
        name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      },
    );

    return token;
  }
}
