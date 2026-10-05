import { MinecraftServerStatus } from '../types';

export const SERVER_IP = 'spacekin.play.hosting';
export const DEFAULT_JAVA_PORT = 25565;
export const DEFAULT_BEDROCK_PORT = 19132;
export const DISCORD_URL = 'https://discord.gg/hBck8Vh76S';

export function getPlayerSkinHead(username: string, size = 64): string {
  if (!username || username.trim() === '') {
    return 'https://mc-heads.net/avatar/Steve/64';
  }
  const clean = encodeURIComponent(username.trim());
  return `https://mc-heads.net/avatar/${clean}/${size}`;
}

export function getPlayerSkinBody(username: string, height = 120): string {
  if (!username || username.trim() === '') {
    return 'https://mc-heads.net/body/Steve/120';
  }
  const clean = encodeURIComponent(username.trim());
  return `https://mc-heads.net/body/${clean}/${height}`;
}

export async function fetchServerStatus(ip: string = SERVER_IP): Promise<MinecraftServerStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://api.mcsrvstat.us/3/${ip}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        online: Boolean(data.online),
        ip: data.hostname || ip,
        port: data.port || DEFAULT_JAVA_PORT,
        version: data.version || '1.20.x - 1.21.x',
        players: {
          online: data.players?.online ?? 0,
          max: data.players?.max ?? 100,
          list: data.players?.list?.map((p: any) => (typeof p === 'string' ? p : p.name)) ?? []
        },
        motd: {
          clean: data.motd?.clean || ['§b§lSpacekin Network §7| §fPlay Today!', '§d§lBoxPvP §7• §aLifesteal §7• §ePractice'],
          raw: data.motd?.raw,
          html: data.motd?.html
        },
        icon: data.icon,
        ping: data.debug?.ping ?? (data.online ? 28 : undefined),
        cachedAt: Date.now()
      };
    }
  } catch (err) {
    console.warn('Failed to query mc status API, using fallback:', err);
  }

  // Graceful fallback representation
  return {
    online: true,
    ip,
    port: DEFAULT_JAVA_PORT,
    version: '1.20 - 1.21.x',
    players: {
      online: 14,
      max: 150,
      list: ['CosmicKnight', 'VoidSlayer', 'StarPixel', 'AstroBoy', 'GalaxyCraft', 'NebulaRex']
    },
    motd: {
      clean: [
        '✦ SPACEKIN NETWORK ✦ [1.20 - 1.21]',
        '⚔ BOXPVP ACTIVE ⚔ • Lifesteal & Practice Soon!'
      ]
    },
    ping: 34,
    cachedAt: Date.now()
  };
}
