(function(Scratch) {
  const variables = {};
  const modURI = "data:image/png;base64,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";
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Hello World example must run unsandboxed');
  }

  class ModIO {
    getInfo() {
      return {
      id: "modio",
      name: "mod.io",
      blockIconURI: modURI,
      color1: "#1D5957",
      color2: "#163635",
      color3: "#163635",
        blocks: [
          {
            opcode: 'setKey',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set api key to [key]',
            arguments: {
            key: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'API KEY'
            }
            }
          },
          {
            opcode: 'getKey',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get api key'
          }
        ]
      };
    }
    setKey(args) {
      variables['apiKey'] = args.key;
    }
    getKey() {
      try {
        return variables['apiKey'];
      } catch (error) {
        console.error(error);
        return '0';
      }
    }
  }
  Scratch.extensions.register(new ModIO());
})(Scratch);
