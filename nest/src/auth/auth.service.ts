import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/signinDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import e from 'express';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly JwtService: JwtService,
        private readonly configService: ConfigService,
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
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException("Incorrect Password");
        const payload = {sub: user.userId, email: user.email};
        const token = this.JwtService.sign(payload, {
            expiresIn: "2h", 
            secret: this.configService.get("SECRET_TOKEN")
        });
        return {token, user: {
            username: user.username,
            email: user.email,
        }}
    }

    async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
        const email = resetPasswordDemandDto.email
        const user = await this.prismaService.user.findFirst({
            where: {email}
        });
        if(!user) throw new NotFoundException("Not Found");
        const code = speakeasy.totp({
            secret: this.configService.get("OTP_SECRET"),
            digits: 5,
            step: 60 * 15, //15 Minutes,
            encoding: "base32"
        });
        const url = "http://localhost:3000/auth/reset-password-confirmation";
        await this.mailerService.sendResetPassword(email, url, code);
        return {data: "Mail has been sent"}
    }

    async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto){

    }
}
