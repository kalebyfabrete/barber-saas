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
      scheduled_time,
      booking_id,
      organization_id,
    } = await req.json();

    // Formatar mensagem do WhatsApp
    const message = `💈 *Agendamento Confirmado!*\n\nOlá ${client_name}! \n\nSeu agendamento foi confirmado:\n\n📅 *Quando:* ${scheduled_time}\n💇 *Serviço:* ${service_name}\n👨‍💼 *Barbeiro:* ${barber_name}\n\nNão falte! Confirme sua presença respondendo com "Sim" ou clique no botão abaixo.\n\nQualquer dúvida, nos avise!`;

    // TODO: Integrar com Twilio WhatsApp API
    // Por enquanto, apenas registramos no banco de dados
    console.log(`WhatsApp to ${phone_number}: ${message}`);

    // Aqui você integraria com Twilio:
    // const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': 'Basic ' + btoa(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN),
    //   },
    //   body: new URLSearchParams({
    //     'From': TWILIO_WHATSAPP_NUMBER,
    //     'To': 'whatsapp:' + phone_number,
    //     'Body': message,
    //   }).toString(),
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: "WhatsApp message sent",
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
