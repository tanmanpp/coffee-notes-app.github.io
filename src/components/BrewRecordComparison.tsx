import { useState, useMemo } from 'react';
import { ArrowLeft, Thermometer, Clock, Coffee } from 'lucide-react';
import { BrewRecord, CoffeeBean, FlavorProfile } from '../App';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface BrewRecordComparisonProps {
  brewRecords: BrewRecord[];
  coffeeBeans: CoffeeBean[];
  onBack: () => void;
}

export function BrewRecordComparison({ brewRecords, coffeeBeans, onBack }: BrewRecordComparisonProps) {
  // 左邊：豆子 + 紀錄
  const [leftBeanId, setLeftBeanId] = useState<string>('');
  const [leftRecordId, setLeftRecordId] = useState<string>('');

  // 右邊：豆子 + 紀錄
  const [rightBeanId, setRightBeanId] = useState<string>('');
  const [rightRecordId, setRightRecordId] = useState<string>('');

  // 各自可選的沖泡紀錄（只看該豆子底下的）
  const leftBeanRecords = useMemo(
    () => brewRecords.filter((r) => r.coffeeBeanId === leftBeanId),
    [brewRecords, leftBeanId]
  );

  const rightBeanRecords = useMemo(
    () => brewRecords.filter((r) => r.coffeeBeanId === rightBeanId),
    [brewRecords, rightBeanId]
  );

  // 真正被選中的兩筆紀錄
  const record1 = brewRecords.find((r) => r.id === leftRecordId);
  const record2 = brewRecords.find((r) => r.id === rightRecordId);

  // 對應到的咖啡豆（保留你原本的寫法）
  const bean1 = record1 ? coffeeBeans.find((b) => b.id === record1.coffeeBeanId) : undefined;
  const bean2 = record2 ? coffeeBeans.find((b) => b.id === record2.coffeeBeanId) : undefined;


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRoastDate = (dateString: string) => {
    if (!dateString) return '未填寫';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };



  const getComparisonData = () => {
    if (!record1 || !record2) return [];

    return [
      // 香氣指標
      { subject: '酸甜', record1: record1.flavorProfile.citrus, record2: record2.flavorProfile.citrus, fullMark: 5 },
      { subject: '蜜甜', record1: record1.flavorProfile.honey, record2: record2.flavorProfile.honey, fullMark: 5 },
      { subject: '果乾', record1: record1.flavorProfile.driedFruit, record2: record2.flavorProfile.driedFruit, fullMark: 5 },
      { subject: '焦糖', record1: record1.flavorProfile.caramel, record2: record2.flavorProfile.caramel, fullMark: 5 },
      { subject: '堅果', record1: record1.flavorProfile.nutty, record2: record2.flavorProfile.nutty, fullMark: 5 },
      { subject: '炭香', record1: record1.flavorProfile.roasted, record2: record2.flavorProfile.roasted, fullMark: 5 },
      { subject: '香料', record1: record1.flavorProfile.spice, record2: record2.flavorProfile.spice, fullMark: 5 },
      { subject: '草本味', record1: record1.flavorProfile.herbal, record2: record2.flavorProfile.herbal, fullMark: 5 },
      // 味覺指標
      { subject: '酸', record1: record1.flavorProfile.sour, record2: record2.flavorProfile.sour, fullMark: 5 },
      { subject: '甜', record1: record1.flavorProfile.sweet, record2: record2.flavorProfile.sweet, fullMark: 5 },
      { subject: '苦', record1: record1.flavorProfile.bitter, record2: record2.flavorProfile.bitter, fullMark: 5 },
      { subject: '醇度', record1: record1.flavorProfile.body, record2: record2.flavorProfile.body, fullMark: 5 },
    ];
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回主頁
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h1 className="text-amber-900 mb-6">沖泡記錄比較</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 左邊：樣本 A */}
          <div className="space-y-3">
            <h3 className="text-amber-900 font-semibold">樣本 A</h3>

            {/* 選豆子 */}
            <div>
              <label className="block text-sm text-amber-700 mb-2">選擇咖啡豆</label>
              <select
                value={leftBeanId}
                onChange={(e) => {
                  setLeftBeanId(e.target.value);
                  setLeftRecordId(''); // 換豆子時清掉原本的紀錄選擇
                }}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">請選擇咖啡豆</option>
                {coffeeBeans.map((bean) => (
                  <option key={bean.id} value={bean.id}>
                    {bean.origin} - {bean.farm} （烘焙：{formatRoastDate(bean.roastDate)}）
                  </option>
                ))}
              </select>
            </div>

            {/* 選該豆子的某一次沖泡紀錄 */}
            <div>
              <label className="block text-sm text-amber-700 mb-2">選擇沖泡記錄</label>
              <select
                value={leftRecordId}
                onChange={(e) => setLeftRecordId(e.target.value)}
                disabled={!leftBeanId || leftBeanRecords.length === 0}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">
                  {leftBeanId
                    ? leftBeanRecords.length > 0
                      ? '請選擇記錄'
                      : '此咖啡豆尚無沖泡記錄'
                    : '請先選擇咖啡豆'}
                </option>
                {leftBeanRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {formatDate(record.brewDate)} · {record.dripper} · {record.grindSetting}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 右邊：樣本 B */}
          <div className="space-y-3">
            <h3 className="text-amber-900 font-semibold">樣本 B</h3>

            {/* 選豆子 */}
            <div>
              <label className="block text-sm text-amber-700 mb-2">選擇咖啡豆</label>
              <select
                value={rightBeanId}
                onChange={(e) => {
                  setRightBeanId(e.target.value);
                  setRightRecordId('');
                }}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">請選擇咖啡豆</option>
                {coffeeBeans.map((bean) => (
                  <option key={bean.id} value={bean.id}>
                    {bean.origin} - {bean.farm} （烘焙：{formatRoastDate(bean.roastDate)}）
                  </option>
                ))}
              </select>
            </div>

            {/* 選該豆子的某一次沖泡紀錄 */}
            <div>
              <label className="block text-sm text-amber-700 mb-2">選擇沖泡記錄</label>
              <select
                value={rightRecordId}
                onChange={(e) => setRightRecordId(e.target.value)}
                disabled={!rightBeanId || rightBeanRecords.length === 0}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">
                  {rightBeanId
                    ? rightBeanRecords.length > 0
                      ? '請選擇記錄'
                      : '此咖啡豆尚無沖泡記錄'
                    : '請先選擇咖啡豆'}
                </option>
                {rightBeanRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {formatDate(record.brewDate)} · {record.dripper} · {record.grindSetting}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {record1 && record2 && (
          <div className="space-y-6">
            {/* Flavor Radar Chart Comparison */}
            <div className="bg-amber-50 rounded-lg p-6">
              <h2 className="text-amber-900 mb-4">風味表現比較</h2>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={getComparisonData()}>
                  <PolarGrid stroke="#f59e0b" strokeOpacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#92400e', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#92400e', fontSize: 10 }} />
                  <Radar
                    name={`${bean1?.origin} (${formatDate(record1.brewDate)})`}
                    dataKey="record1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name={`${bean2?.origin} (${formatDate(record2.brewDate)})`}
                    dataKey="record2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Record 1 */}
              <div className="bg-amber-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-amber-900">{bean1?.origin}</h3>
                    <p className="text-sm text-amber-600">{bean1?.farm}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-amber-600 mb-1">沖泡日期</p>
                    <p className="text-sm text-amber-900">{formatDate(record1.brewDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">濾杯</p>
                    <p className="text-sm text-amber-900">{record1.dripper}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">磨豆機</p>
                    <p className="text-sm text-amber-900">{record1.grinder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">研磨刻度</p>
                    <p className="text-sm text-amber-900">{record1.grindSetting}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <p className="text-sm text-amber-900">{record1.waterTemp}°C</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <p className="text-sm text-amber-900">{record1.brewTime}</p>
                  </div>
                  {record1.notes && (
                    <div>
                      <p className="text-xs text-amber-600 mb-1">品飲筆記</p>
                      <p className="text-sm text-amber-900">{record1.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Record 2 */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-900">{bean2?.origin}</h3>
                    <p className="text-sm text-blue-600">{bean2?.farm}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-blue-600 mb-1">沖泡日期</p>
                    <p className="text-sm text-blue-900">{formatDate(record2.brewDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 mb-1">濾杯</p>
                    <p className="text-sm text-blue-900">{record2.dripper}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 mb-1">磨豆機</p>
                    <p className="text-sm text-blue-900">{record2.grinder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 mb-1">研磨刻度</p>
                    <p className="text-sm text-blue-900">{record2.grindSetting}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900">{record2.waterTemp}°C</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900">{record2.brewTime}</p>
                  </div>
                  {record2.notes && (
                    <div>
                      <p className="text-xs text-blue-600 mb-1">品飲筆記</p>
                      <p className="text-sm text-blue-900">{record2.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Difference Analysis */}
            <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg p-6">
              <h2 className="text-gray-900 mb-4">差異分析</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">水溫差異</p>
                  <p className="text-gray-900">
                    {Math.abs(record1.waterTemp - record2.waterTemp) === 0
                      ? '相同'
                      : `相差 ${Math.abs(record1.waterTemp - record2.waterTemp)}°C`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">濾杯</p>
                  <p className="text-gray-900">
                    {record1.dripper === record2.dripper ? '相同' : '不同'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">磨豆機</p>
                  <p className="text-gray-900">
                    {record1.grinder === record2.grinder ? '相同' : '不同'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">咖啡豆</p>
                  <p className="text-gray-900">
                    {record1.coffeeBeanId === record2.coffeeBeanId ? '相同豆子' : '不同豆子'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {(!record1 || !record2) && (
          <div className="text-center py-12 text-amber-600">
            請選擇兩筆記錄進行比較
          </div>
        )}
      </div>
    </div>
  );
}