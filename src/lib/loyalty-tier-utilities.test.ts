import {
  getTierFromPoints,
  getNextTier,
  getPointsToNextTier,
  getTierProgress
} from './loyalty-tier-utilities';

describe('Loyalty Tier Utilities', () => {
  describe('getTierFromPoints', () => {
    it('returns bronze for 0-999 points', () => {
      expect(getTierFromPoints(0)).toBe('bronze');
      expect(getTierFromPoints(500)).toBe('bronze');
      expect(getTierFromPoints(999)).toBe('bronze');
    });

    it('returns silver for 1000-4999 points', () => {
      expect(getTierFromPoints(1000)).toBe('silver');
      expect(getTierFromPoints(2500)).toBe('silver');
      expect(getTierFromPoints(4999)).toBe('silver');
    });

    it('returns gold for 5000-14999 points', () => {
      expect(getTierFromPoints(5000)).toBe('gold');
      expect(getTierFromPoints(10000)).toBe('gold');
      expect(getTierFromPoints(14999)).toBe('gold');
    });

    it('returns diamond for 15000+ points', () => {
      expect(getTierFromPoints(15000)).toBe('diamond');
      expect(getTierFromPoints(20000)).toBe('diamond');
    });
  });

  describe('getNextTier', () => {
    it('returns silver after bronze', () => {
      expect(getNextTier('bronze')).toBe('silver');
    });

    it('returns gold after silver', () => {
      expect(getNextTier('silver')).toBe('gold');
    });

    it('returns diamond after gold', () => {
      expect(getNextTier('gold')).toBe('diamond');
    });

    it('returns null after diamond', () => {
      expect(getNextTier('diamond')).toBeNull();
    });
  });

  describe('getPointsToNextTier', () => {
    it('calculates points needed for bronze to silver', () => {
      // Silver starts at 1000
      expect(getPointsToNextTier(0, 'bronze')).toBe(1000);
      expect(getPointsToNextTier(500, 'bronze')).toBe(500);
      expect(getPointsToNextTier(999, 'bronze')).toBe(1);
    });

    it('calculates points needed for silver to gold', () => {
      // Gold starts at 5000
      expect(getPointsToNextTier(1000, 'silver')).toBe(4000);
      expect(getPointsToNextTier(4000, 'silver')).toBe(1000);
    });

    it('calculates points needed for gold to diamond', () => {
      // Diamond starts at 15000
      expect(getPointsToNextTier(5000, 'gold')).toBe(10000);
      expect(getPointsToNextTier(14000, 'gold')).toBe(1000);
    });

    it('returns 0 for diamond tier', () => {
      expect(getPointsToNextTier(15000, 'diamond')).toBe(0);
    });
  });

  describe('getTierProgress', () => {
    it('calculates progress for bronze tier (0-1000 range)', () => {
      expect(getTierProgress(0, 'bronze')).toBe(0);
      expect(getTierProgress(500, 'bronze')).toBe(50);
      expect(getTierProgress(999, 'bronze')).toBeCloseTo(99.9);
    });

    it('calculates progress for silver tier (1000-5000 range, span 4000)', () => {
      // 1000 base, 2000 current = 1000 progress in 4000 range = 25%
      expect(getTierProgress(1000, 'silver')).toBe(0);
      expect(getTierProgress(2000, 'silver')).toBe(25);
      expect(getTierProgress(3000, 'silver')).toBe(50);
      expect(getTierProgress(4999, 'silver')).toBeCloseTo(99.975);
    });

    it('returns 100 for diamond tier', () => {
      expect(getTierProgress(15000, 'diamond')).toBe(100);
      expect(getTierProgress(20000, 'diamond')).toBe(100);
    });
  });
});
