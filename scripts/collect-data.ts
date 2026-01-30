#!/usr/bin/env bun
import { simpleGit } from 'simple-git';
import { Octokit } from '@octokit/rest';
import { getISOWeek, getISOWeekYear, startOfISOWeek, subMonths } from 'date-fns';
import { readdir, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import type { WeeklyData, RepositoryInfo, CommitData } from './types';

const CODE_EXTENSIONS = new Set([
  'js', 'ts', 'jsx', 'tsx', 'py', 'go', 'rs', 'java', 'cpp', 'c', 'h',
  'rb', 'php', 'swift', 'kt', 'cs', 'scala', 'r', 'sh', 'sql', 'vue',
  'svelte', 'html', 'css', 'scss', 'sass', 'less'
]);

const EXCLUDE_PATTERNS = [
  'node_modules', 'dist', 'build', '.git', 'vendor', 'target',
  '.min.js', '.bundle.js', 'package-lock.json', 'bun.lockb', 'yarn.lock'
];

const LOCAL_REPOS_PATH = '/Users/jurrejan/Documents/development';
const MONTHS_BACK = 36;
const SINCE_DATE = subMonths(new Date(), MONTHS_BACK);

function isCodeFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !CODE_EXTENSIONS.has(ext)) return false;
  return !EXCLUDE_PATTERNS.some(pattern => filename.includes(pattern));
}

