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
  Index,
} from 'sequelize-typescript';
import { Project } from './Project';

@Table({
  tableName: 'github_repos',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['githubId'],
    },
    {
      fields: ['username', 'projectId'],
    },
  ],
})
export class GitHubRepo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Index
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  githubId!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  htmlUrl!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  cloneUrl!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  language?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stargazersCount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  forksCount!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  private!: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  githubCreatedAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  githubUpdatedAt!: Date;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
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
      isRecentlyUpdated: this.githubUpdatedAt 
        ? (new Date().getTime() - new Date(this.githubUpdatedAt).getTime()) / (1000 * 60 * 60 * 24) < 30
        : false,
      daysSinceLastUpdate: this.githubUpdatedAt
        ? Math.floor((new Date().getTime() - new Date(this.githubUpdatedAt).getTime()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }
}
