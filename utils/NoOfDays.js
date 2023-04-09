export class Date {
  constructor(d, m, y) {
    this.d = d;
    this.m = m;
    this.y = y;
  }
}

let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function countLeapYears(d) {
  let years = d.y;

  if (d.m <= 2) {
    years--;
  }

  return (
    Math.floor(years / 4) - Math.floor(years / 100) + Math.floor(years / 400)
  );
}

export function getDifference(dt1, dt2) {
  let n1 = dt1.y * 365 + dt1.d;

  for (let i = 0; i < dt1.m - 1; i++) {
    n1 += monthDays[i];
  }

  n1 += countLeapYears(dt1);
  let n2 = dt2.y * 365 + dt2.d;
  for (let i = 0; i < dt2.m - 1; i++) {
    n2 += monthDays[i];
  }
  n2 += countLeapYears(dt2);
  return n2 - n1;
}
