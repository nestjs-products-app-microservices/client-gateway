import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    if (!request.user) {
      throw new InternalServerErrorException('User not found')
    }

    return request.user
  }
)