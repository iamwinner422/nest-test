import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/signinDto';
@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService
    ) {}
    async signup(signupDto: SignupDto){
        const {email, username, password} = signupDto;
        const user = await this.prismaService.user.findFirst({
            where: {email}
        });
        if (user) throw new ConflictException('Email already exists');
        const hash = await bcrypt.hash(password, 10);
        await this.prismaService.user.create({
            data: {email, username, password: hash}
        });
        await this.mailerService.sendSignupConfirmation(email);
        return {data: 'User created'}
    }

    async signin(signInDto: SigninDto){
        const {email, password} = signInDto;
        const user = await this.prismaService.user.findFirst({
            where: {email}
        });
        if(user) throw new NotFoundException("User not found");
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new UnauthorizedException("Incorrect Password")
    }
}
