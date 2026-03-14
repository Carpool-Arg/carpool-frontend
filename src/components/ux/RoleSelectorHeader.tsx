import { Tab } from "@/components/ux/Tab";
import { HISTORY_TABS } from "@/constants/tabs/history";
import { useAuth } from "@/contexts/authContext";

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
  const { user} = useAuth();
  const userRoles = user?.roles || ['user'];
  const tabs = HISTORY_TABS.map(tab =>
    tab.value === "driver"
      ? { ...tab, disabled:  !userRoles?.includes('driver')}
      : tab
  );
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
          tabs={tabs}
        />
      </div>
    </div>
  );
}
