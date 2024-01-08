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
          opcode: "init",
          blockType: Scratch.BlockType.COMMAND,
          text: "initialize",
        },
        {
          opcode: "getKey",
          blockType: Scratch.BlockType.REPORTER,
          text: "get api key",
        },
        {
          opcode: "setKey",
          blockType: Scratch.BlockType.COMMAND,
          text: "set api key to [string]",
          arguments: {
            string: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "api key",
            },
          },
        },
      ],
    };
  }
  init() {
    let apiKey,
    apiKey = "api";
  }
  getKey() {
    return apiKey;
  }
  setKey() {
    apiKey = 'A';
  }
}

Scratch.extensions.register(new ModIO());
