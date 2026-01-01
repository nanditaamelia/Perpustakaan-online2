import {
  formatRupiah,
  formatDate,
  formatDateIndonesia,
  calculateDaysBetween,
  calculateFine,
  isOverdue,
} from '@/lib/utils';

describe('Utils Functions', () => {
  describe('formatRupiah', () => {
    it('should format number to Rupiah currency', () => {
      expect(formatRupiah(1000)).toBe('Rp 1.000');
      expect(formatRupiah(1000000)).toBe('Rp 1.000.000');
      expect(formatRupiah(500)).toBe('Rp 500');
    });

    it('should handle zero', () => {
      expect(formatRupiah(0)).toBe('Rp 0');
    });
  });

  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should handle string dates', () => {
      expect(formatDate('2024-01-15')).toBe('2024-01-15');
    });
  });

  describe('formatDateIndonesia', () => {
    it('should format date to Indonesian format', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDateIndonesia(date);
      expect(result).toContain('Januari');
      expect(result).toContain('2024');
    });
  });

  describe('calculateDaysBetween', () => {
    it('should calculate days between two dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-11');
      expect(calculateDaysBetween(date1, date2)).toBe(10);
    });

    it('should return 0 for same dates', () => {
      const date = new Date('2024-01-01');
      expect(calculateDaysBetween(date, date)).toBe(0);
    });

    it('should return absolute value', () => {
      const date1 = new Date('2024-01-11');
      const date2 = new Date('2024-01-01');
      expect(calculateDaysBetween(date1, date2)).toBe(10);
    });
  });

  describe('calculateFine', () => {
    it('should calculate fine based on overdue days', () => {
      expect(calculateFine(5, 1000)).toBe(5000);
      expect(calculateFine(10, 2000)).toBe(20000);
    });

    it('should return 0 for no overdue', () => {
      expect(calculateFine(0, 1000)).toBe(0);
    });

    it('should use default fine rate', () => {
      expect(calculateFine(5)).toBe(5000);
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      expect(isOverdue(futureDate)).toBe(false);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isOverdue(today)).toBe(false);
    });
  });
});
