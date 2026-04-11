
interface HeaderPageProps {
  title: string;
  desc: string;
}

export default function HeaderPage({title, desc}: HeaderPageProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-medium text-gray-1">{title}</h1>
      <p className="text-sm text-gray-9">
        {desc}
      </p>
    </div>

  );
}