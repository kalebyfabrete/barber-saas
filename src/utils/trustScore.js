export function calculateTrustScore(totalBookings, completedBookings, noShowCount, cancelledCount, currentScore) {
    let score = currentScore ?? 500;
    // Base score (500)
    // +10 points por cada agendamento completado
    if (totalBookings > 0) {
        const completionRate = completedBookings / totalBookings;
        score += Math.round(completionRate * 100);
    }
    // -50 points por cada no-show
    score -= noShowCount * 50;
    // -20 points por cada cancelamento
    score -= cancelledCount * 20;
    // Limitar entre 0 e 1000
    score = Math.max(0, Math.min(1000, score));
    // Determinar nível e necessidade de pré-pagamento
    let level;
    let requiresPrepayment;
    let prepaymentPercentage;
    let riskLevel;
    if (score >= 800) {
        level = 'vip';
        requiresPrepayment = false;
        prepaymentPercentage = 0;
        riskLevel = 'low';
    }
    else if (score >= 600) {
        level = 'regular';
        requiresPrepayment = false;
        prepaymentPercentage = 0;
        riskLevel = 'low';
    }
    else if (score >= 400) {
        level = 'regular';
        requiresPrepayment = true;
        prepaymentPercentage = 30;
        riskLevel = 'medium';
    }
    else {
        level = 'low';
        requiresPrepayment = true;
        prepaymentPercentage = 100;
        riskLevel = 'high';
    }
    return {
        score,
        level,
        requiresPrepayment,
        prepaymentPercentage,
        riskLevel,
    };
}
export function shouldBlockClient(noShowCount, totalBookings, score) {
    // Bloquear se 3 no-shows nos últimos 10 agendamentos
    if (totalBookings >= 10) {
        const recentNoShowRate = noShowCount / totalBookings;
        if (recentNoShowRate >= 0.3) {
            return {
                blocked: true,
                reason: 'Múltiplos no-shows',
                blockDays: 30,
            };
        }
    }
    // Bloquear se score muito baixo (< 200)
    if (score < 200) {
        return {
            blocked: true,
            reason: 'Score de confiabilidade muito baixo',
            blockDays: 7,
        };
    }
    return { blocked: false };
}
export function getNoShowFee(noShowCount, servicePrice) {
    // Multa aumenta com o número de no-shows
    if (noShowCount === 0)
        return 0;
    if (noShowCount === 1)
        return servicePrice * 0.5;
    if (noShowCount === 2)
        return servicePrice * 0.75;
    return servicePrice; // Multa total
}
//# sourceMappingURL=trustScore.js.map