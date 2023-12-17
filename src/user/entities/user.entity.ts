// user.entity.ts

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { pbkdf2Sync } from 'crypto';

import { Metric } from '../../metrics/entities/metric.entity';
import { Alert } from '../../alert/entities/alert.entity';
import { UserRel } from './user-rel.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    unique: true,
  })
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => Metric, (metric) => metric.user)
  public Metrics: Metric[];

  @OneToMany(() => Alert, (alert) => alert.user)
  public Alerts: Alert[];

  @OneToMany(() => UserRel, (userRel) => userRel.user1)
  userRel1: UserRel[];

  @OneToMany(() => UserRel, (userRel) => userRel.user2)
  userRel2: UserRel[];

  public token?: string;

  public setPassword(password: string, salt: string): void {
    this.password = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString(
      'hex',
    );
  }

  public validatePassword(password: string, salt: string): boolean {
    return (
      this.password ===
      pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    );
  }
}
