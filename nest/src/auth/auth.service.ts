import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import e from 'express';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup(signupDto: SignupDto){
        const {email, username, password} = signupDto;
        const user = await this.prismaService.user.findUnique({
            where: {email}
        })
    }
}
