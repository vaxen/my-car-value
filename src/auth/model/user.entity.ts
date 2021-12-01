/* istanbul ignore file */
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`added new user: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`updated user: ${this.id}`);
  }

  @AfterRemove()
  logDelete() {
    console.log(`deleted user: ${this.id}`);
  }
}
