export declare function useTrustScore(clientId: string): import("@tanstack/react-query").UseQueryResult<{
    score: number;
    level: "vip" | "regular" | "low";
    requiresPrepayment: boolean;
    prepaymentPercentage: number;
    riskLevel: "low" | "medium" | "high";
    trust_score: any;
    total_bookings: any;
    completed_bookings: any;
    no_show_count: any;
    cancelled_count: any;
    is_blocked: any;
    blocked_until: any;
} | null, Error>;
export declare function useUpdateClientStatus(): import("@tanstack/react-query").UseMutationResult<Record<string, any>, Error, {
    clientId: string;
    status: "completed" | "no_show" | "cancelled";
}, unknown>;
export declare function useGetNoShowFee(clientId: string, servicePrice: number): import("@tanstack/react-query").UseQueryResult<number, Error>;
export declare function useClientBlockStatus(clientId: string): import("@tanstack/react-query").UseQueryResult<{
    is_blocked: any;
    blocked_reason: any;
    blocked_until: any;
} | null, Error>;
//# sourceMappingURL=useNoShowPrevention.d.ts.map