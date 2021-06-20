import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UserEntity } from "src/entities/user.entity";
import { Like, Repository } from "typeorm";

@Injectable()
export class UserService {

  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {}

  async findUserByEmail(email: string) {
    try {
      return await this.userRepo.findOne({ email })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getUser(search: string, include: boolean = false) {
    let wheres: any

    if (search) {
      if (search === "amp") {// operator pembanding ke string 3 sama dengan, kalo ke angka 2 sama dengan
        throw new InternalServerErrorException('Ga boleh search amp')
      } else { 
        wheres = {
          name: Like(`%${search}%`)
        }
      }
    } else {
      wheres = {}
    }

    return await this.userRepo.find({
      where: wheres,
      withDeleted: include
    });
  }

  async createUser(user: UserEntity) {
    try {
      return await this.userRepo.save(this.userRepo.create(user))
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async updateUser(id: string, user: UserEntity) {
    try {
      return await this.userRepo.update(id, { ...user })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.userRepo.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async softDeleteUser(id: string) {
    try {
     return await this.userRepo.softDelete(id) 
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async login(email: string, password: string) {
    try {
      const findUser = await this.userRepo.findOne({ email })
      if (!findUser) {
        throw new NotFoundException(`User dengan email ${email} tidak ditemukan`)
      }

      if (compareSync(password, findUser.password)) {
        const token = sign({ data: findUser.email, exp: Math.floor(Date.now() / 1000) + (60 * 60), }, "contoh-secret")

        return token
      } else {
        throw new BadRequestException('Password salah')
      }

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

}
