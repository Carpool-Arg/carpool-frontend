interface SeparatorProps {
  width?: string;
  height?: string;
  color?: string;
  marginY?: string;
}

export default function Separator({
  width = '100%',
  height = '1px',
  color = 'bg-gray-300',
  marginY = 'my-4',
}: SeparatorProps) {
  return <div className={`${color} ${marginY}`} style={{ width, height }} />;
}