import { useEffect, useRef, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import toast from 'react-hot-toast';

export const useFFmpeg = () => {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Charger FFmpeg
  const load = async () => {
    if (isLoaded || isLoading) return;

    try {
      setIsLoading(true);
      console.log('[FFmpeg] Chargement en cours...');
      
      const ffmpeg = new FFmpeg();
      
      // Écouter les messages de progression
      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
      });

      ffmpeg.on('progress', ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      // Charger FFmpeg core depuis CDN
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      ffmpegRef.current = ffmpeg;
      setIsLoaded(true);
      console.log('[FFmpeg] ✅ Chargé avec succès !');
      toast.success('Éditeur vidéo prêt !');
    } catch (error) {
      console.error('Erreur lors du chargement de FFmpeg:', error);
      toast.error('Erreur lors du chargement de l\'éditeur vidéo');
      setIsLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger automatiquement au montage
  useEffect(() => {
    load();
  }, []);

  // Découper une vidéo
  const trimVideo = async (
    inputFile: File,
    startTime: number,
    endTime: number
  ): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      // Écrire le fichier d'entrée
      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      // Exécuter la commande de découpage
      await ffmpeg.exec([
        '-i', inputName,
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-c', 'copy',
        outputName
      ]);

      // Lire le fichier de sortie
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });

      // Nettoyer
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors du découpage:', error);
      toast.error('Erreur lors du découpage de la vidéo');
      return null;
    }
  };

  // Appliquer tous les filtres en une seule passe
  const applyAllFilters = async (
    inputFile: File,
    brightness: number,
    contrast: number,
    saturation: number,
    rotation: number,
    playbackRate: number
  ): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      // Créer la chaîne de filtres combinée
      const filters: string[] = [];

      // Rotation (si nécessaire)
      if (rotation !== 0) {
        const rotationMap: Record<number, string> = {
          90: 'transpose=1',
          180: 'transpose=1,transpose=1',
          270: 'transpose=2'
        };
        if (rotationMap[rotation]) {
          filters.push(rotationMap[rotation]);
        }
      }

      // Correction colorimétrique combinée (brightness, contrast, saturation)
      const brightnessVal = brightness !== 100 ? `brightness=${(brightness - 100) / 100}` : '';
      const contrastVal = contrast !== 100 ? `contrast=${1 + (contrast - 100) / 100}` : '';
      const saturationVal = saturation !== 100 ? `saturation=${1 + (saturation - 100) / 100}` : '';
      
      const eqFilter = [brightnessVal, contrastVal, saturationVal].filter(Boolean).join(':');
      if (eqFilter) {
        filters.push(`eq=${eqFilter}`);
      }

      // Vitesse de lecture
      if (playbackRate !== 1) {
        const videoSpeed = playbackRate;
        const audioSpeed = playbackRate;
        filters.push(`setpts=${1 / videoSpeed}*PTS`);
        
        // Pour l'audio
        const audioFilter = playbackRate < 1 ? `atempo=${audioSpeed}` : audioSpeed > 2 ? `atempo=2.0,atempo=${audioSpeed / 2}` : `atempo=${audioSpeed}`;
        
        await ffmpeg.exec([
          '-i', inputName,
          '-filter_complex', `[0:v]${filters.join(',')}[v]`,
          '-filter:a', audioFilter,
          '-map', '[v]',
          '-map', '0:a?',
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-profile:v', 'high',
          '-level', '4.0',
          '-movflags', '+faststart',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-ar', '48000',
          '-ac', '2',
          outputName
        ]);
      } else {
        // Pas de changement de vitesse
        if (filters.length > 0) {
          await ffmpeg.exec([
            '-i', inputName,
            '-vf', filters.join(','),
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-profile:v', 'high',
            '-level', '4.0',
            '-movflags', '+faststart',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-ar', '48000',
            '-ac', '2',
            outputName
          ]);
        } else {
          // Pas de filtres, mais réencoder pour compatibilité
          await ffmpeg.exec([
            '-i', inputName,
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-profile:v', 'high',
            '-level', '4.0',
            '-movflags', '+faststart',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-ar', '48000',
            '-ac', '2',
            outputName
          ]);
        }
      }

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors de l\'application des filtres:', error);
      toast.error('Erreur lors de l\'application des filtres');
      return null;
    }
  };

  // Appliquer un filtre
  const applyFilter = async (
    inputFile: File,
    filterName: string,
    filterValue?: number
  ): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      let filterCommand = '';
      
      switch (filterName) {
        case 'brightness':
          filterCommand = `eq=brightness=${(filterValue || 0) / 100}`;
          break;
        case 'contrast':
          filterCommand = `eq=contrast=${1 + (filterValue || 0) / 100}`;
          break;
        case 'saturation':
          filterCommand = `eq=saturation=${1 + (filterValue || 0) / 100}`;
          break;
        case 'blur':
          filterCommand = 'boxblur=2:1';
          break;
        case 'sharpen':
          filterCommand = 'unsharp=5:5:1.0:5:5:0.0';
          break;
        case 'grayscale':
          filterCommand = 'hue=s=0';
          break;
        case 'sepia':
          filterCommand = 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131';
          break;
        default:
          filterCommand = 'null';
      }

      await ffmpeg.exec([
        '-i', inputName,
        '-vf', filterCommand,
        '-c:a', 'copy',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors de l\'application du filtre:', error);
      toast.error('Erreur lors de l\'application du filtre');
      return null;
    }
  };

  // Fusionner des vidéos
  const mergeVideos = async (files: File[]): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const { fetchFile } = await import('@ffmpeg/util');
      const outputName = 'output.mp4';

      // Écrire tous les fichiers
      const fileList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const inputName = `input${i}.mp4`;
        await ffmpeg.writeFile(inputName, await fetchFile(files[i]));
        fileList.push(inputName);
      }

      // Créer le fichier de liste
      const listContent = fileList.map(f => `file '${f}'`).join('\n');
      await ffmpeg.writeFile('list.txt', new TextEncoder().encode(listContent));

      // Fusionner
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'list.txt',
        '-c', 'copy',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });

      // Nettoyer
      for (const fileName of fileList) {
        await ffmpeg.deleteFile(fileName);
      }
      await ffmpeg.deleteFile('list.txt');
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors de la fusion:', error);
      toast.error('Erreur lors de la fusion des vidéos');
      return null;
    }
  };

  // Ajouter du texte
  const addTextOverlay = async (
    inputFile: File,
    text: string,
    x: number = 10,
    y: number = 10,
    fontSize: number = 24,
    color: string = 'white'
  ): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      // Échapper le texte pour FFmpeg
      const escapedText = text.replace(/'/g, "\\'").replace(/:/g, "\\:");

      await ffmpeg.exec([
        '-i', inputName,
        '-vf', `drawtext=text='${escapedText}':x=${x}:y=${y}:fontsize=${fontSize}:fontcolor=${color}`,
        '-c:a', 'copy',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de texte:', error);
      toast.error('Erreur lors de l\'ajout de texte');
      return null;
    }
  };

  // Changer la vitesse
  const changeSpeed = async (
    inputFile: File,
    speed: number
  ): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      const videoSpeed = 1 / speed;
      const audioSpeed = speed;

      await ffmpeg.exec([
        '-i', inputName,
        '-filter_complex', `[0:v]setpts=${videoSpeed}*PTS[v];[0:a]atempo=${audioSpeed}[a]`,
        '-map', '[v]',
        '-map', '[a]',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors du changement de vitesse:', error);
      toast.error('Erreur lors du changement de vitesse');
      return null;
    }
  };

  // Convertir le format
  const convertFormat = async (
    inputFile: File,
    outputFormat: 'mp4' | 'webm' | 'avi' | 'mov'
  ): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const { fetchFile } = await import('@ffmpeg/util');
      const inputName = 'input.mp4';
      const outputName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      await ffmpeg.exec([
        '-i', inputName,
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const mimeTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        avi: 'video/x-msvideo',
        mov: 'video/quicktime'
      };
      const blob = new Blob([data], { type: mimeTypes[outputFormat] });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
      toast.error('Erreur lors de la conversion du format');
      return null;
    }
  };

  // Extraire une frame (thumbnail)
  const extractFrame = async (
    inputFile: File,
    timeInSeconds: number
  ): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error('FFmpeg n\'est pas chargé');
      return null;
    }

    try {
      const ffmpeg = ffmpegRef.current;
      const { fetchFile } = await import('@ffmpeg/util');
      const inputName = 'input.mp4';
      const outputName = 'thumbnail.jpg';

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      await ffmpeg.exec([
        '-i', inputName,
        '-ss', timeInSeconds.toString(),
        '-vframes', '1',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'image/jpeg' });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return blob;
    } catch (error) {
      console.error('Erreur lors de l\'extraction de la frame:', error);
      toast.error('Erreur lors de l\'extraction de la frame');
      return null;
    }
  };

  return {
    isLoaded,
    isLoading,
    progress,
    load,
    trimVideo,
    applyFilter,
    applyAllFilters,
    mergeVideos,
    addTextOverlay,
    changeSpeed,
    convertFormat,
    extractFrame,
  };
};

