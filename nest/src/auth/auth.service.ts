import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';

@Injectable()
export class AuthService {
    async signup(dto: SignupDto){

    }
}
