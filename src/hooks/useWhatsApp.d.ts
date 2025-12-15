interface WhatsAppMessage {
    organizationId: string;
    phoneNumber: string;
    clientName: string;
    serviceName: string;
    barberName: string;
    scheduledTime: string;
    bookingId: string;
}
export declare function useSendWhatsAppConfirmation(): import("@tanstack/react-query").UseMutationResult<any, Error, WhatsAppMessage, unknown>;
export declare function useSendWhatsAppReminder(): import("@tanstack/react-query").UseMutationResult<any, Error, {
    phoneNumber: string;
    clientName: string;
    serviceName: string;
    barberName: string;
    hoursUntilAppointment: number;
    bookingId: string;
    organizationId: string;
}, unknown>;
export {};
//# sourceMappingURL=useWhatsApp.d.ts.map