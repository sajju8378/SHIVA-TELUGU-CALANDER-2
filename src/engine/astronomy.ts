/**
 * High-Precision Astronomical Calculations for Hindu (Telugu) Panchangam
 * Algorithms based on Jean Meeus Astronomical Algorithms, VSOP87, and
 * Lahiri (Chitrapaksha) Sidereal Zodiac.
 */

export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;

export function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

export function sinDeg(deg: number): number {
  return Math.sin(deg * DEG2RAD);
}

export function cosDeg(deg: number): number {
  return Math.cos(deg * DEG2RAD);
}

export function tanDeg(deg: number): number {
  return Math.tan(deg * DEG2RAD);
}

export function asinDeg(val: number): number {
  return Math.asin(Math.max(-1, Math.min(1, val))) * RAD2DEG;
}

export function acosDeg(val: number): number {
  return Math.acos(Math.max(-1, Math.min(1, val))) * RAD2DEG;
}

export function atan2Deg(y: number, x: number): number {
  return Math.atan2(y, x) * RAD2DEG;
}

/**
 * Converts a Gregorian Date and Time (UTC) to Julian Day Number (JD)
 */
export function gregorianToJD(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hour + minute / 60 + second / 3600) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
}

/**
 * Converts Julian Day Number to Gregorian calendar UTC components
 */
export function jdToGregorian(jd: number): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const Z = Math.floor(jd + 0.5);
  const F = (jd + 0.5) - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const dayWithFrac = B - D - Math.floor(30.6001 * E) + F;
  const day = Math.floor(dayWithFrac);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  const frac = dayWithFrac - day;
  const totalSeconds = Math.round(frac * 86400);
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;

  return { year, month, day, hour, minute, second };
}

/**
 * Nutation in longitude (dpsi) and obliquity (deps) in degrees
 */
export function getNutation(jd: number): { dpsi: number; deps: number; eps0: number } {
  const T = (jd - 2451545.0) / 36525.0;
  // Mean elongation of Moon
  const D = normalizeDeg(297.85036 + 445267.11148 * T);
  // Sun mean anomaly
  const M = normalizeDeg(357.52772 + 35999.05034 * T);
  // Moon mean anomaly
  const Mprime = normalizeDeg(134.96298 + 477198.867398 * T);
  // Moon argument of latitude
  const F = normalizeDeg(93.27191 + 483202.017538 * T);
  // Longitude of Moon ascending node
  const Omega = normalizeDeg(125.04452 - 1934.136261 * T);

  // Mean obliquity of ecliptic (Meeus 22.2)
  const eps0 = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;

  // Nutation series in arcseconds (major terms)
  const dpsiArcsec =
    -17.20 * sinDeg(Omega) -
    1.32 * sinDeg(2 * (normalizeDeg(280.4665 + 36000.7698 * T))) -
    0.23 * sinDeg(2 * (normalizeDeg(218.3165 + 481267.8813 * T))) +
    0.21 * sinDeg(2 * Omega);

  const depsArcsec =
    9.20 * cosDeg(Omega) +
    0.57 * cosDeg(2 * (normalizeDeg(280.4665 + 36000.7698 * T))) +
    0.10 * cosDeg(2 * (normalizeDeg(218.3165 + 481267.8813 * T))) -
    0.09 * cosDeg(2 * Omega);

  return {
    dpsi: dpsiArcsec / 3600.0,
    deps: depsArcsec / 3600.0,
    eps0,
  };
}

/**
 * Lahiri (Chitrapaksha) Ayanamsa for a given Julian Day
 * Standard Indian Government Calendar Reform Committee (NCAC) formula.
 * Base value at J2000.0: 23° 51' 25.53" = 23.85709167 degrees
 * Precession: 50.290966" / year (Meeus/IAU 1976 / 1980) + Nutation
 */
export function getLahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  // Standard Lahiri base value at J2000.0
  const baseAyanamsa = 23.85709167; // 23° 51' 25.53"
  // Precession rate: 5029.0966 arcseconds per century = 1.396971277 degrees
  const precession = 1.396971277 * T + 0.0003086 * T * T;
  const { dpsi } = getNutation(jd);
  return baseAyanamsa + precession + dpsi;
}

/**
 * Apparent Geocentric Solar Longitude (Tropical) in degrees
 */
