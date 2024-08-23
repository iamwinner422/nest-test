import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signinDto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto)
    }

    @Post('signin')
    signin(@Body() dto: SigninDto){
        return this.authService.signin(dto)
    }

    @Post('reset-password')
    resetPasswordDemand(@Body() dto: ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(dto)
    }

    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() dto: ResetPasswordConfirmationDto){
        return this.authService.resetPasswordConfirmation(dto)
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete")
    deleteAccount() {
        return "Delete"
    }
}

