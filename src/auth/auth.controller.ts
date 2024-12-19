import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { NATS_SERVICE } from 'src/config/services'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { catchError } from 'rxjs'
import { CurrentUser } from './decorators/user.decorator'
import { AuthGuard } from './guards/auth.guard'
import { CurrentUserInfo } from './interfaces/current-user.interface'
import { Token } from './decorators/token.decorator'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto)
      .pipe(
        catchError((error) => { throw new RpcException(error) })
      )
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto)
      .pipe(
        catchError((error) => { throw new RpcException(error) })
      )
  }

  @UseGuards( AuthGuard )
  @Get('verify')
  verifyUser(@CurrentUser() user: CurrentUserInfo, @Token() token: string) {
    return { user, token }
  }
}
