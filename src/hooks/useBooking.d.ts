import { Service, Booking, Client } from '@/types';
export declare function useServices(organizationId: string): import("@tanstack/react-query").UseQueryResult<Service[], Error>;
export declare function useBarbersAvailability(organizationId: string, date: Date): import("@tanstack/react-query").UseQueryResult<{
    id: any;
    full_name: any;
    avatar_url: any;
    rating: any;
    total_reviews: any;
}[], Error>;
export declare function useAvailableSlots(_organizationId: string, barberId: string, serviceId: string, selectedDate: Date): import("@tanstack/react-query").UseQueryResult<string[], Error>;
export declare function useCreateBooking(): import("@tanstack/react-query").UseMutationResult<Booking, Error, {
    organizationId: string;
    clientId: string;
    barberId: string;
    serviceId: string;
    scheduledAt: string;
    servicePrice: number;
    prepaymentRequired: boolean;
    prepaymentAmount?: number;
}, unknown>;
export declare function useClients(organizationId: string): import("@tanstack/react-query").UseQueryResult<Client[], Error>;
//# sourceMappingURL=useBooking.d.ts.map