export function getSunTropicalLongitude(jd: number): { longitude: number; distanceAU: number } {
  const T = (jd - 2451545.0) / 36525.0;
  // Mean longitude of Sun
  const L0 = normalizeDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  // Mean anomaly of Sun
  const M = normalizeDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  // Eccentricity of Earth's orbit
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  // Sun equation of center
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinDeg(M) +
    (0.019993 - 0.000101 * T) * sinDeg(2 * M) +
    0.000289 * sinDeg(3 * M);

  // True longitude
  const trueLon = L0 + C;
  // True anomaly
  const v = M + C;
  // Distance in AU
  const R = (1.000001018 * (1 - e * e)) / (1 + e * cosDeg(v));

  // Corrections for aberration (-20.489 arcsec) and nutation
  const Omega = normalizeDeg(125.04 - 1934.136 * T);
  const lambda = trueLon - 0.00569 - 0.00478 * sinDeg(Omega);

  return {
    longitude: normalizeDeg(lambda),
    distanceAU: R,
  };
}

/**
 * Apparent Geocentric Lunar Longitude (Tropical) in degrees
 * Using dominant perturbation terms from ELP2000 / Meeus Chapter 47.
 */
export function getMoonTropicalLongitude(jd: number): { longitude: number; latitude: number; distanceKm: number } {
  const T = (jd - 2451545.0) / 36525.0;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  // Moon's mean longitude L'
  const Lp = normalizeDeg(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841.0 - T4 / 65194000.0);
  // Mean elongation of Moon D
  const D = normalizeDeg(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0 - T4 / 113065000.0);
  // Sun's mean anomaly M
  const M = normalizeDeg(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000.0);
  // Moon's mean anomaly M'
  const Mp = normalizeDeg(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0 - T4 / 14712000.0);
  // Moon's argument of latitude F
  const F = normalizeDeg(93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000.0 + T4 / 863310000.0);

  // Additional planetary arguments A1, A2, A3
  const A1 = normalizeDeg(119.75 + 131.849 * T);
  const A2 = normalizeDeg(53.09 + 479264.29 * T);
  const A3 = normalizeDeg(313.45 + 481266.484 * T);

  // Periodic terms for longitude (unit: 10^-6 degrees)
  let sumL = 0;
  // Principal term: Evection, Variation, Annual Equation etc.
  sumL += 6288774 * sinDeg(Mp);
  sumL += 1274027 * sinDeg(2 * D - Mp);
  sumL += 658314 * sinDeg(2 * D);
  sumL += 213618 * sinDeg(2 * Mp);
  sumL -= 185116 * sinDeg(M);
  sumL -= 114332 * sinDeg(2 * F);
  sumL += 58793 * sinDeg(2 * D - 2 * Mp);
  sumL += 57066 * sinDeg(2 * D - M - Mp);
  sumL += 53322 * sinDeg(2 * D + Mp);
  sumL += 45758 * sinDeg(2 * D - M);
  sumL -= 40923 * sinDeg(M - Mp);
  sumL -= 34720 * sinDeg(D);
  sumL -= 30383 * sinDeg(M + Mp);
  sumL += 15327 * sinDeg(2 * D - 2 * F);
  sumL -= 12528 * sinDeg(2 * D + M - Mp);
  sumL += 10980 * sinDeg(2 * D + M);
  sumL += 10675 * sinDeg(4 * D - Mp);
  sumL += 10034 * sinDeg(3 * Mp);
  sumL += 8548 * sinDeg(4 * D - 2 * Mp);
  sumL -= 7888 * sinDeg(2 * D - M - 2 * Mp);
  sumL -= 6766 * sinDeg(2 * D + M - 2 * Mp);
  sumL -= 5163 * sinDeg(D - Mp);
  sumL += 4987 * sinDeg(D + M);
  sumL += 4036 * sinDeg(2 * D - M + Mp);
  sumL += 3994 * sinDeg(2 * D + 2 * Mp);
  sumL += 3861 * sinDeg(4 * D);
  sumL += 3665 * sinDeg(2 * D - 3 * Mp);
  sumL -= 2689 * sinDeg(M - 2 * Mp);
  sumL -= 2602 * sinDeg(2 * D - M + 2 * F);
  sumL += 2390 * sinDeg(2 * D - Mp - 2 * F);
  sumL -= 2348 * sinDeg(D + Mp);
  sumL += 2236 * sinDeg(2 * D - 2 * M);
  sumL -= 2120 * sinDeg(M + 2 * Mp);
  sumL -= 2069 * sinDeg(2 * M);
  sumL += 2048 * sinDeg(2 * D - 2 * M - Mp);
  sumL -= 1773 * sinDeg(2 * D + Mp - 2 * F);
  sumL -= 1595 * sinDeg(2 * D + 2 * F);
  sumL += 1215 * sinDeg(4 * D - M - Mp);
  sumL -= 1110 * sinDeg(2 * Mp + 2 * F);
  sumL += 892 * sinDeg(3 * D - Mp);
  sumL -= 810 * sinDeg(2 * D + M + Mp);
  sumL += 759 * sinDeg(4 * D - M - 2 * Mp);
  sumL -= 713 * sinDeg(2 * M - Mp);
  sumL -= 700 * sinDeg(2 * D + 2 * M - Mp);
  sumL += 691 * sinDeg(2 * D + M - 2 * F);
  sumL += 596 * sinDeg(2 * D - M - 2 * F);
  sumL += 549 * sinDeg(4 * D + Mp);
  sumL += 537 * sinDeg(4 * Mp);
  sumL += 520 * sinDeg(4 * D - M);
  sumL -= 487 * sinDeg(D - 2 * Mp);
  sumL -= 399 * sinDeg(2 * D + M - 2 * Mp);
  sumL -= 381 * sinDeg(2 * Mp - 2 * F);
  sumL += 351 * sinDeg(D + M - Mp);
  sumL -= 340 * sinDeg(2 * D - 4 * Mp);
  sumL += 330 * sinDeg(2 * D - M - Mp - 2 * F);
  sumL += 327 * sinDeg(2 * D - M + 2 * Mp);
  sumL -= 323 * sinDeg(2 * M + Mp);
  sumL += 299 * sinDeg(D + M + Mp);

  // Periodic terms for latitude (unit: 10^-6 degrees)
  let sumB = 0;
  sumB += 5128122 * sinDeg(F);
  sumB += 280602 * sinDeg(Mp + F);
  sumB += 277693 * sinDeg(Mp - F);
  sumB += 173237 * sinDeg(2 * D - F);
  sumB += 55413 * sinDeg(2 * D - Mp + F);
  sumB += 46271 * sinDeg(2 * D - Mp - F);
  sumB += 32573 * sinDeg(2 * D + F);
  sumB += 17198 * sinDeg(2 * Mp + F);
  sumB += 9266 * sinDeg(2 * D + Mp - F);
  sumB += 8822 * sinDeg(2 * Mp - F);
  sumB += 8216 * sinDeg(2 * D - M - F);
  sumB += 4324 * sinDeg(2 * D - 2 * Mp - F);
  sumB += 4200 * sinDeg(2 * D + Mp + F);

  // Planetary additions
  sumL += 3958 * sinDeg(A1) + 1962 * sinDeg(Lp - F) + 318 * sinDeg(A2);
  sumB += -2235 * sinDeg(Lp) + 382 * sinDeg(A3) + 175 * sinDeg(A1 - F) + 175 * sinDeg(A1 + F);

  // Nutation correction
  const { dpsi } = getNutation(jd);

  const lambda = normalizeDeg(Lp + sumL / 1000000.0 + dpsi);
  const beta = sumB / 1000000.0;
  const distanceKm = 385000.56; // Mean distance approx

  return {
    longitude: lambda,
    latitude: beta,
    distanceKm,
  };
}

