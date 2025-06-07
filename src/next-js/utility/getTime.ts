export async function getTime(oldDate: Date): Promise<string> {
    const seconds = (Date.now() - new Date(oldDate).getTime()) / 1000;
    
    if (seconds <= 60) return `${Math.trunc(seconds)}s`;
    if (seconds > 60 && seconds <= 3600) return `${Math.trunc(seconds / 60)}m`; 
    if (seconds > 3600 && seconds <= 86400) return `${Math.trunc(seconds / 3600)}h`; 
    if (seconds > 86400 && seconds <= 2592000) return `${Math.trunc(seconds / 86400)}d`;
    if (seconds > 2592000 && seconds <= 31536000) return `${Math.trunc(seconds / 2592000)}mo`; 
    if (seconds > 31536000) return `${Math.trunc(seconds / 31536000)}y`; 
    
    return "0s";
}