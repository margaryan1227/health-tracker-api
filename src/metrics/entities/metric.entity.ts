import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IMetric } from '../../common/interfaces/IMetric';

@Entity()
export class Metric implements IMetric {
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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  public user: number;

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
}
