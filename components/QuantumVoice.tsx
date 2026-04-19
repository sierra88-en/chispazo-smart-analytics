import React from 'react';
import { getQuantumAudio } from '../services/geminiService';

// 🎙️ QUANTUM-GOD-X: Módulo de Voz de Élite (Gemini TTS + Fallback)
export const useQuantumVoice = () => {
  const hablar = async (texto: string) => {
    // 1. Intentar Voz de Élite (Gemini TTS)
    try {
      const base64Audio = await getQuantumAudio(texto);
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        // Convertir base64 a ArrayBuffer
        const binaryString = window.atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Asumimos PCM 16-bit Mono 24kHz (estándar de Gemini TTS)
        const int16Data = new Int16Array(bytes.buffer);
        const float32Data = new Float32Array(int16Data.length);
        for (let i = 0; i < int16Data.length; i++) {
          float32Data[i] = int16Data[i] / 32768.0;
        }

        const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        source.start();
        return;
      }
    } catch (e) {
      console.error("Error en Voz de Élite (PCM Decode):", e);
    }

    // 2. Fallback a Voz de Sistema (Web Speech API)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const mensaje = new SpeechSynthesisUtterance(texto);
      mensaje.lang = 'es-MX';
      mensaje.pitch = 1.0;
      mensaje.rate = 0.95;
      const voces = window.speechSynthesis.getVoices();
      const vozMX = voces.find(v => v.lang === 'es-MX' || v.lang === 'es-ES');
      if (vozMX) mensaje.voice = vozMX;
      window.speechSynthesis.speak(mensaje);
    } else {
      console.warn("Sistemas de audio no disponibles en este entorno.");
    }
  };

  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'square'; // Sonido industrial
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // La5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.warn("Error playing beep:", e);
    }
  };

  return { hablar, playBeep };
};

// Componente visual para probar la voz
export const VoiceControl: React.FC = () => {
  const { hablar } = useQuantumVoice();

  return (
    <div className="p-3 bg-zinc-900/80 border border-emerald-500/30 rounded-xl mt-4 backdrop-blur-sm">
      <button 
        onClick={() => hablar("Sincronización completa. Quantum God X versión 5.0 listo para el sorteo de hoy 1 de marzo.")}
        className="bg-transparent text-emerald-500 cursor-pointer border-none font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors"
      >
        <span className="text-lg">🔊</span> PROBAR VOZ DEL SISTEMA
      </button>
    </div>
  );
};
