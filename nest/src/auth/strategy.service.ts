import { PrismaService } from './../prisma/prisma.service';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


type Payload = {
    sub: number,
    email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService: ConfigService,
        private readonly PrismaService: PrismaService

    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("SECRET_TOKEN"),
            ignoreExpiration: false
        })
    }

    async validate(payload: Payload){
        const user = await this.PrismaService.user.findFirst({where: {email: payload.email}})
        if (!user) throw new UnauthorizedException("Unauthorized");
        Reflect.deleteProperty(user, "password")
        return user;
    }
} 