#!/usr/bin/env bun
import { readFile, writeFile } from 'fs/promises';
import { format } from 'date-fns';
import type { WeeklyData } from './types';

const SVG_WIDTH = 900;
const SVG_HEIGHT = 400;
const VIEWBOX_Y_START = -2300; // Room for extreme overflow bars
const CHART_TOP = 140;
const CHART_BOTTOM = 260;
const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;
const CHART_MAX_HEIGHT = 240; // Allow overflow above CHART_TOP
const SIDE_PADDING = 60; // More space for y-axis labels
const LABEL_Y = 285; // Below the chart

// Indigo color palette
const COLORS = {
  bg: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',
  low: '#E0E7FF',
  medium: '#A5B4FC',
  high: '#6366F1',
  peak: '#4338CA'
};

function getBarColor(value: number, max: number): string {
  const ratio = max > 0 ? value / max : 0;

  if (ratio === 0) return COLORS.low;
  if (ratio < 0.25) return COLORS.low;
  if (ratio < 0.5) return COLORS.medium;
  if (ratio < 0.75) return COLORS.high;
  return COLORS.peak;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function generateYAxisTicks(scaleMax: number, absoluteMax: number): string {
  let ticks = '';

  // Generate 5 tick marks from 0 to scaleMax
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    const value = (scaleMax / numTicks) * i;
    const y = CHART_BOTTOM - (CHART_MAX_HEIGHT / numTicks) * i;

    ticks += `
    <line
      x1="${SIDE_PADDING - 5}"
      y1="${y}"
      x2="${SVG_WIDTH - SIDE_PADDING}"
      y2="${y}"
      stroke="${i === 0 ? '#CBD5E1' : '#F1F5F9'}"
      stroke-width="${i === 0 ? '1' : '0.5'}"
      stroke-dasharray="${i === 0 ? '0' : '4 2'}"
    />
    <text
      x="${SIDE_PADDING - 10}"
      y="${y + 4}"
      text-anchor="end"
      font-size="10"
      fill="#64748B"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    >${formatNumber(value)}</text>`;
  }

  return ticks;
}

