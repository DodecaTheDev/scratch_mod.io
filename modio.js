class ModIO {
  getInfo() {
    let apiKey = '';
    return {
      id: 'modio',
      name: 'Mod.io',
      // intentionally bad colors so that the effect is more clear
      color1: '#1D5957', // pure red
      color2: '#163635', // pure green
      color3: '#163635', // pure blue
      blocks: [
        {
          opcode: 'getKey',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get api key'
        }
      ],
    };
  }

  reporter() {
    return apiKey;
  }
}

Scratch.extensions.register(new ModIO());
