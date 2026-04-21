import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "es" | "en";

const translations = {
  es: {
    gettingMarried: "¡Nos casamos!",
    dressCode: "Código de vestimenta",
    days: "Días",
    hours: "Horas",
    min: "Min",
    sec: "Seg",
    ourStory: "Nuestra Historia",
    agenda: "Agenda del día",
    venue: "Lugar",
    ceremony: "Ceremonia",
    reception: "Celebración",
    howToGet: "Cómo llegar",
    menu: "Menú",
    starters: "Entrantes",
    mains: "Principales",
    desserts: "Postres",
    accommodations: "Alojamiento",
    recommended: "Alojamientos recomendados",
    seating: "Mesas",
    searchGuest: "Busca tu nombre...",
    seatNotVisible: "El sitting estará disponible un día antes de la boda.",
    gift: "Lista de bodas",
    revealAccount: "Revelar cuenta",
    copied: "¡Copiado!",
    copyAccount: "Copiar cuenta",
    playlist: "Playlist",
    suggestSong: "Sugerir canción",
    songTitle: "Título de la canción",
    artist: "Artista",
    suggestedBy: "Sugerido por",
    add: "Añadir",
    cancel: "Cancelar",
    photos: "Fotos",
    uploadPhoto: "Subir foto",
    guestbook: "Libro de firmas",
    leaveMessage: "Deja un mensaje o nota de voz a los novios",
    yourName: "Tu nombre",
    yourMessage: "Tu mensaje para los novios ✨",
    recordAudio: "Grabar audio",
    stop: "Parar",
    sign: "Firmar",
    sending: "Enviando...",
    listenVoice: "Escuchar mensaje de voz",
    pauseAudio: "Pausar audio",
    faq: "Preguntas frecuentes",
    faqSubtitle: "Todo lo que necesitas saber",
    comingSoon: "Próximamente...",
    rsvp: "Confirmar asistencia",
    guestName: "Nombre completo",
    email: "Email (opcional)",
    attending: "¿Asistirás?",
    yes: "Sí, asistiré",
    no: "No podré asistir",
    numGuests: "Número de invitados",
    dietaryNotes: "Notas de dieta / alergias",
    messageToCouple: "Mensaje para los novios",
    confirm: "Confirmar asistencia",
    thankYou: "¡Gracias!",
    rsvpReceived: "Tu confirmación ha sido recibida",
    share: "Compartir",
    shareSubtitle: "Comparte esta boda",
    copyLink: "Copiar enlace",
    shareWhatsApp: "Enviar por WhatsApp",
    loading: "Cargando...",
    weddingNotFound: "Boda no encontrada",
    invalidLink: "El enlace no es válido.",
    openMaps: "Abrir en Google Maps",
    voiceMessage: "🎤 Mensaje de voz",
  },
  en: {
    gettingMarried: "We're getting married!",
    dressCode: "Dress code",
    days: "Days",
    hours: "Hours",
    min: "Min",
    sec: "Sec",
    ourStory: "Our Story",
    agenda: "Agenda",
    venue: "Venue",
    ceremony: "Ceremony",
    reception: "Reception",
    howToGet: "How to get there",
    menu: "Menu",
    starters: "Starters",
    mains: "Mains",
    desserts: "Desserts",
    accommodations: "Accommodations",
    recommended: "Recommended places to stay",
    seating: "Seating",
    searchGuest: "Search your name...",
    seatNotVisible: "Seating will be available one day before the wedding.",
    gift: "Gift Registry",
    revealAccount: "Reveal account",
    copied: "Copied!",
    copyAccount: "Copy account",
    playlist: "Playlist",
    suggestSong: "Suggest a song",
    songTitle: "Song title",
    artist: "Artist",
    suggestedBy: "Suggested by",
    add: "Add",
    cancel: "Cancel",
    photos: "Photos",
    uploadPhoto: "Upload photo",
    guestbook: "Guestbook",
    leaveMessage: "Leave a message or voice note for the couple",
    yourName: "Your name",
    yourMessage: "Your message for the couple ✨",
    recordAudio: "Record audio",
    stop: "Stop",
    sign: "Sign",
    sending: "Sending...",
    listenVoice: "Listen to voice message",
    pauseAudio: "Pause audio",
    faq: "FAQ",
    faqSubtitle: "Everything you need to know",
    comingSoon: "Coming soon...",
    rsvp: "RSVP",
    guestName: "Full name",
    email: "Email (optional)",
    attending: "Will you attend?",
    yes: "Yes, I'll be there",
    no: "Sorry, I can't make it",
    numGuests: "Number of guests",
    dietaryNotes: "Dietary notes / allergies",
    messageToCouple: "Message for the couple",
    confirm: "Confirm attendance",
    thankYou: "Thank you!",
    rsvpReceived: "Your RSVP has been received",
    share: "Share",
    shareSubtitle: "Share this wedding",
    copyLink: "Copy link",
    shareWhatsApp: "Share on WhatsApp",
    loading: "Loading...",
    weddingNotFound: "Wedding not found",
    invalidLink: "This link is not valid.",
    openMaps: "Open in Google Maps",
    voiceMessage: "🎤 Voice message",
  },
} as const;

type Translations = typeof translations.es;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: "es",
  setLang: () => {},
  t: translations.es,
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("es");
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const LangToggle = () => {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors"
    >
      {lang === "es" ? "EN" : "ES"}
    </button>
  );
};
