import { useState, useMemo } from "react";
import { ArrowLeft, Droplet } from "lucide-react";
import { BrewRecord, FlavorProfile } from "../App";
import { FlavorRadarChart } from "./FlavorRadarChart";

interface BrewRecordFormProps {
  brewRecords: BrewRecord[];
  initialData?: BrewRecord;
  onSubmit: (
    record: Omit<
      BrewRecord,
      "id" | "coffeeBeanId" | "brewDate"
    >,
  ) => void;
  onCancel: () => void;
}

export function BrewRecordForm({
  brewRecords,
  initialData,
  onSubmit,
  onCancel,
}: BrewRecordFormProps) {
  const [dripper, setDripper] = useState(initialData?.dripper ?? "");
  const [grinder, setGrinder] = useState(initialData?.grinder ?? "");
  const [grindSetting, setGrindSetting] = useState(initialData?.grindSetting ?? "");
  const [waterTemp, setWaterTemp] = useState(initialData?.waterTemp ?? 92);
  const [brewTime, setBrewTime] = useState(initialData?.brewTime ?? "02:30");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [flavorProfile, setFlavorProfile] =
    useState<FlavorProfile>(initialData?.flavorProfile ??{
      // 味覺指標
      sour: 3,
      sweet: 3,
      bitter: 3,
      body: 3,
      // 香氣指標
      herbal: 3,
      citrus: 3,
      honey: 3,
      nutty: 3,
      caramel: 3,
      driedFruit: 3,
      spice: 3,
      roasted: 3,
    });

  // Get unique values from previous records
  const previousDrippers = useMemo(() => {
    const unique = [
      ...new Set(brewRecords.map((r) => r.dripper)),
    ];
    return unique.filter(Boolean);
  }, [brewRecords]);

  const previousGrinders = useMemo(() => {
    const unique = [
      ...new Set(brewRecords.map((r) => r.grinder)),
    ];
    return unique.filter(Boolean);
  }, [brewRecords]);

  const previousGrindSettings = useMemo(() => {
    const unique = [
      ...new Set(brewRecords.map((r) => r.grindSetting)),
    ];
    return unique.filter(Boolean);
  }, [brewRecords]);

  const previousWaterTemps = useMemo(() => {
    const unique = [
      ...new Set(brewRecords.map((r) => r.waterTemp)),
    ];
    return unique.filter(Boolean).sort((a, b) => b - a);
  }, [brewRecords]);

  const previousBrewTimes = useMemo(() => {
    const unique = [
      ...new Set(brewRecords.map((r) => r.brewTime)),
    ];
    return unique.filter(Boolean);
  }, [brewRecords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      dripper,
      grinder,
      grindSetting,
      waterTemp,
      brewTime,
      flavorProfile,
      notes,
    });
  };

  const handleFlavorChange = (
    key: keyof FlavorProfile,
    value: number,
  ) => {
    setFlavorProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-amber-700" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-amber-900">新增沖泡記錄</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-amber-700 mb-2">
              濾杯款式 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="dripper-list"
              value={dripper}
              onChange={(e) => setDripper(e.target.value)}
              placeholder="例如：Hario V60、Kalita Wave"
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {previousDrippers.length > 0 && (
              <datalist id="dripper-list">
                {previousDrippers.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            )}
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">
              磨豆機型號 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="grinder-list"
              value={grinder}
              onChange={(e) => setGrinder(e.target.value)}
              placeholder="例如：Comandante、1Zpresso"
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {previousGrinders.length > 0 && (
              <datalist id="grinder-list">
                {previousGrinders.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-amber-700 mb-2">
              研磨刻度 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="grind-setting-list"
              value={grindSetting}
              onChange={(e) => setGrindSetting(e.target.value)}
              placeholder="例如：20 clicks、中粗研磨"
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {previousGrindSettings.length > 0 && (
              <datalist id="grind-setting-list">
                {previousGrindSettings.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            )}
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">
              水溫 (°C) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              list="water-temp-list"
              value={waterTemp}
              onChange={(e) =>
                setWaterTemp(Number(e.target.value))
              }
              min="80"
              max="100"
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {previousWaterTemps.length > 0 && (
              <datalist id="water-temp-list">
                {previousWaterTemps.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-2">
            沖泡時間 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="brew-time-list"
            value={brewTime}
            onChange={(e) => setBrewTime(e.target.value)}
            placeholder="例如：2:30、3分鐘"
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {previousBrewTimes.length > 0 && (
            <datalist id="brew-time-list">
              {previousBrewTimes.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          )}
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-4">
            風味表現
          </label>
          <div className="bg-amber-50 rounded-lg p-6">
            <FlavorRadarChart flavorProfile={flavorProfile} />

            <div className="space-y-4 mt-6">
              {Object.entries(flavorProfile).map(
                ([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-amber-700 capitalize">
                        {key === "sour" && "酸"}
                        {key === "sweet" && "甜"}
                        {key === "bitter" && "苦"}
                        {key === "body" && "醇度"}
                        {key === "herbal" && "草本味"}
                        {key === "citrus" && "酸甜"}
                        {key === "honey" && "蜜甜"}
                        {key === "nutty" && "堅果"}
                        {key === "caramel" && "焦糖"}
                        {key === "driedFruit" && "果乾"}
                        {key === "spice" && "香料"}
                        {key === "roasted" && "炭香"}
                      </label>
                      <span className="text-sm text-amber-600">
                        {value}/5
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={value}
                      onChange={(e) =>
                        handleFlavorChange(
                          key as keyof FlavorProfile,
                          Number(e.target.value),
                        )
                      }
                      className="w-full accent-amber-600"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-2">
            品飲筆記
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="記錄您的品飲感受、風味描述等..."
            rows={4}
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
          >
            儲存記錄
          </button>
        </div>
      </form>
    </div>
  );
}