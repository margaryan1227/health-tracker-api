import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IAlert } from '../../common/interfaces/IAlert';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Alert implements IAlert {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  public stepsWalked: number;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  public waterIntake: number;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  public calorieConsumption: number;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  public hoursSlept: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  public targetTimestamp: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  public user: number;
}
