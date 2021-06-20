import { genSaltSync, hashSync } from "bcrypt";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    length: 100
  })
  name: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  private hashPassword?: any = () => {
    this.password = hashSync(this.password, genSaltSync(12))
  }

}
