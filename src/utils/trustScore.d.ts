export interface TrustScoreCalculation {
    score: number;
    level: 'vip' | 'regular' | 'low';
    requiresPrepayment: boolean;
    prepaymentPercentage: number;
    riskLevel: 'low' | 'medium' | 'high';
}
export declare function calculateTrustScore(totalBookings: number, completedBookings: number, noShowCount: number, cancelledCount: number, currentScore?: number): TrustScoreCalculation;
export declare function shouldBlockClient(noShowCount: number, totalBookings: number, score: number): {
    blocked: boolean;
    reason?: string;
    blockDays?: number;
};
export declare function getNoShowFee(noShowCount: number, servicePrice: number): number;
//# sourceMappingURL=trustScore.d.ts.map