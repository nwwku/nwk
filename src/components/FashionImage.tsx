export function FashionImage({ position = '50% 0%', className = '', src }: { position?: string; className?: string; src?: string }) {
  if (src) return <div className={`fashion-image single-image ${className}`}><img src={src} alt="Fashion inspiration" /></div>;
  const [horizontal, vertical] = position.split(' ');
  const column = horizontal === '0%' ? 'col-0' : horizontal === '100%' ? 'col-2' : 'col-1';
  const row = vertical === '100%' ? 'row-1' : 'row-0';
  return <div className={`fashion-image ${column} ${row} ${className}`}><img src="/assets/nera-fashion-grid.png" alt="Editorial fashion look" /></div>;
}
