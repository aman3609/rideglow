
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startBookingCron } = await import("./lib/booking-cron");

    startBookingCron();
  }
}
