"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PageProgressInner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // Bij elke navigatie: kort flits-loadertje
    setVisible(true);
    setPct(20);
    const tick1 = setTimeout(() => setPct(65), 120);
    const tick2 = setTimeout(() => setPct(92), 280);
    const finish = setTimeout(() => {
      setPct(100);
      setTimeout(() => {
        setVisible(false);
        setPct(0);
      }, 220);
    }, 480);

    return () => {
      clearTimeout(tick1);
      clearTimeout(tick2);
      clearTimeout(finish);
    };
  }, [pathname, params]);

  if (!visible) return null;

  return (
    <div className="page-progress" role="progressbar" aria-busy="true" aria-valuenow={pct}>
      <div className="page-progress-bar" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageProgress() {
  return (
    <Suspense fallback={null}>
      <PageProgressInner />
    </Suspense>
  );
}
