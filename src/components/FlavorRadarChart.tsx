import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { FlavorProfile } from '../App';

interface FlavorRadarChartProps {
  flavorProfile: FlavorProfile;
}

export function FlavorRadarChart({ flavorProfile }: FlavorRadarChartProps) {
  // 按照圓形順序排列，從頂部順時針方向
  const data = [
    // 香氣指標 (上半圈，從頂部順時針)
    { subject: '草本味', value: flavorProfile.herbal, fullMark: 5, category: 'aroma' },
    { subject: '酸甜', value: flavorProfile.citrus, fullMark: 5, category: 'aroma' },
    { subject: '蜜甜', value: flavorProfile.honey, fullMark: 5, category: 'aroma' },
    { subject: '堅果', value: flavorProfile.nutty, fullMark: 5, category: 'aroma' },
    { subject: '焦糖', value: flavorProfile.caramel, fullMark: 5, category: 'aroma' },
    { subject: '果乾', value: flavorProfile.driedFruit, fullMark: 5, category: 'aroma' },
    { subject: '香料', value: flavorProfile.spice, fullMark: 5, category: 'aroma' },
    { subject: '炭香', value: flavorProfile.roasted, fullMark: 5, category: 'aroma' },
    
    // 味覺指標 (下半圈)
    { subject: '酸', value: flavorProfile.sour, fullMark: 5, category: 'taste' },
    { subject: '甜', value: flavorProfile.sweet, fullMark: 5, category: 'taste' },
    { subject: '苦', value: flavorProfile.bitter, fullMark: 5, category: 'taste' },
    { subject: '醇度', value: flavorProfile.body, fullMark: 5, category: 'taste' },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke="#d1d5db" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#92400e', fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fill: '#92400e', fontSize: 9 }}
          tickCount={6}
        />
        <Radar
          name="風味"
          dataKey="value"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}