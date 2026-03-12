'use client';

import { useState, useRef } from 'react';
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

export const GitHubActivityGraph = ({ years }: GitHubActivityGraphProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const hoveredCellRef = useRef<HTMLDivElement | null>(null);

  const getAllContributions = (): ContributionData[] => {
    const allContribs: ContributionData[] = [];
    years.forEach(yearData => {
      allContribs.push(...yearData.contributions);
    });
    return allContribs;
  };

  const getLatest12Months = (): { contributions: ContributionData[]; totalContributions: number } => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const allContribs = getAllContributions();
    const latest12MonthsContribs = allContribs.filter(contrib => {
      const contribDate = new Date(contrib.date + 'T00:00:00');
      return contribDate >= twelveMonthsAgo && contribDate <= today;
    });

    const totalContributions = latest12MonthsContribs.reduce((sum, contrib) => sum + contrib.count, 0);

    return {
      contributions: latest12MonthsContribs,
      totalContributions
    };
  };

  const latest12MonthsData = getLatest12Months();
  const selectedYearData = selectedYear === null
    ? { year: null, contributions: latest12MonthsData.contributions, totalContributions: latest12MonthsData.totalContributions }
    : years.find(y => y.year === selectedYear) || years[0];

  const { year, contributions, totalContributions } = selectedYearData;

  const contributionMap = new Map<string, ContributionData>();
  contributions.forEach(contrib => {
    contributionMap.set(contrib.date, contrib);
  });

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

  const firstDayOfWeek = startDate.getDay();
  const firstSunday = new Date(startDate);
  firstSunday.setDate(firstSunday.getDate() - firstDayOfWeek);

  const calendar: (ContributionData | null)[][] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const row: (ContributionData | null)[] = [];
    const rowStartDate = new Date(firstSunday);
    rowStartDate.setDate(rowStartDate.getDate() + dayOfWeek);

    for (let weekIndex = 0; weekIndex < FIXED_WEEKS; weekIndex++) {
      const currentDate = new Date(rowStartDate);
      currentDate.setDate(currentDate.getDate() + weekIndex * 7);

      if (currentDate >= startDate && currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const contrib = contributionMap.get(dateStr) || { date: dateStr, level: 0, count: 0 };
        row.push(contrib);
      } else {
        row.push(null);
      }
    }
    calendar.push(row);
  }

  const monthPositions: { month: number; position: number; label: string }[] = year === null
    ? (() => {
        const result: { month: number; position: number; label: string }[] = [];
        const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        let idx = 0;
        while (cur <= endDate && idx < STATIC_MONTH_WEEK_INDEX.length) {
          result.push({ month: cur.getMonth(), position: STATIC_MONTH_WEEK_INDEX[idx], label: MONTH_LABELS[cur.getMonth()] });
          cur.setMonth(cur.getMonth() + 1);
          idx++;
        }
        return result;
      })()
    : STATIC_MONTH_WEEK_INDEX.map((position, month) => ({ month, position, label: MONTH_LABELS[month] }));

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
      day === 2 || day === 22 ? 'nd' :
        day === 3 || day === 23 ? 'rd' : 'th';
    return `${month} ${day}${suffix}`;
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

          <div className={styles.calendarScroll}>
            <div className={styles.calendarInner}>
              <div className={styles.monthRow}>
                {monthPositions.map(({ month, position, label }, idx) => {
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

              <div className={styles.weeksRow}>
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

          <div className={styles.mobileYearRow}>
            <span className={styles.mobileYearLabel}>View:</span>
            <div className={styles.mobileYearButtons}>
              <button
                onClick={() => setSelectedYear(null)}
                className={`${styles.mobileYearButton} ${selectedYear === null ? styles.mobileYearButtonActive : ''}`}
              >
                12M
              </button>
              {years.map((yearData) => (
                <button
                  key={yearData.year}
                  onClick={() => setSelectedYear(yearData.year)}
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
};
