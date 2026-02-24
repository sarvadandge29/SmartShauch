import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Color constants
const secondaryBlue = '#2563EB';
const darkBlue = '#0F172A';
const grayText = '#64748B';
const lightGray = '#F1F5F9';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (data: any) => void;
}

const QRScannerModal = ({ visible, onClose, onScan }: QRScannerModalProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      // Parse the QR data
      const toiletData = JSON.parse(data);
      
      // Validate if it's a toilet QR
      if (toiletData.type === 'toilet-qr' && toiletData.id) {
        onScan(toiletData);
        onClose();
      } else {
        Alert.alert('Invalid QR', 'This is not a valid toilet QR code');
        setScanned(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code format');
      setScanned(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-xl p-6 w-full">
            <Text className="text-lg font-semibold mb-4 text-center" style={{ color: darkBlue }}>
              Camera Permission Required
            </Text>
            <Text className="text-sm mb-6 text-center" style={{ color: grayText }}>
              We need camera access to scan QR codes
            </Text>
            <TouchableOpacity
              onPress={requestPermission}
              className="bg-secondary p-3 rounded-lg mb-3"
              style={{ backgroundColor: secondaryBlue }}
            >
              <Text className="text-white text-center font-semibold">
                Grant Permission
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="p-3 rounded-lg border"
              style={{ borderColor: lightGray }}
            >
              <Text className="text-center" style={{ color: grayText }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-black">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          style={{ flex: 1 }}
        >
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 pt-12 bg-black/50">
              <Text className="text-white text-lg font-semibold">Scan QR Code</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Scanner Frame */}
            <View className="flex-1 items-center justify-center">
              <View className="w-64 h-64 border-2 border-white rounded-2xl">
                <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary" />
                <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary" />
                <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary" />
                <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary" />
              </View>
              <Text className="text-white text-center mt-4">
                Position QR code within frame
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

export default QRScannerModal;