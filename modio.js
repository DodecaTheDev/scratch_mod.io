(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Hello World example must run unsandboxed');
  }

  class ModIO {
    getInfo() {
      return {
      id: "modio",
      name: "Mod.io",
      color1: "#1D5957",
      color2: "#163635",
      color3: "#163635",
        blocks: [
          {
            opcode: 'hello',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Hello!'
          }
        ]
      };
    }
    hello() {
      return 'World!';
    }
  }
  Scratch.extensions.register(new ModIO());
})(Scratch);
