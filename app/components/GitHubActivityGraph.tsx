'use client';

import { useState, useRef } from 'react';

interface ContributionData {
  date: string;
  level: number;
  count: number;
}

interface YearData {
  year: number;
  contributions: ContributionData[];
  totalContributions: number;
}

interface GitHubActivityGraphProps {
  years: YearData[];
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const levelColors = [
  'bg-zinc-200/80',
  'bg-green-200/80',
  'bg-green-300/90',
  'bg-green-400',
  'bg-green-500'
];

const levelHoverColors = [
  'bg-zinc-300',
  'bg-green-300',
  'bg-green-400',
  'bg-green-500',
  'bg-green-600'
];

export default function GitHubActivityGraph({ years }: GitHubActivityGraphProps) {
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

  const totalWeeks = Math.ceil((endDate.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
  const weeksInYear = Math.min(totalWeeks, 53);

  const calendar: (ContributionData | null)[][] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const row: (ContributionData | null)[] = [];
    const rowStartDate = new Date(firstSunday);
    rowStartDate.setDate(rowStartDate.getDate() + dayOfWeek);

    for (let weekIndex = 0; weekIndex < weeksInYear; weekIndex++) {
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

  const monthPositions: { month: number; position: number }[] = [];
  const seenMonthKeys = new Set<string>();

  for (let weekIndex = 0; weekIndex < weeksInYear; weekIndex++) {
    const testDate = new Date(firstSunday);
    testDate.setDate(testDate.getDate() + weekIndex * 7);

    if (testDate >= startDate && testDate <= endDate) {
      const month = testDate.getMonth();
      const monthKey = `${testDate.getFullYear()}-${month}`;
      if (!seenMonthKeys.has(monthKey)) {
        monthPositions.push({ month, position: weekIndex });
        seenMonthKeys.add(monthKey);
      }
    }
  }

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
    <div className="relative w-full">
      <div className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-10 pointer-events-auto hidden sm:block">
        <ul className="flex flex-col items-end gap-3 sm:gap-4">
          <li>
            <button
              onClick={() => setSelectedYear(null)}
              className={`
                relative px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 text-right
                ${selectedYear === null
                  ? 'text-black'
                  : 'text-black/60 hover:text-black/80'
                }
              `}
              aria-label="View latest 12 months contributions"
            >
              <span className="relative z-10">12M</span>
              {selectedYear === null && (
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-4 sm:h-6 bg-black transition-all duration-300"
                  aria-hidden="true"
                />
              )}
            </button>
          </li>
          {years.map((yearData) => {
            const isActive = selectedYear === yearData.year;
            return (
              <li key={yearData.year}>
                <button
                  onClick={() => setSelectedYear(yearData.year)}
                  className={`
                    relative px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 text-right
                    ${isActive
                      ? 'text-black'
                      : 'text-black/60 hover:text-black/80'
                    }
                  `}
                  aria-label={`View ${yearData.year} contributions`}
                >
                  <span className="relative z-10">{yearData.year}</span>
                  {isActive && (
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-4 sm:h-6 bg-black transition-all duration-300"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-full px-8 py-4 sm:py-6 md:py-8 pr-[32px] flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-black text-lg sm:text-xl font-semibold mb-1">
              {totalContributions} contributions {year === null ? 'in the last 12 months' : `in ${year}`}
            </h3>
            <div className="flex items-center gap-2 sm:hidden">
              <span className="text-black/60 text-xs">View:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedYear(null)}
                  className={`px-2 py-1 text-xs rounded transition-all duration-200 ${selectedYear === null
                      ? 'bg-black/10 text-black border border-black/30'
                      : 'bg-white/60 text-black/60 hover:text-black hover:bg-white/80 border border-black/20'
                    }`}
                >
                  12M
                </button>
                {years.map((yearData) => (
                  <button
                    key={yearData.year}
                    onClick={() => setSelectedYear(yearData.year)}
                    className={`px-2 py-1 text-xs rounded transition-all duration-200 ${selectedYear === yearData.year
                        ? 'bg-black/10 text-black border border-black/30'
                        : 'bg-white/60 text-black/60 hover:text-black hover:bg-white/80 border border-black/20'
                      }`}
                  >
                    {yearData.year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pl-1">
            <div className="inline-block min-w-full">
              <div className="flex mb-2 relative" style={{ height: '15px', marginLeft: '22px' }}>
                {monthPositions.map(({ month, position }, idx) => {
                  const nextPosition = idx < monthPositions.length - 1
                    ? monthPositions[idx + 1].position
                    : weeksInYear;
                  const cellWidth = 13;
                  const width = (nextPosition - position) * cellWidth;
                  return (
                    <div
                      key={`month-${idx}-${position}`}
                      className="text-black/70 text-xs absolute top-0"
                      style={{ left: `${position * cellWidth}px`, width: `${width}px` }}
                    >
                      {monthLabels[month]}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-[3px]">
                <div className="flex flex-col gap-[3px] mr-2">
                  {dayLabels.map((day, idx) => (
                    <div
                      key={`day-${idx}`}
                      className="text-black/50 text-[10px] flex items-center justify-end pr-1"
                      style={{ height: '10px', width: '24px', minWidth: '24px' }}
                    >
                      {idx % 2 === 0 ? day : ''}
                    </div>
                  ))}
                </div>

                <div className="flex-1">
                  {calendar.map((week, dayIndex) => (
                    <div key={`calendar-week-${dayIndex}`} className="flex gap-[3px] mb-[3px]">
                      {week.map((contrib, weekIndex) => {
                        if (!contrib) {
                          return (
                            <div
                              key={`${dayIndex}-${weekIndex}`}
                              className="w-[10px] h-[10px] rounded-sm border border-black/40"
                            />
                          );
                        }

                        const isHovered = hoveredDate === contrib.date;
                        const level = contrib.level || 0;

                        return (
                          <div
                            key={contrib.date}
                            className={`w-[10px] h-[10px] rounded-sm border border-black/40 transition-all duration-200 cursor-pointer relative ${isHovered ? levelHoverColors[level] : levelColors[level]
                              } ${isHovered ? 'ring-2 ring-black scale-110' : ''}`}
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
        </div>
      </div>

      {hoveredDate && tooltipPosition && (
        <div
          className="fixed z-50 bg-white/95 border border-black/20 rounded px-2 py-1 text-black text-xs pointer-events-none whitespace-nowrap shadow-lg"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {(() => {
            const contrib = contributionMap.get(hoveredDate);
            const count = contrib?.count || 0;
            return `${count} ${count === 1 ? 'contribution' : 'contributions'} on ${formatDate(hoveredDate)}`;
          })()}
        </div>
      )}
    </div>
  );
}
