"use client";

import { useMemo } from "react";
import { Award } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { computeAchievements } from "@/lib/achievements";

export function AchievementsWidget() {
  const { state, activeUser } = useMarketplace();
  const sellerId = activeUser.sellerId;
  const achievements = useMemo(() => sellerId ? computeAchievements(state, sellerId) : [], [state, sellerId]);

  if (!sellerId) return null;
  if (achievements.length === 0) {
    return (
      <div className="widget" style={{ marginTop: 18, padding: 22, animationDelay: "0.68s" }}>
        <div className="widget-head">
          <div>
            <span className="eyebrow"><Award size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Achievements</span>
            <h3>Verdien je eerste badges</h3>
          </div>
        </div>
        <p style={{ color: "var(--green-500)", fontSize: 13, margin: "8px 0 0" }}>
          Krijg je eerste verkoop binnen, ontvang reviews en bouw een community om badges te ontgrendelen.
        </p>
      </div>
    );
  }

  return (
    <div className="widget" style={{ marginTop: 18, padding: 22, animationDelay: "0.68s" }}>
      <div className="widget-head">
        <div>
          <span className="eyebrow"><Award size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Achievements</span>
          <h3>{achievements.length} badges verdiend</h3>
        </div>
      </div>
      <div className="achievement-grid">
        {achievements.map((a) => {
          const Icon = a.icon;
          return (
            <div className={`achievement-badge tier-${a.tier}`} key={a.id} title={a.description}>
              <span className="achievement-icon"><Icon size={20} /></span>
              <strong>{a.label}</strong>
              <small>{a.description}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
