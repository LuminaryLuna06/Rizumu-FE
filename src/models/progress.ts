export type ModelProgress = {
  streak: number;
  total_hours: number;
  promo_complete: number;
  week_promo_complete: number;
  daily_average: number;
  gifts_sent: number;
  updated_at: string; // Lưu thời gian update (vẫn lưu UTC là chuẩn)
};
