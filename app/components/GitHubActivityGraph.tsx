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
  'bg-zinc-800/50',
  'bg-green-900/60',
  'bg-green-800/70',
  'bg-green-700/80',
  'bg-green-600/90'
];

const levelHoverColors = [
  'bg-zinc-800',
  'bg-green-900',
  'bg-green-800',
  'bg-green-700',
  'bg-green-600'
];

export default function GitHubActivityGraph({ years }: GitHubActivityGraphProps) {
  const [selectedYear, setSelectedYear] = useState<number>(years[0]?.year || new Date().getFullYear());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const hoveredCellRef = useRef<HTMLDivElement | null>(null);

  const selectedYearData = years.find(y => y.year === selectedYear) || years[0];
  const { year, contributions, totalContributions } = selectedYearData;

  const contributionMap = new Map<string, ContributionData>();
  contributions.forEach(contrib => {
    contributionMap.set(contrib.date, contrib);
  });

  const firstDayOfYear = new Date(year, 0, 1);
  const firstDayOfWeek = firstDayOfYear.getDay();

  const firstSunday = new Date(firstDayOfYear);
  firstSunday.setDate(firstSunday.getDate() - firstDayOfWeek);

  const lastDayOfYear = new Date(year, 11, 31);

  const totalWeeks = Math.ceil((lastDayOfYear.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
  const weeksInYear = Math.min(totalWeeks, 53);

  const calendar: (ContributionData | null)[][] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const row: (ContributionData | null)[] = [];
    const startDate = new Date(firstSunday);
    startDate.setDate(startDate.getDate() + dayOfWeek);

    for (let weekIndex = 0; weekIndex < weeksInYear; weekIndex++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + weekIndex * 7);

      if (currentDate >= firstDayOfYear && currentDate <= lastDayOfYear) {
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
  const seenMonths = new Set<number>();

  for (let weekIndex = 0; weekIndex < weeksInYear; weekIndex++) {
    const testDate = new Date(firstSunday);
    testDate.setDate(testDate.getDate() + weekIndex * 7);

    if (testDate >= firstDayOfYear && testDate <= lastDayOfYear) {
      const month = testDate.getMonth();
      if (!seenMonths.has(month)) {
        monthPositions.push({ month, position: weekIndex });
        seenMonths.add(month);
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
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-auto hidden sm:block">
        <ul className="flex flex-col items-end gap-3 sm:gap-4">
          {years.map((yearData) => {
            const isActive = selectedYear === yearData.year;
            return (
              <li key={yearData.year}>
                <button
                  onClick={() => setSelectedYear(yearData.year)}
                  className={`
                    relative px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 text-right
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
                    }
                  `}
                  aria-label={`View ${yearData.year} contributions`}
                >
                  <span className="relative z-10">{yearData.year}</span>
                  {isActive && (
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-4 sm:h-6 bg-white transition-all duration-300"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-full bg-zinc-900/90 backdrop-blur-md border border-white/40 rounded-xl p-4 sm:p-6 md:p-8 pr-16 sm:pr-20 md:pr-24">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-white text-lg sm:text-xl font-semibold mb-1">
            {totalContributions} contributions in {year}
          </h3>
          <div className="flex items-center gap-2 sm:hidden">
            <span className="text-white/60 text-xs">Year:</span>
            <div className="flex gap-1">
              {years.map((yearData) => (
                <button
                  key={yearData.year}
                  onClick={() => setSelectedYear(yearData.year)}
                  className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                    selectedYear === yearData.year
                      ? 'bg-white/20 text-white border border-white/40'
                      : 'bg-zinc-800/50 text-white/60 hover:text-white hover:bg-zinc-800/70 border border-white/20'
                  }`}
                >
                  {yearData.year}
                </button>
              ))}
            </div>
          </div>
        </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex mb-2 relative" style={{ height: '15px', marginLeft: '22px' }}>
            {monthPositions.map(({ month, position }, idx) => {
              const nextPosition = idx < monthPositions.length - 1
                ? monthPositions[idx + 1].position
                : weeksInYear;
              const cellWidth = 13; // 10px cell + 3px gap
              const width = (nextPosition - position) * cellWidth;
              return (
                <div
                  key={month}
                  className="text-white/70 text-xs absolute top-0"
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
                  key={day}
                  className="text-white/50 text-[10px] flex items-center justify-end pr-1"
                  style={{ height: '10px', width: '20px' }}
                >
                  {idx % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>

            <div className="flex-1">
              {calendar.map((week, dayIndex) => (
                <div key={dayIndex} className="flex gap-[3px] mb-[3px]">
                  {week.map((contrib, weekIndex) => {
                    if (!contrib) {
                      return (
                        <div
                          key={`${dayIndex}-${weekIndex}`}
                          className="w-[10px] h-[10px] rounded-sm"
                        />
                      );
                    }

                    const isHovered = hoveredDate === contrib.date;
                    const level = contrib.level || 0;

                    return (
                      <div
                        key={contrib.date}
                        className={`w-[10px] h-[10px] rounded-sm transition-all duration-200 cursor-pointer relative ${
                          isHovered ? levelHoverColors[level] : levelColors[level]
                        } ${isHovered ? 'ring-2 ring-white/50 scale-110' : ''}`}
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

      {hoveredDate && tooltipPosition && (
        <div
          className="fixed z-50 bg-zinc-800 border border-white/40 rounded px-2 py-1 text-white text-xs pointer-events-none whitespace-nowrap"
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
    </div>
  );
}
