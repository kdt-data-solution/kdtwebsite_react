let complete;

export const pageReady = new Promise(resolve => { complete = resolve; });

export function markPageReady() {
  complete();
}
