import { useEffect, useState, useRef } from 'react';
import { PageTransition } from '../components/PageTransition';
import { HeartRateChart } from '../components/HeartRateChart';
import { HeartRateStatus } from '../components/HeartRateStatus';
import { AudioSynthesizer } from '../components/AudioSynthesizer';
import { socket } from '../utils/socket';
import { MedicalInfo } from '../types/medical';

interface DoctorNote {
  id: string;
  type: 'article' | 'medication';
  title: string;
  content: string;
  timestamp: Date;
  doctorId: string;
  doctorName: string;
}

export default function HeartRate() {
  const [heartRate, setHeartRate] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [heartRateHistory, setHeartRateHistory] = useState<Array<{time: Date, value: number}>>([]);
  const sensorRef = useRef<HeartRateSensor | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState<DoctorNote[]>([]);
  const [toastMessage, setToastMessage] = useState<{show: boolean, message: string, type: 'info' | 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'info'
  });
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo[]>([]);

  // Listen for doctor notes
  useEffect(() => {
    socket.on('doctor:note', (note: DoctorNote) => {
      setDoctorNotes(prev => [note, ...prev]);
      showToast(`New ${note.type} from Dr. ${note.doctorName}`, 'info');
    });

    return () => {
      socket.off('doctor:note');
    };
  }, []);

  // Listen for medical information
  useEffect(() => {
    socket.on('doctor:medical-info', (info: MedicalInfo[]) => {
      console.log('Received medical info:', info);
      
      // Simply add the new info to our existing array
      setMedicalInfo(prev => [...prev, ...info]);
      
      // Show toast for the first item
      const firstInfo = info[0];
      const toastType = firstInfo.severity === 'high' ? 'error' : 
                       firstInfo.severity === 'medium' ? 'warning' : 'info';
      
      showToast(
        `New ${firstInfo.type} from Dr. ${firstInfo.doctorName}: ${firstInfo.title}`, 
        toastType as 'info' | 'success' | 'error'
      );
    });

    return () => {
      socket.off('doctor:medical-info');
    };
  }, []);

  // Show toast message helper
  const showToast = (message: string, type: 'info' | 'success' | 'error') => {
    setToastMessage({ show: true, message, type });
    setTimeout(() => setToastMessage(prev => ({ ...prev, show: false })), 3000);
  };

  // Connect to heart rate sensor
  const connectToDevice = async () => {
    setIsConnecting(true);
    showToast('Looking for heart rate devices...', 'info');
    
    try {
      // Create new sensor instance if not exists
      if (!sensorRef.current) {
        sensorRef.current = new HeartRateSensor();
      }

      await sensorRef.current.connect();
      showToast('Device connected successfully!', 'success');
      setIsConnected(true);

      // Start listening for heart rate updates
      const characteristic = await sensorRef.current.startNotificationsHeartRateMeasurement();
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const { heartRate } = sensorRef.current!.parseHeartRate(event.target.value);
        setHeartRate(heartRate);
        setHeartRateHistory(prev => [...prev, { time: new Date(), value: heartRate }]);
      });
    } catch (error: any) {
      console.error('Error connecting to heart rate sensor:', error);
      showToast(
        error.message === 'Bluetooth adapter not available.' 
          ? 'Bluetooth is not available. Please enable Bluetooth and try again.'
          : 'Failed to connect to device. Please try again.',
        'error'
      );
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    try {
      if (sensorRef.current) {
        await sensorRef.current.stopNotificationsHeartRateMeasurement();
        sensorRef.current = null;
      }
      setIsConnected(false);
      showToast('Device disconnected successfully', 'success');
    } catch (error) {
      console.error('Error disconnecting:', error);
      showToast('Failed to disconnect device', 'error');
    }
  };

  // Update the right column to show more detailed information
  const renderMedicalInfo = (info: MedicalInfo) => (
    <div key={info.id} className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-2">
          <span className={`badge ${
            info.type === 'article' ? 'badge-info' : 
            info.type === 'medication' ? 'badge-warning' :
            info.type === 'warning' ? 'badge-error' :
            'badge-success'
          }`}>
            {info.type}
          </span>
          {info.severity && (
            <span className={`badge ${
              info.severity === 'high' ? 'badge-error' : 
              info.severity === 'medium' ? 'badge-warning' : 
              'badge-info'
            }`}>
              {info.severity} priority
            </span>
          )}
          <h3 className="card-title">{info.title}</h3>
        </div>

        <p className="whitespace-pre-wrap">{info.content}</p>

        {/* Metadata Section */}
        {info.metadata && (
          <div className="mt-4 space-y-2">
            {info.type === 'medication' && (
              <>
                {info.metadata.dosage && (
                  <div className="text-sm">
                    <span className="font-semibold">Dosage:</span> {info.metadata.dosage}
                  </div>
                )}
                {info.metadata.frequency && (
                  <div className="text-sm">
                    <span className="font-semibold">Frequency:</span> {info.metadata.frequency}
                  </div>
                )}
                {info.metadata.duration && (
                  <div className="text-sm">
                    <span className="font-semibold">Duration:</span> {info.metadata.duration}
                  </div>
                )}
                {info.metadata.sideEffects && (
                  <div className="text-sm">
                    <span className="font-semibold">Side Effects:</span>
                    <ul className="list-disc list-inside ml-4">
                      {info.metadata.sideEffects.map((effect, i) => (
                        <li key={i}>{effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            {info.type === 'article' && info.metadata.articleUrl && (
              <div className="text-sm">
                <a 
                  href={info.metadata.articleUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  Read Full Article
                </a>
                {info.metadata.articleSource && (
                  <span className="ml-2 opacity-70">
                    from {info.metadata.articleSource}
                  </span>
                )}
              </div>
            )}
            {info.metadata.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {info.metadata.tags.map(tag => (
                  <span key={tag} className="badge badge-ghost">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-sm opacity-70 mt-4">
          From Dr. {info.doctorName} • {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        {/* Toast Message */}
        {toastMessage.show && (
          <div className={`toast toast-top toast-end`}>
            <div className={`alert ${
              toastMessage.type === 'success' ? 'alert-success' : 
              toastMessage.type === 'error' ? 'alert-error' : 
              'alert-info'
            }`}>
              <span>{toastMessage.message}</span>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8">Heart Rate Monitor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Heart Rate Monitor */}
          <div className="space-y-8">
            {/* Status and Connect Button */}
            <div className="flex items-center gap-4">
              <HeartRateStatus 
                heartRate={heartRate} 
                isConnected={isConnected} 
              />
              <button 
                className={`btn ${isConnected ? 'btn-error' : 'btn-primary'} ${isConnecting ? 'loading' : ''}`}
                onClick={isConnected ? disconnectDevice : connectToDevice}
                disabled={isConnecting}
              >
                {isConnecting 
                  ? "Connecting..." 
                  : isConnected 
                    ? "Disconnect" 
                    : "Connect to Device"}
              </button>
            </div>

            {/* Connection Instructions */}
            {!isConnected && !isConnecting && (
              <div className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Connection Instructions</h3>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Make sure your heart rate device is turned on</li>
                    <li>Enable Bluetooth on your device</li>
                    <li>Click the "Connect to Device" button above</li>
                    <li>Select your heart rate monitor from the list</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Heart Rate Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Heart Rate History</h2>
                <HeartRateChart data={heartRateHistory} />
              </div>
            </div>

            {/* Audio Synthesizer */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Audio Feedback</h2>
                <AudioSynthesizer heartRate={heartRate} isEnabled={isConnected} />
              </div>
            </div>
          </div>

          {/* Right Column - Medical Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Medical Information & Resources</h2>
            {medicalInfo.length === 0 ? (
              <div className="alert alert-info">
                <span>No medical information available yet.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {medicalInfo.map(renderMedicalInfo)}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// HeartRateSensor class implementation
class HeartRateSensor {
  device: any;
  server: any;
  _characteristics: Map<string, any>;

  constructor() {
    this.device = null;
    this.server = null;
    this._characteristics = new Map();
  }

  async connect() {
    // @ts-ignore - bluetooth enabled
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }]
    });
    
    this.server = await this.device.gatt.connect();
    const service = await this.server.getPrimaryService('heart_rate');
    await this._cacheCharacteristic(service, 'heart_rate_measurement');
  }

  async startNotificationsHeartRateMeasurement() {
    return this._startNotifications('heart_rate_measurement');
  }

  async stopNotificationsHeartRateMeasurement() {
    return this._stopNotifications('heart_rate_measurement');
  }

  parseHeartRate(value: DataView) {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let result: any = {};
    let index = 1;

    if (rate16Bits) {
      result.heartRate = value.getUint16(index, true);
      index += 2;
    } else {
      result.heartRate = value.getUint8(index);
      index += 1;
    }

    return result;
  }

  private async _cacheCharacteristic(service: any, characteristicUuid: string) {
    const characteristic = await service.getCharacteristic(characteristicUuid);
    this._characteristics.set(characteristicUuid, characteristic);
  }

  private async _startNotifications(characteristicUuid: string) {
    const characteristic = this._characteristics.get(characteristicUuid);
    await characteristic.startNotifications();
    return characteristic;
  }

  private async _stopNotifications(characteristicUuid: string) {
    const characteristic = this._characteristics.get(characteristicUuid);
    await characteristic.stopNotifications();
    return characteristic;
  }
}
