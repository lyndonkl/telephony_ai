import { Badge } from "@/components/ui/badge";

interface HeartRateStatusProps {
  heartRate: number;
  isConnected: boolean;
}

export const HeartRateStatus: React.FC<HeartRateStatusProps> = ({ heartRate, isConnected }) => {
  const getStatusClass = () => {
    if (!isConnected) return 'badge-error';
    if (heartRate < 60) return 'badge-warning';
    if (heartRate > 100) return 'badge-error';
    return 'badge-success';
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`badge ${getStatusClass()}`}>
        {isConnected ? `${heartRate} BPM` : 'Not Connected'}
      </div>
      <span className="text-sm opacity-70">
        {isConnected ? 'Device Connected' : 'Please connect a device'}
      </span>
    </div>
  );
}; 