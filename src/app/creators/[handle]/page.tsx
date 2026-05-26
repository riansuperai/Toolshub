import { sellers } from "@/lib/marketplace-data";
import { CreatorPublicProfile } from "./creator-profile-client";

export function generateStaticParams() {
  return sellers.map((seller) => ({
    handle: seller.handle
  }));
}

export default function CreatorProfilePage() {
  return <CreatorPublicProfile />;
}
