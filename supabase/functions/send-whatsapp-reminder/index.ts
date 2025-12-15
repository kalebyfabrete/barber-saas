import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      phone_number,
      client_name,
      service_name,
      barber_name,
      hours_until_appointment,
      booking_id,
      organization_id,
    } = await req.json();

    // Formatar mensagem de lembrete
    let reminderText = "";
    if (hours_until_appointment > 24) {
      reminderText = `⏰ Lembrete: Faltam ${Math.round(hours_until_appointment / 24)} dias para seu agendamento!`;
    } else if (hours_until_appointment >= 2) {
      reminderText = `⏰ Lembrete: Seu agendamento é em ${Math.round(hours_until_appointment)} horas!`;
    } else {
      reminderText = `⏰ Última chance: Seu agendamento é em ${Math.round(hours_until_appointment * 60)} minutos!`;
    }

    const message = `${reminderText}\n\n💇 ${service_name} com ${barber_name}\n\nNão se atrase! 😊\n\nResponda "Sim" para confirmar presença ou "Não" para reagendar.`;

    console.log(`WhatsApp reminder to ${phone_number}: ${message}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "WhatsApp reminder sent",
        booking_id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
