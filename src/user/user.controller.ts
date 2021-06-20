import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guard/auth.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("get-user")
  @UseGuards(AuthGuard)
  getUser(@Query('search') search: string, @Query('include-deleted') includeDelete: boolean) {
    return this.userService.getUser(search, includeDelete)
  }

  @Get('my-profile')
  @UseGuards(AuthGuard)
  getMyProfile(@Request() req: any) {
    return req.user
  }

  @Post("create-user")
  createUser(
    @Body() body: any
  ) {
    return this.userService.createUser({ ...body })
  }

  @Put("update-user/:id")
  updateUser(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.userService.updateUser(id, body)
  }

  @Delete("delete-user/:id")
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id)
  }

  @Put("soft-delete-user/:id")
  softDeleteUser(@Param('id') id: string) {
    return this.userService.softDeleteUser(id)
  }

  @Post("login")
  login(@Body() body: any) {
    return this.userService.login(body.email, body.password)
  }
}
