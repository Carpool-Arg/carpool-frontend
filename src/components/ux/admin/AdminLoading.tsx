interface HeaderPageProps {
  title: string;
  desc: string;
}

export default function HeaderPage({title, desc}: HeaderPageProps) {
  return (
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium text-white/80">{title}</h1>
        <p className="text-sm text-white/30">
          {desc}
        </p>
      </div>
  );
}