import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Project } from './Project';

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Título da tarefa é obrigatório',
      },
      len: {
        args: [2, 255],
        msg: 'Título da tarefa deve ter entre 2 e 255 caracteres',
      },
    },
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  })
  priority!: 'low' | 'medium' | 'high' | 'critical';

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  dueDate?: Date;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'ID do projeto é obrigatório',
      },
    },
  })
  projectId!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  })
  project!: Project;

  // Instance methods
  public toJSON(): object {
    const values = super.toJSON();
    return {
      ...values,
      isOverdue: this.dueDate ? new Date() > new Date(this.dueDate) : false,
      daysUntilDue: this.dueDate 
        ? Math.ceil((new Date(this.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }
}
