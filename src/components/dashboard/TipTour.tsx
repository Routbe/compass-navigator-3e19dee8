import { AnchoredTour, type TourStep } from "@/components/onboarding/AnchoredTour";

const STEPS: TourStep[] = [
  { target: '[data-tour="tip-status"]', title: "Je steunpagina staat aan", body: "Hier zet je de steunpagina aan of uit en open je hem zoals bezoekers hem zien." },
  { target: '[data-tour="tip-bank"]', title: "Je bankrekening", body: "Bezoekers scannen een QR-code met hun eigen bank-app. Het geld gaat rechtstreeks naar jou." },
  { target: '[data-tour="tip-amounts"]', title: "Bedragen en boodschap", body: "Kies vaste bedragen, een minimum en een korte boodschap voor je supporters." },
  { target: '[data-tour="tip-photos"]', title: "Voeg foto's toe", body: "Tot 6 foto's. Ze worden automatisch verkleind zonder zichtbaar verlies." },
  { target: '[data-tour="tip-save"]', title: "Klaar", body: "Klik op 'Opslaan' om je wijzigingen te publiceren." },
];

export const TIP_TOUR_KEY = "rout_tour_tip_done";

/** Rondleiding bij de eerste activatie van de steunpagina, verankerd aan de echte velden. */
export function TipTour({ onDone }: { onDone: () => void }) {
  const finish = () => {
    try {
      window.localStorage.setItem(TIP_TOUR_KEY, "1");
    } catch {
      /* geen opslag: de tour komt dan nog eens terug */
    }
    onDone();
  };
  return <AnchoredTour steps={STEPS} onDone={finish} labels={{ skip: "Overslaan", back: "Vorige", next: "Volgende", done: "Begrepen" }} />;
}
