type IconName = 'home' | 'hanger' | 'plus' | 'compass' | 'bag' | 'user' | 'scan' | 'search' | 'arrow' | 'heart' | 'sparkle' | 'upload' | 'close';

const paths: Record<IconName, string> = {
  home: 'M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z',
  hanger: 'M9 6a3 3 0 1 1 4 2.83V11l8 6H3l9-6',
  plus: 'M12 5v14M5 12h14',
  compass: 'm16 8-3 5-5 3 3-5zM12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20',
  bag: 'M5 8h14l-1 13H6zM9 9V6a3 3 0 0 1 6 0v3',
  user: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10',
  scan: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M8 12h8',
  search: 'm21 21-4.4-4.4M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'm9 18 6-6-6-6',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8z',
  sparkle: 'm12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z',
  upload: 'M12 16V4m0 0L7 9m5-5 5 5M4 17v4h16v-4',
  close: 'M6 6l12 12M18 6 6 18',
};

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