/**
 * Sidereal Longitudes for Sun and Moon (using Lahiri Ayanamsa)
 */
export function getSiderealPositions(jd: number): {
  sunSiderealLon: number;
  moonSiderealLon: number;
  ayanamsa: number;
  phaseAngle: number; // 0 to 360: MoonLon - SunLon
} {
  const ayanamsa = getLahiriAyanamsa(jd);
  const sunTrop = getSunTropicalLongitude(jd);
  const moonTrop = getMoonTropicalLongitude(jd);

  const sunSid = normalizeDeg(sunTrop.longitude - ayanamsa);
  const moonSid = normalizeDeg(moonTrop.longitude - ayanamsa);
  const phaseAngle = normalizeDeg(moonSid - sunSid);

  return {
    sunSiderealLon: sunSid,
    moonSiderealLon: moonSid,
    ayanamsa,
    phaseAngle,
  };
}

/**
 * Accurate Sunrise, Sunset, and Noon computation for any geographic coordinate.
 * Standard astronomical zenith: 90° 50' (90.8333°) to account for refraction (34')
 * and solar disk radius (16').
 * Returns local time in hours (0.00 to 24.00) relative to timezone offset.
 */
export function calculateSunTimes(
  year: number,
  month: number,
  day: number,
  latitude: number,
  longitude: number,
  tzOffsetHours = 5.5 // Default IST
): {
  sunriseHours: number;
  sunsetHours: number;
  noonHours: number;
} {
  // Approximate solar noon at longitude
  const noonApproxUTC = 12.0 - longitude / 15.0;
  const jdNoonApprox = gregorianToJD(year, month, day, noonApproxUTC, 0, 0);

  // Compute solar declination and equation of time at noon
  const { longitude: sunLon } = getSunTropicalLongitude(jdNoonApprox);
  const { eps0 } = getNutation(jdNoonApprox);
  const sinDec = sinDeg(eps0) * sinDeg(sunLon);
  const dec = asinDeg(sinDec);

  // Hour angle calculation for zenith 90.8333 degrees
  const zenith = 90.833333;
  const cosH0 = (cosDeg(zenith) - sinDeg(latitude) * sinDeg(dec)) / (cosDeg(latitude) * cosDeg(dec));

  let H0 = 90.0;
  if (cosH0 >= 1) {
    H0 = 0.0; // Polar night
  } else if (cosH0 <= -1) {
    H0 = 180.0; // Polar day
  } else {
    H0 = acosDeg(cosH0);
  }

  // Refined calculation using Equation of Time
  const T = (jdNoonApprox - 2451545.0) / 36525.0;
  const L0 = normalizeDeg(280.46646 + 36000.76983 * T);
  const M = normalizeDeg(357.52911 + 35999.05029 * T);
  const e = 0.016708634 - 0.000042037 * T;
  const y = tanDeg(eps0 / 2) * tanDeg(eps0 / 2);
  const EoTRad = y * Math.sin(2 * L0 * DEG2RAD) - 2 * e * Math.sin(M * DEG2RAD) +
                 4 * e * y * Math.sin(M * DEG2RAD) * Math.cos(2 * L0 * DEG2RAD) -
                 0.5 * y * y * Math.sin(4 * L0 * DEG2RAD) -
                 1.25 * e * e * Math.sin(2 * M * DEG2RAD);
  const EoTHours = (EoTRad * RAD2DEG * 4.0) / 60.0; // Equation of time in hours

  // True solar transit (Noon) in UTC
  const transitUTC = 12.0 - longitude / 15.0 - EoTHours;
  const transitLocal = transitUTC + tzOffsetHours;

  const halfDayHours = H0 / 15.0;
  const sunriseLocal = transitLocal - halfDayHours;
  const sunsetLocal = transitLocal + halfDayHours;

  return {
    sunriseHours: (sunriseLocal + 24) % 24,
    sunsetHours: (sunsetLocal + 24) % 24,
    noonHours: (transitLocal + 24) % 24,
  };
}

