(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Hello World example must run unsandboxed');
  }

  class ModIo {
    getInfo() {
      return {
        id: 'modio',
        name: 'Mod.io',
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
  Scratch.extensions.register(new ModIo());
