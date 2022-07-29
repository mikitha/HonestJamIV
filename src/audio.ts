interface AudioPathMap { [key: string]: AudioPathMapEntry }
type AudioPathMapEntry = string | AudioPathMap

interface AudioMap { [key: string] : AudioMapEntry }
type AudioMapEntry = AudioBuffer | AudioMap

const audioCtx = new AudioContext();

const _bgm: AudioMap = {}
const _sfx: AudioMap = {}
function loadAudio(audioMap: AudioMap): ([name, audioPath]: [string, AudioPathMapEntry]) => Promise<void> {
  return async function([name, audioPath]: [string, AudioPathMapEntry]): Promise<void> {
    console.log("loading", name)
    if (typeof audioPath === 'string') {
      return new Promise(async (resolve, _reject) => {
        const audioFile = await fetch(audioPath as string);
        const audioBuffer = await audioFile.arrayBuffer();
        audioMap[name] = await audioCtx.decodeAudioData(audioBuffer);
        resolve();
      });
    } else {
      const innerAudioMap: AudioMap = {}
      audioMap[name] = innerAudioMap;
      await Promise.all(Object.entries(audioPath as AudioPathMap).map(loadAudio(innerAudioMap)));
    }
  }
}

async function load() {
  const bgmManifest: AudioPathMap = await fetch('./bgmManifest.json').then(m => m.json())
  const sfxManifest: AudioPathMap = await fetch('./sfxManifest.json').then(m => m.json())
  await Promise.all(Object.entries(bgmManifest).map(loadAudio(_bgm)));
  await Promise.all(Object.entries(sfxManifest).map(loadAudio(_sfx)));
}

function audio(map: AudioMap, name: string): AudioBuffer {
  const nameChunks = name.split('/')
  if (map[nameChunks[0]] instanceof AudioBuffer) {
    return map[nameChunks[0]] as AudioBuffer
  } else if (typeof map[nameChunks[0]] === 'object') {
    return audio(map[nameChunks[0]] as AudioMap, nameChunks.slice(1).join('/'));
  } else {
    throw(nameChunks[0] + " is a " + typeof nameChunks[0])
  }
}

const bgm = audio.bind(null, _bgm);
const sfx = audio.bind(null, _sfx);

export { bgm, sfx, load, audioCtx }