/**
 * Format decimal hours (e.g. 6.241) into TimeString
 */
export function hoursToTimeString(decimalHours: number): {
  hour: number;
  minute: number;
  second: number;
  formatted12: string;
  formatted24: string;
} {
  const norm = ((decimalHours % 24) + 24) % 24;
  const totalSeconds = Math.round(norm * 3600);
  const hour = Math.floor(totalSeconds / 3600) % 24;
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;

  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted12 = `${pad(h12)}:${pad(minute)} ${ampm}`;
  const formatted24 = `${pad(hour)}:${pad(minute)}`;

  return { hour, minute, second, formatted12, formatted24 };
}

/**
 * Find exact root (transition time) of an angular quantity using bisection.
 * Finds when angleValue(t) crosses targetDeg (mod 360).
 */
export function findTransitionJD(
  startJD: number,
  endJD: number,
  targetDeg: number,
  angleFunction: (jd: number) => number,
  maxIterations = 24
): number {
  let low = startJD;
  let high = endJD;

  // Angular difference helper
  const diff = (jd: number) => {
    const val = angleFunction(jd);
    let d = (val - targetDeg) % 360;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  };

  let diffLow = diff(low);
  let diffHigh = diff(high);

  // If both have same sign, check if a crossing occurred
  if (diffLow * diffHigh > 0) {
    // Subdivide into steps of 1 hour
    const steps = 24;
    const stepSize = (endJD - startJD) / steps;
    let found = false;
    for (let i = 0; i < steps; i++) {
      const t1 = startJD + i * stepSize;
      const t2 = t1 + stepSize;
      const d1 = diff(t1);
      const d2 = diff(t2);
      if (d1 * d2 <= 0) {
        low = t1;
        high = t2;
        diffLow = d1;
        diffHigh = d2;
        found = true;
        break;
      }
    }
    if (!found) {
      return endJD; // No crossing in range
    }
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = (low + high) / 2.0;
    const diffMid = diff(mid);
    if (Math.abs(diffMid) < 0.0001 || (high - low) * 86400 < 5) {
      return mid; // Converged to within ~5 seconds
    }
    if (diffLow * diffMid <= 0) {
      high = mid;
      diffHigh = diffMid;
    } else {
      low = mid;
      diffLow = diffMid;
    }
  }

  return (low + high) / 2.0;
}
