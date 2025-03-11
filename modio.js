(function(Scratch) {
  'use strict';
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }
  
  const MOD_IO_API_URL = 'https://api.mod.io/v1';
  const modIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ/SURBVHgB3ZvxVdswEMa/8PifMEHNBA0TNGyQTkA6AekECROUDUInoEyQdAJgArsTBCb4qkPKw3Es2ZYtEef3np7zbNmSTifpTqcMEAmSE3X5plJi0rCQJTPXZ5X+yXUwGKxxLCgBPLA5SwTmBPFI0JxzHAOqJxP6kSIwsTRgDD9EcEP0HelJ+rNAn1ENmLMdwYdBMFTlx+yGGfqGqvRIpQ27Qb4zQl9Qlb1hd43fkqqUIDbUY3hep3BqlV8xHKmUgQ4ZuB5Kw9Vlkbu1VukvtLn6Cm3OSvqqkpi6CeJwr9KtMpWzqozSca58A8eLY3VZ4bBZq/QI3SFZ7r7MF+J3TKE76MrmV5QKwKi7ND7BcZCpdKmE8Fp8YLMERfUTHA+JSqWO1Z4GqN6f2jIfAXtDoUwAYnklOE4yFIbCzhAwvZ/geElU2rEqdzTgk3r/1lzniIP0/sXehCi9z/gscuUvGI/pnlgY1oIrsimrhLo3YTvXuS6rYsFDxmNFh1lNvXu0Ynje6/A+CZrxcIFda6prpIyfqqwrp2mqnkke9fNH4Prse5dG+im7RdRdxrfX1hb13JSyO1Z0OVTUfnxbUpXu2KHnRu1p3rO5MDam0TOWdILNF1jAb1kSNb+s46W1gXr8ShqZ61khyxu0g/TuJJX5AFtsAhBJiU3go7bnrgIPjVJnyDTgN/wYo0e44gJ/4EfQfXw23BajXuKt+4mnjnef4UeCsMhkdoOPTZAXc19+b3eozrA7R1zZPmYVgAwDVVCGw3OOtho2MmlS4x1rZ8YMjnbFFzTDuQpUCaD/cbkKrAIwS6GPADKEpdMl1qUBvpGYDGF5a5g/cT10CeAafviuHnVprAEuk/zE8kKCerNrkSyCFegj4LHtgWtb3Gf8rxEeHwHc2B7sCcCoyxR+PCIgxqLzmZuGrHPQgno/wDeq2/lBBmPGzow72zbavKHLjKb2t9sUsiwRZgIPqBs+Z6wQO/VmZFuSwje3u8xL1hQEwzU8T7pXH7Y/yrIsaUxayDOvaPyYcXaEacoZFiuwoh8p7b1fmdfknzMuT2U9MKMf0xq9n0eejXJ5l4zPtEwAMv6ajr0y1a8bYbpm3GDMFvtqxWbhqZSFccQw2+pds8jXuRgcrbsZmkHH2rPC+xJyGuNwEVP9In9jxxI0dvxt1UdQ3niZ5cc4bKrapqF9bD7xMGZxHx5QF5abxBLpGfa08SmbWqX8mM3l5YklTxcWZAysrn3VQUl5ce3y8am1QvLFPFkm9ZG4xQs+NkiGpnw5H5j3GOVA5QKhoR42dwxLSq2Zwxp1uZf6IDYMd9QlfmN8CSCEKfoGuzNzZ+gj9P+nWJ7+qH0ZbKcFKT/jDxJdwnYbLb8QgQECQr1cbeDHReijNkLQ6LAxoDI0J4vReCFGeDxDczJE4hTh+Q7tJot5Kv8t2pqs+ejzay5J5CdogCXPf5vNjDPixIb1AAAAAElFTkSuQmCC';
  let apiKey = '';
  let gameId = '';
  let authToken = '';
  let lastError = null;
  let lastErrorOccurred = false;
  let currentModId = null;
  
  class PMModIo {
    constructor() {}
    
    getInfo() {
      return {
        id: 'modio',
        name: 'mod.io',
        color1: '#07C1D8',
        color2: '#048291',
        menuIconURI: modIcon,
        blockIconURI: modIcon,
        blocks: [
          {
            opcode: 'setAuth',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set API key [KEY] and game ID [GAME_ID]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'your-api-key'
              },
              GAME_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1234
              }
            }
          },
          {
            opcode: 'setAuthToken',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set OAuth token [TOKEN] for uploading',
            arguments: {
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'your-oauth-token'
              }
            }
          },
          {
            opcode: 'initModWithCoverURL',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create new mod with name [NAME] summary [SUMMARY] and cover image URL [URL]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'My Awesome Mod'
              },
              SUMMARY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'This is my cool mod created with PenguinMod!'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/image.png'
              }
            }
          },
          {
            opcode: 'addZipUrlToMod',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add zip file from URL [URL] to current mod with version [VERSION] changelog [CHANGELOG]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/mod.zip'
              },
              VERSION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.0.0'
              },
              CHANGELOG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Initial release'
              }
            }
          },
          {
            opcode: 'uploadGalleryImageFromURL',
            blockType: Scratch.BlockType.COMMAND,
            text: 'upload gallery image from URL [URL] to current mod',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/gallery-image.png'
              }
            }
          },
          {
            opcode: 'setModTag',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add tag [TAG] to current mod',
            arguments: {
              TAG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'game'
              }
            }
          },
          {
            opcode: 'addModDependency',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add dependency mod ID [DEP_MOD_ID] to current mod',
            arguments: {
              DEP_MOD_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 12345
              }
            }
          },
          {
            opcode: 'getMods',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [AMOUNT] mods for game',
            arguments: {
              AMOUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'getModDetails',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get details for mod with ID [MOD_ID]',
            arguments: {
              MOD_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'searchMods',
            blockType: Scratch.BlockType.REPORTER,
            text: 'search mods with query [QUERY]',
            arguments: {
              QUERY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cool mod'
              }
            }
          },
          {
            opcode: 'getCurrentModId',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current mod ID'
          },
          {
            opcode: 'didErrorOccur',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'did error occur?'
          },
          {
            opcode: 'getLastError',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last error'
          },
          {
            opcode: 'setModVisibility',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set mod visibility to [VISIBILITY]',
            arguments: {
              VISIBILITY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'visibilityOptions',
                defaultValue: 'public'
              }
            }
          }
        ],
        menus: {
          visibilityOptions: {
            acceptReporters: false,
            items: ['public', 'hidden']
          }
        }
      };
    }
    
    _setError(error) {
      lastError = error;
      lastErrorOccurred = true;
      return error;
    }
    
    _clearError() {
      lastError = null;
      lastErrorOccurred = false;
    }
    
    _getFileExtension(url, mimeType) {
      const urlExtension = url.split('.').pop().toLowerCase();
      if (urlExtension && ['jpg', 'jpeg', 'png'].includes(urlExtension)) {
        return urlExtension;
      }
      
      if (mimeType) {
        const mimeExtMap = {
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/png': 'png',
        };
        return mimeExtMap[mimeType] || 'png';
      }
      
      return 'png';
    }
    
    didErrorOccur() {
      return lastErrorOccurred;
    }
    
    getLastError() {
      return lastError ? JSON.stringify(lastError) : '{}';
    }
    
    getCurrentModId() {
      return currentModId || 0;
    }
    
    setAuth(args) {
      this._clearError();
      apiKey = args.KEY;
      gameId = args.GAME_ID;
    }
    
    setAuthToken(args) {
      this._clearError();
      authToken = args.TOKEN;
    }
    
    async initModWithCoverURL(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        this._setError({error: "API key and game ID must be set first"});
        return;
      }
      
      if (!authToken) {
        this._setError({error: "OAuth token must be set for uploading"});
        return;
      }
      
      if (!args.URL) {
        this._setError({error: "Cover image URL is required"});
        return;
      }
      
      try {
        const imageResponse = await fetch(args.URL);
        
        if (!imageResponse.ok) {
          this._setError({error: `Failed to fetch image: ${imageResponse.statusText}`});
          return;
        }
        
        const imageBlob = await imageResponse.blob();
        const ext = this._getFileExtension(args.URL, imageBlob.type);
        const imageFile = new File([imageBlob], `cover.${ext}`, { type: imageBlob.type });
        
        const formData = new FormData();
        formData.append('name', args.NAME);
        formData.append('summary', args.SUMMARY);
        formData.append('visible', 0);
        formData.append('logo', imageFile);
        
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (data.error) {
          this._setError(data);
        } else if (data.id) {
          currentModId = data.id;
        }
      } catch (error) {
        this._setError({error: error.message});
      }
    }
    
    async addZipUrlToMod(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        this._setError({error: "API key and game ID must be set first"});
        return;
      }
      
      if (!authToken) {
        this._setError({error: "OAuth token must be set for uploading"});
        return;
      }
      
      if (!currentModId) {
        this._setError({error: "No mod initialized. Use 'init mod' first."});
        return;
      }
      
      if (!args.URL) {
        this._setError({error: "ZIP file URL is required"});
        return;
      }
      
      try {
        const zipResponse = await fetch(args.URL);
        
        if (!zipResponse.ok) {
          this._setError({error: `Failed to fetch ZIP: ${zipResponse.statusText}`});
          return;
        }
        
        const zipBlob = await zipResponse.blob();
        const zipFile = new File([zipBlob], 'mod.zip', { type: 'application/zip' });
        
        const modfileFormData = new FormData();
        modfileFormData.append('version', args.VERSION);
        modfileFormData.append('changelog', args.CHANGELOG);
        modfileFormData.append('filedata', zipFile);
        
        const uploadResponse = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods/${currentModId}/files`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: modfileFormData
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.error) {
          this._setError(uploadResult);
        }
      } catch (error) {
        this._setError({error: error.message});
      }
    }
    
    async uploadGalleryImageFromURL(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        this._setError({error: "API key and game ID must be set first"});
        return;
      }
      
      if (!authToken) {
        this._setError({error: "OAuth token must be set for uploading"});
        return;
      }
      
      if (!currentModId) {
        this._setError({error: "No mod initialized. Use 'init mod' first."});
        return;
      }
      
      if (!args.URL) {
        this._setError({error: "Image URL is required"});
        return;
      }
      
      try {
        const imageResponse = await fetch(args.URL);
        
        if (!imageResponse.ok) {
          this._setError({error: `Failed to fetch image: ${imageResponse.statusText}`});
          return;
        }
        
        const imageBlob = await imageResponse.blob();
        const ext = this._getFileExtension(args.URL, imageBlob.type);
        const imageFile = new File([imageBlob], `gallery-image.${ext}`, { type: imageBlob.type });
        
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods/${currentModId}/media`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (data.error) {
          this._setError(data);
        }
      } catch (error) {
        this._setError({error: error.message});
      }
    }

    async setModTag(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        this._setError({error: "API key and game ID must be set first"});
        return;
      }
      
      if (!authToken) {
        this._setError({error: "OAuth token must be set for uploading"});
        return;
      }
      
      if (!currentModId) {
        this._setError({error: "No mod initialized. Use 'init mod' first."});
        return;
      }
      
      try {
        const params = new URLSearchParams();
        params.append('tags[]', args.TAG);
        
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods/${currentModId}/tags`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        });
        
        const data = await response.json();
        
        if (data.error) {
          this._setError(data);
        }
      } catch (error) {
        this._setError({error: error.message});
      }
    }
    
    async addModDependency(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        this._setError({error: "API key and game ID must be set first"});
        return;
      }
      
      if (!authToken) {
        this._setError({error: "OAuth token must be set for uploading"});
        return;
      }
      
      if (!currentModId) {
        this._setError({error: "No mod initialized. Use 'init mod' first."});
        return;
      }
      
      try {
        const depModId = parseInt(args.DEP_MOD_ID);
        
        if (isNaN(depModId)) {
          this._setError({error: "Dependency mod ID must be a valid number"});
          return;
        }
        
        const params = new URLSearchParams();
        params.append('dependencies[]', depModId.toString());
        
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods/${currentModId}/dependencies`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        });
        
        const data = await response.json();
        
        if (data.error) {
          this._setError(data);
        }
      } catch (error) {
        this._setError({error: error.message});
      }
    }

    async getMods(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        return this._setError({error: "API key and game ID must be set first"});
      }
      
      try {
        const limit = Math.min(Math.max(parseInt(args.AMOUNT), 1), 100);
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods?api_key=${apiKey}&limit=${limit}`);
        const data = await response.json();
        
        if (data.error) {
          return this._setError(data);
        }
        
        return JSON.stringify(data);
      } catch (error) {
        return this._setError({error: error.message});
      }
    }
    
    async getModDetails(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        return this._setError({error: "API key and game ID must be set first"});
      }
      
      try {
        const modId = parseInt(args.MOD_ID);
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods/${modId}?api_key=${apiKey}`);
        const data = await response.json();
        
        if (data.error) {
          return this._setError(data);
        }
        
        return JSON.stringify(data);
      } catch (error) {
        return this._setError({error: error.message});
      }
    }
    
    async searchMods(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        return this._setError({error: "API key and game ID must be set first"});
      }
      
      try {
        const query = encodeURIComponent(args.QUERY);
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods?api_key=${apiKey}&_q=${query}`);
        const data = await response.json();
        
        if (data.error) {
          return this._setError(data);
        }
        
        return JSON.stringify(data);
      } catch (error) {
        return this._setError({error: error.message});
      }
    }
    
    async setModVisibility(args) {
      this._clearError();
      
      if (!apiKey || !gameId) {
        this._setError({error: "API key and game ID must be set first"});
        return;
      }
      
      if (!authToken) {
        this._setError({error: "OAuth token must be set for uploading"});
        return;
      }
      
      if (!currentModId) {
        this._setError({error: "No mod initialized. Use 'init mod' first."});
        return;
      }
      
      try {
        const visibilityValue = args.VISIBILITY === 'public' ? 1 : 0;
        
        const params = new URLSearchParams();
        params.append('visible', visibilityValue);
        
        const response = await fetch(`${MOD_IO_API_URL}/games/${gameId}/mods/${currentModId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        });
        
        const data = await response.json();
        
        if (data.error) {
          this._setError(data);
        }
      } catch (error) {
        this._setError({error: error.message});
      }
    }
  }
  
  Scratch.extensions.register(new PMModIo());
})(Scratch);
