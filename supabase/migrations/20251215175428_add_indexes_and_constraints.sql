/*
  # BarberTech Pro - Índices e Constraints
  
  Performance otimizada para queries críticas
*/

CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_organization ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_trust_score ON clients(organization_id, trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_services_organization ON services(organization_id);

CREATE INDEX IF NOT EXISTS idx_bookings_availability 
ON bookings(barber_id, scheduled_at, status) 
WHERE status NOT IN ('cancelled', 'no_show');

CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_organization ON bookings(organization_id, scheduled_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_organization_date ON payments(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_waitlist_active ON waitlist(organization_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(organization_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_daily_metrics_organization ON daily_metrics(organization_id, date DESC);
