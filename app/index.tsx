// app/index.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RNMediapipe, switchCamera } from '@thinksys/react-native-mediapipe';
import { PoseLandmark } from '@/types/PoseDetection';

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [pushUps, setPushUps] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [landmarks, setLandmarks] = useState<PoseLandmark[] | null>(null);

  const handleLandmark = useCallback((data: PoseLandmark[] | null) => {
    setLandmarks(data);
    if (!data || data.length < 33) return;

    // Extract keypoints: right_shoulder=12, right_elbow=14, right_wrist=16 (indices from MediaPipe)
    const shoulder = data[12]; // {x, y, z, visibility}
    const elbow = data[14];
    const wrist = data[16];

    if (shoulder?.visibility && shoulder.visibility > 0.5 && elbow?.visibility && elbow.visibility > 0.5 && wrist?.visibility && wrist.visibility > 0.5) {
      // Calculate vectors from elbow to shoulder and elbow to wrist
      const upperArmVec = {
        x: shoulder.x - elbow.x,
        y: shoulder.y - elbow.y,
      };
      const lowerArmVec = {
        x: wrist.x - elbow.x,
        y: wrist.y - elbow.y,
      };

      // Calculate the angle at the elbow using dot product and magnitudes
      const dotProduct = upperArmVec.x * lowerArmVec.x + upperArmVec.y * lowerArmVec.y;
      const upperArmMag = Math.sqrt(upperArmVec.x * upperArmVec.x + upperArmVec.y * upperArmVec.y);
      const lowerArmMag = Math.sqrt(lowerArmVec.x * lowerArmVec.x + lowerArmVec.y * lowerArmVec.y);
      
      // Avoid division by zero
      if (upperArmMag > 0 && lowerArmMag > 0) {
        const cosAngle = dotProduct / (upperArmMag * lowerArmMag);
        // Clamp to [-1, 1] to avoid NaN from Math.acos
        const clampedCos = Math.max(-1, Math.min(1, cosAngle));
        const angleRad = Math.acos(clampedCos);
        const angleDeg = angleRad * (180 / Math.PI);

        // Push-up logic:
        // - Down position: elbow angle < 90° (arm is bent)
        // - Up position: elbow angle > 150° (arm is extended)
        if (angleDeg < 90 && !isDown) {
          setIsDown(true);
        } else if (angleDeg > 150 && isDown) {
          setPushUps((prev) => prev + 1);
          setIsDown(false);
        }
      }
    }
  }, [isDown]);

  const toggleCamera = () => {
    if (!showCamera) {
      Alert.alert('Ready?', 'Position side-on and start push-ups!');
    } else {
      // Reset counter when stopping
      setPushUps(0);
      setIsDown(false);
      setLandmarks(null);
    }
    setShowCamera(!showCamera);
  };

  const flipCamera = () => switchCamera();

  return (
    <View style={styles.container}>
      {!showCamera ? (
        <>
          <Text style={styles.title}>Push-Up Counter</Text>
          <Text style={styles.subtitle}>Tap to start AI tracking</Text>
          <TouchableOpacity style={styles.startBtn} onPress={toggleCamera}>
            <Text style={styles.startBtnText}>Start Workout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.countText}>Push-Ups: {pushUps}</Text>
            <TouchableOpacity style={styles.flipBtn} onPress={flipCamera}>
              <Text style={styles.flipBtnText}>Flip</Text>
            </TouchableOpacity>
          </View>
          <RNMediapipe
            width={350}
            height={500}
            onLandmark={handleLandmark}
            face={false}
            leftArm={true}
            rightArm={true}
            torso={true}
            style={styles.camera}
          />
          <TouchableOpacity style={styles.stopBtn} onPress={toggleCamera}>
            <Text style={styles.stopBtnText}>Stop & Reset</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 40 },
  startBtn: { backgroundColor: '#007AFF', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 10 },
  startBtnText: { color: 'white', fontSize: 18, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20, alignItems: 'center' },
  countText: { fontSize: 28, fontWeight: 'bold', color: '#FF3B30' },
  camera: { borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  flipBtn: { backgroundColor: '#34C759', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  flipBtnText: { color: 'white', fontWeight: '600' },
  stopBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 10 },
  stopBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
