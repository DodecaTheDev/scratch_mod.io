class ModIO {
  getInfo() {
    return {
      id: 'modio',
      name: 'Mod.io',
      // intentionally bad colors so that the effect is more clear
      color1: '#1D5957', // pure red
      color2: '#163635', // pure green
      color3: '#163635', // pure blue
      blocks: [
        {
          opcode: 'reporter',
          blockType: Scratch.BlockType.REPORTER,
          text: 'string [STRING] boolean [BOOLEAN] menu [MENU] field [FIELD]',
          arguments: {
            STRING: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '1'
            },
            BOOLEAN: {
              type: Scratch.ArgumentType.BOOLEAN
            },
            MENU: {
              type: Scratch.ArgumentType.STRING,
              menu: 'MENU'
            },
            FIELD: {
              type: Scratch.ArgumentType.STRING,
              menu: 'FIELD'
            }
          }
        },
      ],
      menus: {
        MENU: {
          acceptReporters: true,
          items: ['item 1', 'item 2']
        },
        // We're just including a field example for completion.
        // Please do not use acceptReporters: false!
        FIELD: {
          acceptReporters: false,
          items: ['item 1', 'item 2']
        }
      }
    };
  }

  reporter() {
    return 'This block does nothing';
  }
}

Scratch.extensions.register(new ModIO());
