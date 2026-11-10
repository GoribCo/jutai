import { accuracy, verdict, type Stats } from './engine';

const W = 1080;
const H = 1350;

export function shareText(s: Stats) {
  return `I landed ${s.hits} jutais out of ${s.spits} spits and scored ${s.score} in Jutai! ${verdict(s).title} 👡`;
}

/** Draws the share card to a canvas and returns it as a PNG. */
export function renderCard(s: Stats): Promise<Blob> {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  const v = verdict(s);

  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#fbbf24');
  bg.addColorStop(1, '#fef3c7');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  g.textAlign = 'center';
  g.fillStyle = '#451a03';
  g.font = '700 140px system-ui, sans-serif';
  g.fillText('Jutai', W / 2, 230);
  g.fillStyle = '#b91c1c';
  g.font = '700 80px system-ui, sans-serif';
  g.fillText('জুতাই', W / 2, 330);

  g.font = '220px system-ui, sans-serif';
  g.fillText('👡', W / 2, 600);

  g.fillStyle = '#451a03';
  g.font = '700 260px system-ui, sans-serif';
  g.fillText(String(s.score), W / 2, 860);
  g.font = '600 48px system-ui, sans-serif';
  g.fillText('SCORE', W / 2, 920);

  g.font = '700 56px system-ui, sans-serif';
  g.fillText(`${s.hits} jutais · ${s.spits} spits · ${accuracy(s)}% accuracy`, W / 2, 1020);

  g.fillStyle = '#b91c1c';
  g.font = '800 96px system-ui, sans-serif';
  g.fillText(v.title, W / 2, 1160);
  g.fillStyle = '#451a03';
  g.font = '600 46px system-ui, sans-serif';
  g.fillText(v.message, W / 2, 1230);

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
}

/** Shares the card via the Web Share API; falls back to a PNG download + copied text. */
export async function shareResult(s: Stats): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const blob = await renderCard(s);
  const file = new File([blob], 'jutai-score.png', { type: 'image/png' });
  const text = shareText(s);
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, title: 'Jutai' });
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
      // any other failure: fall through to download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be blocked; the download still worked
  }
  return 'downloaded';
}
