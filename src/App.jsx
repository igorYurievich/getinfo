import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const App = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({});
  const [geolocation, setGeolocation] = useState({});
  const [localIp, setLocalIp] = useState('');
  const [visitorId, setVisitorId] = useState('');

  // Получение IP-адреса
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip));
  }, []);

  // Получение информации об устройстве
  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
    };
    setDeviceInfo(info);
  }, []);

  // Получение геолокации
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setGeolocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  // Получение локального IP с использованием WebRTC
  useEffect(() => {
    const peerConnection = new RTCPeerConnection();
    peerConnection.createDataChannel('');
    peerConnection.createOffer().then(offer => peerConnection.setLocalDescription(offer));
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.candidate;
        const ip = candidate.match(/(\d{1,3}\.){3}\d{1,3}/)[0];
        setLocalIp(ip);
      }
    };
  }, []);

  // Получение уникального идентификатора пользователя с FingerprintJS
  useEffect(() => {
    FingerprintJS.load().then(fp => {
      fp.get().then(result => {
        setVisitorId(result.visitorId);
      });
    });
  }, []);

  return (
    <div>
      <h1>Информация о пользователе</h1>
      <p><strong>IP-адрес:</strong> {ipAddress}</p>
      <p><strong>Информация об устройстве:</strong></p>
      <ul>
        <li><strong>User Agent:</strong> {deviceInfo.userAgent}</li>
        <li><strong>Платформа:</strong> {deviceInfo.platform}</li>
        <li><strong>Язык:</strong> {deviceInfo.language}</li>
        <li><strong>Разрешение экрана:</strong> {deviceInfo.screenWidth}x{deviceInfo.screenHeight}</li>
        <li><strong>Глубина цвета:</strong> {deviceInfo.colorDepth}</li>
      </ul>
      <p><strong>Геолокация:</strong> {geolocation.latitude}, {geolocation.longitude}</p>
      <p><strong>Локальный IP-адрес:</strong> {localIp}</p>
      <p><strong>Уникальный ID пользователя (FingerprintJS):</strong> {visitorId}</p>
    </div>
  );
};

export default App;