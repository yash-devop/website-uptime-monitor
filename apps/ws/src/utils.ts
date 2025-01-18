export const calculateDuration = (timestamp: string): string => {
    const durationInSeconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  };