import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function BarChartCard({ title, icon: Icon, data }: any) {
  return (
    <Card className='bg-gray-8 border-gray-2/50 rounded-2xl shadow-lg'>
      <CardContent className='p-5'>
        <div className='flex items-center gap-2 mb-4 text-gray-11'>
          <Icon size={18} />
          <h3 className='font-medium'>{title}</h3>
        </div>
        <div className='h-72 bg-gray'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data}  margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="15%">
              <XAxis dataKey='month' stroke='#71717a' tickLine={false} axisLine={false} />
              <YAxis stroke='#71717a' tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey='value' radius={[8, 8, 0, 0]} fill='#c9c9c9' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}