async function findGitRepos(basePath: string, maxDepth: number = 3, currentDepth: number = 0): Promise<string[]> {
  const repos: string[] = [];

  if (currentDepth > maxDepth) return repos;

  try {
    const entries = await readdir(basePath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('.') && entry.name !== '.git') continue;

      const fullPath = join(basePath, entry.name);
      const gitPath = join(fullPath, '.git');

      try {
        const gitStat = await stat(gitPath);
        if (gitStat.isDirectory()) {
          repos.push(fullPath);
          continue; // Don't search inside git repos
        }
      } catch {
        // Not a git repo, search subdirectories
        const subRepos = await findGitRepos(fullPath, maxDepth, currentDepth + 1);
        repos.push(...subRepos);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${basePath}:`, error);
  }

  return repos;
}

async function extractRepoHistory(repoPath: string): Promise<CommitData[]> {
  const git = simpleGit(repoPath);
  const commits: CommitData[] = [];

  try {
    const sinceStr = SINCE_DATE.toISOString().split('T')[0];
    const log = await git.raw([
      'log',
      '--all',
      `--since=${sinceStr}`,
      '--numstat',
      '--pretty=format:COMMIT|%H|%ai|%an'
    ]);

    const lines = log.split('\n');
    let currentCommit: Partial<CommitData> | null = null;
    let totalLinesProcessed = 0;

    for (const line of lines) {
      if (line.startsWith('COMMIT|')) {
        if (currentCommit?.hash) {
          commits.push(currentCommit as CommitData);
        }

        const [, hash, dateStr, author] = line.split('|');
        currentCommit = {
          hash,
          date: new Date(dateStr),
          author,
          linesAdded: 0,
          linesDeleted: 0
        };
      } else if (currentCommit && line.trim()) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
          const [added, deleted, filename] = parts;

          if (isCodeFile(filename) && added !== '-' && deleted !== '-') {
            const addedNum = parseInt(added, 10);
            const deletedNum = parseInt(deleted, 10);
            if (!isNaN(addedNum) && !isNaN(deletedNum)) {
              currentCommit.linesAdded! += addedNum;
              currentCommit.linesDeleted! += deletedNum;
              totalLinesProcessed += addedNum + deletedNum;
            }
          }
        }
      }
    }

    if (currentCommit?.hash) {
      commits.push(currentCommit as CommitData);
    }

    if (totalLinesProcessed > 0) {
      const repoName = repoPath.split('/').pop();
      console.log(`  ${repoName}: ${commits.length} commits, ${totalLinesProcessed.toLocaleString()} lines`);
    }
  } catch (error) {
    console.error(`Error processing ${repoPath}:`, error);
  }

  return commits;
}

async function getGitHubToken(): Promise<string | null> {
  try {
    const result = await Bun.spawn(['gh', 'auth', 'token'], {
      stdout: 'pipe',
    }).text();
    return result.trim();
  } catch {
    return null;
  }
}

async function getGitHubRepos(): Promise<RepositoryInfo[]> {
  let token = process.env.GITHUB_TOKEN;

  if (!token) {
    token = await getGitHubToken();
  }

  if (!token) {
    console.warn('No GitHub token available (gh not authenticated and GITHUB_TOKEN not set)');
    return [];
  }

  const octokit = new Octokit({ auth: token });
  const repos: RepositoryInfo[] = [];

  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      affiliation: 'owner',
      per_page: 100
    });

    for (const repo of data) {
      if (!repo.fork) {
        repos.push({
          name: repo.full_name,
          path: repo.clone_url,
          isLocal: false
        });
      }
    }
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
  }

  return repos;
}

async function cloneOrUpdateRepo(repoUrl: string, targetPath: string): Promise<void> {
  const git = simpleGit();

  try {
    const exists = await stat(targetPath).then(() => true).catch(() => false);

    if (exists) {
      await simpleGit(targetPath).pull();
    } else {
      await git.clone(repoUrl, targetPath, ['--depth', '1000']);
    }
  } catch (error) {
    console.error(`Error with repo ${repoUrl}:`, error);
  }
}

function aggregateByWeek(commits: CommitData[]): Map<string, WeeklyData> {
  const weekMap = new Map<string, WeeklyData>();

  for (const commit of commits) {
    const weekNum = getISOWeek(commit.date);
    const year = getISOWeekYear(commit.date);
    const weekStart = startOfISOWeek(commit.date);
    const key = `${year}-W${weekNum.toString().padStart(2, '0')}`;

    if (!weekMap.has(key)) {
      weekMap.set(key, {
        weekStart,
        weekNumber: weekNum,
        year,
        linesAdded: 0,
        linesDeleted: 0,
        totalChanges: 0,
        commitCount: 0
      });
    }

    const weekData = weekMap.get(key)!;
    weekData.linesAdded += commit.linesAdded;
    weekData.linesDeleted += commit.linesDeleted;
    weekData.totalChanges += commit.linesAdded + commit.linesDeleted;
    weekData.commitCount++;
  }

  return weekMap;
}

async function main() {
  console.log('🔍 Scanning local repositories...');
  const localRepoPaths = await findGitRepos(LOCAL_REPOS_PATH);
  console.log(`Found ${localRepoPaths.length} local repos`);

  console.log('\n📦 Fetching GitHub repositories...');
  const githubRepos = await getGitHubRepos();
  console.log(`Found ${githubRepos.length} GitHub repos`);

  // Process GitHub repos (clone/update to temp directory)
  const tempDir = '/tmp/doublej-stats';
  for (const repo of githubRepos) {
    const repoName = repo.name.split('/').pop()!;
    const targetPath = join(tempDir, repoName);
    console.log(`Syncing ${repo.name}...`);
    await cloneOrUpdateRepo(repo.path, targetPath);
    localRepoPaths.push(targetPath);
  }

  console.log('\n📊 Extracting commit history...');
  const allCommits: CommitData[] = [];

  for (const repoPath of localRepoPaths) {
    const repoName = repoPath.split('/').pop();
    console.log(`Processing ${repoName}...`);
    const commits = await extractRepoHistory(repoPath);
    allCommits.push(...commits);
  }

  console.log(`\nTotal commits analyzed: ${allCommits.length}`);

  console.log('📅 Aggregating by week...');
  const weeklyData = aggregateByWeek(allCommits);

  // Convert to array and sort by date
  const sortedData = Array.from(weeklyData.values())
    .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());

  // Fill in missing weeks with zero data
  const filledData: WeeklyData[] = [];
  const dataMap = new Map<string, WeeklyData>();

  // Index existing data by week key
  for (const data of sortedData) {
    const key = `${data.year}-W${data.weekNumber.toString().padStart(2, '0')}`;
    dataMap.set(key, data);
  }

  // Fill all weeks from SINCE_DATE to now
  let currentDate = startOfISOWeek(SINCE_DATE);
  const endDate = new Date();

  while (currentDate <= endDate) {
    const weekNum = getISOWeek(currentDate);
    const year = getISOWeekYear(currentDate);
    const key = `${year}-W${weekNum.toString().padStart(2, '0')}`;

    if (dataMap.has(key)) {
      filledData.push(dataMap.get(key)!);
    } else {
      filledData.push({
        weekStart: new Date(currentDate),
        weekNumber: weekNum,
        year,
        linesAdded: 0,
        linesDeleted: 0,
        totalChanges: 0,
        commitCount: 0
      });
    }

    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 7);
  }

  console.log(`\n💾 Writing data (${filledData.length} weeks)...`);
  await writeFile(
    'assets/data.json',
    JSON.stringify(filledData, null, 2)
  );

  console.log('✅ Done!');
  console.log(`\nStats summary:`);
  console.log(`  Total weeks: ${filledData.length}`);
  console.log(`  Total lines changed: ${filledData.reduce((sum, w) => sum + w.totalChanges, 0).toLocaleString()}`);
  console.log(`  Total commits: ${filledData.reduce((sum, w) => sum + w.commitCount, 0)}`);
}

main().catch(console.error);
