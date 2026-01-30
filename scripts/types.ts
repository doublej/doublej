export interface WeeklyData {
  weekStart: Date;
  weekNumber: number;
  year: number;
  linesAdded: number;
  linesDeleted: number;
  totalChanges: number;
  commitCount: number;
}

export interface RepositoryInfo {
  name: string;
  path: string;
  isLocal: boolean;
  lastScanned?: Date;
}

export interface CommitData {
  hash: string;
  date: Date;
  author: string;
  linesAdded: number;
  linesDeleted: number;
}
