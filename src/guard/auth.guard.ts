import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { decode, verify } from "jsonwebtoken";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {

  }

  async canActivate(context: ExecutionContext) {
    const headers = context.switchToHttp().getRequest()
    const [_, token] = headers.headers.authorization.split(' ')

    const verifyToken = verify(token, 'contoh-secret')
    const decoded: any = decode(token)
    if (!verifyToken) {
      return false
    }
    console.log(decoded.data)
    headers["user"] = await this.userService.findUserByEmail(decoded.data)

    return true
  }
}
