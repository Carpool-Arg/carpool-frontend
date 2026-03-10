import { Tab } from "@/components/ux/Tab";
import { HISTORY_TABS } from "@/constants/tabs/history";

interface RoleSelectorHeaderProps {
  role: string;
  title: string, 
  description: string,
  onChangeRole: (value: string) => void;
}

export default function RoleSelectorHeader({
  role,
  title,
  description,
  onChangeRole,
}: RoleSelectorHeaderProps) {
  return (
    <div className="mb-3">
      <h1 className="text-xl font-semibold mb-1">{title}</h1>
      <p className="font-inter text-sm">
        {description}
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
