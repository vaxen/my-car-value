/* istanbul ignore file */
import { Report } from 'src/report/model/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
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

  @OneToMany(() => Report, (report) => report.id)
  reportsId: number[];

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
