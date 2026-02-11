import { Tab } from "@/components/ux/Tab";
import { HISTORY_TABS } from "@/constants/tabs/history";

interface TripHistoryHeaderProps {
  role: string;
  onChangeRole: (value: string) => void;
}

export default function TripHistoryHeader({
  role,
  onChangeRole,
}: TripHistoryHeaderProps) {
  return (
    <div className="mb-3">
      <h1 className="text-xl font-semibold mb-1">Historial de viajes</h1>
      <p className="font-inter text-sm">
        Acá podés ver tus viajes realizados y los que están por comenzar.
      </p>

      <div className="mt-3">
        <Tab
          value={role}
          onChange={onChangeRole}
          tabs={HISTORY_TABS}
        />
      </div>
    </div>
  );
}
