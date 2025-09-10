import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Task } from './Task';
import { GitHubRepo } from './GitHubRepo';

@Table({
  tableName: 'projects',
  timestamps: true,
})
export class Project extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do projeto é obrigatório',
      },
      len: {
        args: [2, 255],
        msg: 'Nome do projeto deve ter entre 2 e 255 caracteres',
      },
    },
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'completed'),
    allowNull: false,
    defaultValue: 'active',
  })
  status!: 'active' | 'inactive' | 'completed';

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  startDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  endDate?: Date;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @HasMany(() => Task, {
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  tasks!: Task[];

  @HasMany(() => GitHubRepo, {
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  githubRepos!: GitHubRepo[];

  // Instance methods
  public toJSON(): object {
    const values = super.toJSON();
    return {
      ...values,
      tasksCount: this.tasks?.length || 0,
      githubReposCount: this.githubRepos?.length || 0,
    };
  }
}
