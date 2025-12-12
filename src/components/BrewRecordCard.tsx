import { useState } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Clock,
  Coffee,
} from "lucide-react";
import { BrewRecord } from "../App";
import { FlavorRadarChart } from "./FlavorRadarChart";

interface BrewRecordCardProps {
  record: BrewRecord;
  onEdit?: () => void;
  onDelete: () => void;
}

export function BrewRecordCard({
  record,
  onEdit,
  onDelete,
}: BrewRecordCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 cursor-pointer hover:bg-amber-50 transition-colors"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-amber-900">
                  {record.dripper}
                </p>
                <p className="text-sm text-amber-600">
                  {formatDate(record.brewDate)}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-amber-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-600" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-600">水溫</p>
            </div>
            <p className="text-sm text-amber-900">
              {record.waterTemp}°C
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-600">時間</p>
            </div>
            <p className="text-sm text-amber-900">
              {record.brewTime}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-amber-600 mb-1">研磨</p>
            <p className="text-sm text-amber-900">
              {record.grindSetting}
            </p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-amber-100 pt-4">
          <div>
            <p className="text-sm text-amber-600 mb-2">
              磨豆機
            </p>
            <p className="text-amber-900">{record.grinder}</p>
          </div>

          <div>
            <p className="text-sm text-amber-600 mb-3">
              風味表現
            </p>
            <div className="bg-amber-50 rounded-lg p-4">
              <FlavorRadarChart
                flavorProfile={record.flavorProfile}
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    酸
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.sour}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    甜
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.sweet}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    苦
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.bitter}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    醇度
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.body}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    酸甜
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.citrus}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    蜜甜
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.honey}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    果乾
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.driedFruit}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    焦糖
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.caramel}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    堅果
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.nutty}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    炭香
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.roasted}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    香料
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.spice}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">
                    草本味
                  </span>
                  <span className="text-sm text-amber-900">
                    {record.flavorProfile.herbal}/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {record.notes && (
            <div>
              <p className="text-sm text-amber-600 mb-2">
                品飲筆記
              </p>
              <p className="text-amber-900 bg-amber-50 rounded-lg p-4">
                {record.notes}
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-lg transition-colors justify-center"
              >
                編輯記錄
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-1 flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors justify-center"
            >
              <Trash2 className="w-4 h-4" />
              刪除記錄
            </button>
          </div>


        </div>
      )}
    </div>
  );
}