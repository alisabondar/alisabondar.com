'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  STATIC_MONTH_WEEK_INDEX,
  FIXED_WEEKS,
  MONTH_LABELS,
} from '../constants';
import styles from './GitHubActivityGraph.module.css';

export interface ContributionData {
  date: string;
  level: number;
  count: number;
}

export interface YearData {
  year: number;
  contributions: ContributionData[];
  totalContributions: number;
}

export interface GitHubActivityGraphProps {
  years: YearData[];
}

/** YYYY-MM-DD in local time. (toISOString would shift the day for visitors east of UTC.) */
function toDateKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Parses YYYY-MM-DD as a local date. (new Date('YYYY-MM-DD') is UTC and shows the previous day in the Americas.) */
function parseDateKey(key: string) {
  return new Date(`${key}T00:00:00`);
}

const formatDate = (dateStr: string) => {
  const date = parseDateKey(dateStr);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
    day === 2 || day === 22 ? 'nd' :
      day === 3 || day === 23 ? 'rd' : 'th';
  return `${month} ${day}${suffix}`;
};

function buildCalendar(years: YearData[], year: number | null) {
  let startDate: Date;
  let endDate: Date;

  if (year === null) {
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 12);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31);
    endDate.setHours(23, 59, 59, 999);
  }

  const contributionMap = new Map<string, ContributionData>();
  let totalContributions = 0;
  for (const yearData of years) {
    for (const contrib of yearData.contributions) {
      const date = parseDateKey(contrib.date);
      if (date >= startDate && date <= endDate) {
        contributionMap.set(contrib.date, contrib);
        totalContributions += contrib.count;
      }
    }
  }
  if (year !== null) {
    totalContributions = years.find((y) => y.year === year)?.totalContributions ?? totalContributions;
  }

  const firstSunday = new Date(startDate);
  firstSunday.setDate(firstSunday.getDate() - startDate.getDay());

  const calendar: (ContributionData | null)[][] = [];
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const row: (ContributionData | null)[] = [];
    for (let weekIndex = 0; weekIndex < FIXED_WEEKS; weekIndex++) {
      const currentDate = new Date(firstSunday);
      currentDate.setDate(currentDate.getDate() + dayOfWeek + weekIndex * 7);

      if (currentDate >= startDate && currentDate <= endDate) {
        const dateStr = toDateKey(currentDate);
        row.push(contributionMap.get(dateStr) ?? { date: dateStr, level: 0, count: 0 });
      } else {
        row.push(null);
      }
    }
    calendar.push(row);
  }

  const monthPositions: { month: number; position: number; label: string }[] = [];
  if (year === null) {
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    let idx = 0;
    while (cur <= endDate && idx < STATIC_MONTH_WEEK_INDEX.length) {
      monthPositions.push({ month: cur.getMonth(), position: STATIC_MONTH_WEEK_INDEX[idx], label: MONTH_LABELS[cur.getMonth()] });
      cur.setMonth(cur.getMonth() + 1);
      idx++;
    }
  } else {
    STATIC_MONTH_WEEK_INDEX.forEach((position, month) => monthPositions.push({ month, position, label: MONTH_LABELS[month] }));
  }

  return { calendar, contributionMap, totalContributions, monthPositions };
}

