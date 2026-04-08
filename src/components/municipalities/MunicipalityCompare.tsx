import { useState } from 'react';
import { municipalities } from '../../data/municipalities';
import type { Municipality } from '../../types';

export function MunicipalityCompare() {
  const [leftId, setLeftId] = useState('frederick');
  const [rightId, setRightId] = useState('thurmont');

  const left = municipalities.find((m) => m.id === leftId)!;
  const right = municipalities.find((m) => m.id === rightId)!;

  const maxPop = Math.max(left.population, right.population);
  const maxIncome = Math.max(left.medianIncome, right.medianIncome);
  const maxArea = Math.max(left.area, right.area);

  return (
    <div className="space-y-4">
      {/* Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <MuniSelect value={leftId} onChange={setLeftId} exclude={rightId} color="#3B82F6" />
        <MuniSelect value={rightId} onChange={setRightId} exclude={leftId} color="#10B981" />
      </div>

      {/* VS Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 rounded-full bg-bg-surface border border-border px-4 py-1.5">
          <span className="text-sm font-bold text-accent">{left.name.replace(/^(City of |Town of |Village of )/, '')}</span>
          <span className="text-xs text-text-muted font-bold">VS</span>
          <span className="text-sm font-bold text-success">{right.name.replace(/^(City of |Town of |Village of )/, '')}</span>
        </div>
      </div>

      {/* Comparison Bars */}
      <div className="space-y-3">
        <CompareBar
          label="Population"
          leftVal={left.population}
          rightVal={right.population}
          max={maxPop}
          format={(v) => v.toLocaleString()}
        />
        <CompareBar
          label="Median Income"
          leftVal={left.medianIncome}
          rightVal={right.medianIncome}
          max={maxIncome}
          format={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <CompareBar
          label="Median Age"
          leftVal={left.medianAge}
          rightVal={right.medianAge}
          max={Math.max(left.medianAge, right.medianAge)}
          format={(v) => v.toFixed(1)}
        />
        <CompareBar
          label="Area"
          leftVal={left.area}
          rightVal={right.area}
          max={maxArea}
          format={(v) => `${v} mi²`}
        />
        <CompareBar
          label="Pop. Density"
          leftVal={Math.round(left.population / left.area)}
          rightVal={Math.round(right.population / right.area)}
          max={Math.max(left.population / left.area, right.population / right.area)}
          format={(v) => `${v.toLocaleString()}/mi²`}
        />
      </div>

      {/* Details Side-by-Side */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <MiniProfile muni={left} color="#3B82F6" />
        <MiniProfile muni={right} color="#10B981" />
      </div>
    </div>
  );
}

function MuniSelect({ value, onChange, exclude, color }: {
  value: string; onChange: (v: string) => void; exclude: string; color: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border bg-bg-surface px-3 py-2 text-sm text-text outline-none"
      style={{ borderColor: color }}
    >
      {municipalities.map((m) => (
        <option key={m.id} value={m.id} disabled={m.id === exclude}>
          {m.name}
        </option>
      ))}
    </select>
  );
}

function CompareBar({ label, leftVal, rightVal, max, format }: {
  label: string; leftVal: number; rightVal: number; max: number;
  format: (v: number) => string;
}) {
  const leftPct = (leftVal / max) * 100;
  const rightPct = (rightVal / max) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-accent">{format(leftVal)}</span>
        <span className="text-[10px] text-text-muted">{label}</span>
        <span className="text-xs font-medium text-success">{format(rightVal)}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 flex justify-end">
          <div
            className="h-full rounded-l-full transition-all duration-700"
            style={{ width: `${leftPct}%`, backgroundColor: '#3B82F6' }}
          />
        </div>
        <div className="flex-1">
          <div
            className="h-full rounded-r-full transition-all duration-700"
            style={{ width: `${rightPct}%`, backgroundColor: '#10B981' }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniProfile({ muni, color }: { muni: Municipality; color: string }) {
  return (
    <div className="rounded-lg bg-bg-surface border border-border p-2.5">
      <div className="font-medium text-text mb-1" style={{ color }}>
        {muni.name.replace(/^(City of |Town of |Village of )/, '')}
      </div>
      <p className="text-text-muted text-[10px] line-clamp-3">{muni.description}</p>
      {muni.website && (
        <a
          href={muni.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 text-[10px] text-accent hover:underline"
        >
          Website →
        </a>
      )}
    </div>
  );
}
