import Link from "next/link";
import { ArrowRight, Compass, Home, Sparkles } from "lucide-react";
import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="not-found-page">
        <div className="not-found-illustration">
          <div className="not-found-code">404</div>
          <div className="not-found-blob" />
          <Compass size={48} className="not-found-compass" />
        </div>

        <div className="not-found-content">
          <span className="eyebrow"><Sparkles size={11} /> Oeps</span>
          <h1>Deze pagina is verdwaald</h1>
          <p>
            De link werkt niet meer of de pagina is verplaatst. Geen zorgen — gebruik onderstaande snelkoppelingen om weer op pad te komen.
          </p>

          <div className="not-found-actions">
            <Link href="/" className="button">
              <Home size={15} /> Naar home
            </Link>
            <Link href="/diensten" className="button secondary">
              Bekijk diensten <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="button secondary">
              Plan een gesprek
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