function generateSVG(data: WeeklyData[]): string {
  // Use 85th percentile for scaling to make normal activity more visible
  const sortedValues = data.map(d => d.totalChanges).filter(v => v > 0).sort((a, b) => a - b);
  const percentile85Index = Math.floor(sortedValues.length * 0.85);
  const scaleMax = sortedValues[percentile85Index] || Math.max(...data.map(d => d.totalChanges));
  const absoluteMax = Math.max(...data.map(d => d.totalChanges));

  const barCount = data.length;
  const availableWidth = SVG_WIDTH - (SIDE_PADDING * 2);
  const barWidth = Math.max(2, availableWidth / barCount - 0.5);
  const barGap = 0.5;

  const yAxisTicks = generateYAxisTicks(scaleMax, absoluteMax);
  let bars = '';

  for (let i = 0; i < data.length; i++) {
    const week = data[i];
    const barHeight = scaleMax > 0
      ? (week.totalChanges / scaleMax) * CHART_MAX_HEIGHT
      : 0;
    const x = SIDE_PADDING + i * (barWidth + barGap);
    const y = CHART_BOTTOM - barHeight;
    const color = getBarColor(week.totalChanges, scaleMax);

    const tooltipText = week.totalChanges > 0
      ? `Week of ${format(week.weekStart, 'MMM d, yyyy')}: ${formatNumber(week.totalChanges)} lines (${week.commitCount} commits)`
      : `Week of ${format(week.weekStart, 'MMM d, yyyy')}: No activity`;

    const isOverflow = barHeight > CHART_HEIGHT;
    const finalColor = isOverflow ? COLORS.peak : color;

    bars += `
    <rect
      x="${x}"
      y="${y}"
      width="${barWidth}"
      height="${barHeight}"
      fill="${finalColor}"
      rx="1"
      ${isOverflow ? 'stroke="#312E81" stroke-width="0.5"' : ''}
    >
      <title>${tooltipText}</title>
    </rect>`;
  }

  // Generate month labels (every 2-3 months for readability)
  let labels = '';
  const labeledMonths = new Set<string>();
  let lastLabelIndex = -10;

  for (let i = 0; i < data.length; i++) {
    const week = data[i];
    const monthKey = format(week.weekStart, 'MMM yyyy');

    // Label first week of quarter or every ~8 weeks
    if (!labeledMonths.has(monthKey) && (i - lastLabelIndex) >= 8) {
      labeledMonths.add(monthKey);
      lastLabelIndex = i;
      const x = SIDE_PADDING + i * (barWidth + barGap);

      labels += `
    <text
      x="${x}"
      y="${LABEL_Y}"
      font-size="10"
      fill="${COLORS.textLight}"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      transform="rotate(-45, ${x}, ${LABEL_Y})"
      text-anchor="end"
    >${format(week.weekStart, 'MMM yy')}</text>`;
    }
  }

  // Summary stats
  const totalChanges = data.reduce((sum, w) => sum + w.totalChanges, 0);
  const totalCommits = data.reduce((sum, w) => sum + w.commitCount, 0);
  const activeWeeks = data.filter(w => w.totalChanges > 0).length;

  return `<svg viewBox="-10 ${VIEWBOX_Y_START} ${SVG_WIDTH + 10} ${SVG_HEIGHT - VIEWBOX_Y_START}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible">
  <style>
    .title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', sans-serif;
      font-size: 20px;
      font-weight: 600;
      fill: ${COLORS.text};
    }
    .subtitle {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      fill: ${COLORS.textLight};
    }
    .note {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10px;
      fill: ${COLORS.textLight};
    }
    .axis-label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      font-weight: 500;
      fill: ${COLORS.text};
    }
  </style>

  <rect x="-10" y="${VIEWBOX_Y_START}" width="${SVG_WIDTH + 10}" height="${SVG_HEIGHT - VIEWBOX_Y_START}" fill="${COLORS.bg}"/>

  <!-- Overlay content that bars will "break through" -->
  <g class="overlay-content" opacity="0.15">
    <!-- Repeating text pattern -->
    <text x="100" y="-200" font-size="60" fill="#CBD5E1" font-family="monospace" font-weight="bold">
      CODE CODE CODE CODE CODE
    </text>
    <text x="100" y="-100" font-size="60" fill="#CBD5E1" font-family="monospace" font-weight="bold">
      OVERFLOW OVERFLOW OVERFLOW
    </text>
    <text x="100" y="0" font-size="60" fill="#CBD5E1" font-family="monospace" font-weight="bold">
      ERROR ERROR ERROR ERROR
    </text>
    <text x="100" y="80" font-size="60" fill="#CBD5E1" font-family="monospace" font-weight="bold">
      EXCEPTION EXCEPTION EXCEPTION
    </text>
    <!-- Decorative code symbols -->
    <text x="50" y="-500" font-size="100" fill="#E2E8F0" font-family="monospace">{}</text>
    <text x="700" y="-800" font-size="120" fill="#E2E8F0" font-family="monospace">[]</text>
    <text x="400" y="-1200" font-size="100" fill="#E2E8F0" font-family="monospace">&lt;/&gt;</text>
    <text x="200" y="-1500" font-size="90" fill="#E2E8F0" font-family="monospace">()</text>
    <text x="600" y="-1800" font-size="110" fill="#E2E8F0" font-family="monospace">;</text>
  </g>

  <text x="${SIDE_PADDING - 10}" y="200" text-anchor="end" class="axis-label">
    Lines Changed
  </text>

  <!-- Chart container border -->
  <rect
    x="${SIDE_PADDING}"
    y="${CHART_TOP}"
    width="${availableWidth}"
    height="${CHART_HEIGHT}"
    fill="none"
    stroke="#E2E8F0"
    stroke-width="1"
    rx="2"
  />

  <g class="y-axis">${yAxisTicks}
  </g>

  <g class="bars">${bars}
  </g>

  <g class="labels">${labels}
  </g>

  <text x="${SVG_WIDTH / 2}" y="340" text-anchor="middle" class="title">
    Coding Activity - Last 36 Months
  </text>

  <text x="${SVG_WIDTH / 2}" y="360" text-anchor="middle" class="subtitle">
    ${formatNumber(totalChanges)} lines · ${totalCommits} commits · ${activeWeeks} active weeks
  </text>
</svg>`;
}

async function main() {
  console.log('📖 Reading data...');
  const dataJson = await readFile('assets/data.json', 'utf-8');
  const data: WeeklyData[] = JSON.parse(dataJson, (key, value) => {
    if (key === 'weekStart') return new Date(value);
    return value;
  });

  console.log(`Found ${data.length} weeks of data`);

  console.log('🎨 Generating SVG...');
  const svg = generateSVG(data);

  console.log('💾 Writing SVG...');
  await writeFile('assets/coding-activity.svg', svg);

  console.log('✅ Done! SVG written to assets/coding-activity.svg');
}

main().catch(console.error);