// Memoized: the parent re-renders on every scroll frame, and this grid is ~370 cells.
export const GitHubActivityGraph = memo(function GitHubActivityGraph({ years }: GitHubActivityGraphProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const hoveredCellRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const year = selectedYear;
  const { calendar, contributionMap, totalContributions, monthPositions } = useMemo(
    () => buildCalendar(years, selectedYear),
    [years, selectedYear]
  );

  // On narrow screens the grid scrolls horizontally; start at the most recent week for the rolling view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = selectedYear === null ? el.scrollWidth : 0;
  }, [selectedYear]);

  const handleCellMouseEnter = (e: React.MouseEvent<HTMLDivElement>, date: string) => {
    setHoveredDate(date);
    hoveredCellRef.current = e.currentTarget;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handleCellMouseLeave = () => {
    setHoveredDate(null);
    hoveredCellRef.current = null;
    setTooltipPosition(null);
  };


  return (
    <div className={styles.root}>
      <div className={styles.yearSelector}>
        <ul className={styles.yearList}>
          <li>
            <button
              onClick={() => setSelectedYear(null)}
              className={`${styles.yearButton} ${selectedYear === null ? styles.yearButtonActive : styles.yearButtonInactive}`}
              aria-label="View latest 12 months contributions"
              aria-pressed={selectedYear === null}
            >
              <span className={styles.yearLabel}>12M</span>
              {selectedYear === null && (
                <span className={styles.yearIndicator} aria-hidden="true" />
              )}
            </button>
          </li>
          {years.map((yearData) => {
            const isActive = selectedYear === yearData.year;
            return (
              <li key={yearData.year}>
                <button
                  onClick={() => setSelectedYear(yearData.year)}
                  className={`${styles.yearButton} ${isActive ? styles.yearButtonActive : styles.yearButtonInactive}`}
                  aria-label={`View ${yearData.year} contributions`}
                  aria-pressed={isActive}
                >
                  <span className={styles.yearLabel}>{yearData.year}</span>
                  {isActive && (
                    <span className={styles.yearIndicator} aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>
              {totalContributions} contributions {year === null ? 'in the last 12 months' : `in ${year}`}
            </h3>
          </div>

          <div ref={scrollRef} className={styles.calendarScroll}>
            <div
              className={styles.calendarInner}
              role="img"
              aria-label={`GitHub contribution calendar: ${totalContributions} contributions ${year === null ? 'in the last 12 months' : `in ${year}`}`}
            >
              <div className={styles.monthRow} aria-hidden>
                {monthPositions.map(({ position, label }, idx) => {
                  const nextPosition = idx < monthPositions.length - 1
                    ? monthPositions[idx + 1].position
                    : FIXED_WEEKS;
                  const cellWidth = 13;
                  const width = (nextPosition - position) * cellWidth;
                  return (
                    <div
                      key={`month-${idx}-${position}`}
                      className={styles.monthLabel}
                      style={{ left: `${position * cellWidth}px`, width: `${width}px` }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>

              <div className={styles.weeksRow} aria-hidden>
                <div className={styles.weekColumn}>
                  {calendar.map((week, dayIndex) => (
                    <div key={`calendar-week-${dayIndex}`} className={styles.weekRow}>
                      {week.map((contrib, weekIndex) => {
                        if (!contrib) {
                          return (
                            <div
                              key={`${dayIndex}-${weekIndex}`}
                              className={styles.cellEmpty}
                            />
                          );
                        }

                        const isHovered = hoveredDate === contrib.date;
                        const level = contrib.level || 0;

                        return (
                          <div
                            key={contrib.date}
                            className={`${styles.cell} ${styles[`cellLevel${level}`]} ${isHovered ? styles[`cellLevel${level}Hover`] : ''} ${isHovered ? styles.cellHovered : ''}`}
                            onMouseEnter={(e) => handleCellMouseEnter(e, contrib.date)}
                            onMouseLeave={handleCellMouseLeave}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mobileYearRow} role="group" aria-label="Contribution period">
            <span className={styles.mobileYearLabel}>View:</span>
            <div className={styles.mobileYearButtons}>
              <button
                onClick={() => setSelectedYear(null)}
                aria-pressed={selectedYear === null}
                className={`${styles.mobileYearButton} ${selectedYear === null ? styles.mobileYearButtonActive : ''}`}
              >
                12M
              </button>
              {years.map((yearData) => (
                <button
                  key={yearData.year}
                  onClick={() => setSelectedYear(yearData.year)}
                  aria-pressed={selectedYear === yearData.year}
                  className={`${styles.mobileYearButton} ${selectedYear === yearData.year ? styles.mobileYearButtonActive : ''}`}
                >
                  {yearData.year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hoveredDate && tooltipPosition
        ? (
            <div
              className={styles.tooltip}
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {(() => {
                const contrib = contributionMap.get(hoveredDate);
                const count = contrib?.count ?? 0;
                return `${count} ${count === 1 ? 'contribution' : 'contributions'} on ${formatDate(hoveredDate ?? '')}`;
              })()}
            </div>
          )
        : null}
    </div>
  );
});
