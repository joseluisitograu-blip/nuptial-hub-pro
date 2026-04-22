import { CalendarPlus } from "lucide-react";

interface Props {
  weddingDate: string;
  partner1: string;
  partner2: string;
  ceremonyVenue: string;
  ceremonyAddress: string;
}

const WeddingCalendar = ({ weddingDate, partner1, partner2, ceremonyVenue, ceremonyAddress }: Props) => {
  if (!weddingDate) return null;

  const date = new Date(weddingDate);
  const title = `Boda de ${partner1} y ${partner2}`;
  const location = [ceremonyVenue, ceremonyAddress].filter(Boolean).join(", ");

  // Format: YYYYMMDD (all-day event)
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const ymdEnd = nextDay.toISOString().slice(0, 10).replace(/-/g, "");

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${ymd}/${ymdEnd}&location=${encodeURIComponent(location)}&details=${encodeURIComponent("¡Nos casamos! 💍")}`;

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ClickTuBoda//ES",
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${ymd}`,
      `DTEND;VALUE=DATE:${ymdEnd}`,
      `SUMMARY:${title}`,
      `LOCATION:${location}`,
      `DESCRIPTION:¡Nos casamos! 💍`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boda-${partner1}-${partner2}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-16 sm:py-20 bg-secondary">
      <div className="container max-w-md text-center">
        <CalendarPlus className="w-8 h-8 text-primary mx-auto mb-4 opacity-70" />
        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-2">Guarda la fecha</h2>
        <p className="text-muted-foreground font-light mb-8 text-sm">
          Añade nuestra boda a tu calendario para no olvidarlo
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Google Calendar
          </a>
          <button
            onClick={downloadIcs}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
          >
            Apple / Outlook (.ics)
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeddingCalendar;
