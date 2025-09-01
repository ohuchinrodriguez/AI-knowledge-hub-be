import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('leads')
export class LeadEntity {
  @PrimaryColumn('varchar')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public clientName!: string;

  @Column({ type: 'varchar', length: 255 })
  public projectName!: string;

  @Column({ type: 'varchar', length: 100 })
  public projectType!: string;

  @Column({ type: 'varchar', length: 100 })
  public projectScheme!: string;

  @Column({ type: 'text', nullable: true })
  public projectDescription: string | undefined;

  @Column({ type: 'int', nullable: true })
  public quoteDeliveryDays: number | undefined;

  @Column({ type: 'timestamp', nullable: true })
  public estimatedQuoteDeliveryDate: Date | undefined;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public progressStatus: string | undefined;

  @Column({ type: 'varchar', length: 50, default: 'Customer Introduction' })
  public status!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
