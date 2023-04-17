import { useEffect, useState, useMemo } from 'react';
import Time from 'timen';

import S from './Token.styl';

function shortnameForBugNumbers(number) {
  const units = ['', 'k', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
  let unitIndex = 0;

  while (number >= 1000) {
    number /= 1000;
    unitIndex++;
  }

  return number.toFixed(2) + units[unitIndex];
}

const COLORS = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#8B00FF',
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
const getRangomAngle = () => Math.floor(Math.random() * 180);
const getParams = () => [getRangomAngle(), getRandomColor(), getRandomColor()];

function useGradient(value) {
  const [params, setParams] = useState(getParams());

  useEffect(() => {
    setParams(getParams());
  }, [value]);

  return params;
}

export function Token({ value }) {
  const shortname = useMemo(() => shortnameForBugNumbers(value), [value]);
  const [angle, color1, color2] = useGradient(value);

  return (
    <span className={S.root}>
      <style>{`

        .${S.coin} {
          --a: ${angle}deg;
          --c1: ${color1};
          --c2: ${color2};
          transition-duration: 2s;
          background-image: linear-gradient(var(--a), var(--c1), var(--c2));
        }
      `}</style>
      <div className={S.coin} />
      {shortname}
    </span>
  );
}
