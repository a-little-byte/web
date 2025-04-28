export type EmscriptenModule = {
  ccall: (
    ident: string,
    returnType: string,
    argTypes: string[],
    args: any[],
  ) => any;
  cwrap: (
    ident: string,
    returnType: string,
    argTypes: string[],
  ) => (...args: any[]) => any;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  UTF8ToString: (ptr: number, maxBytesToRead?: number) => string;
  stringToUTF8: (str: string, outPtr: number, maxBytesToWrite: number) => void;
  lengthBytesUTF8: (str: string) => number;
  setValue: (ptr: number, value: any, type: string) => void;
  getValue: (ptr: number, type: string) => any;
  init: () => Promise<void>;
  HEAPU8: Uint8Array;
};

export const initWasmModule = async (module: string, wasmName?: string) => {
  let wasmModule: EmscriptenModule | null = null;
  const moduleName = wasmName ? wasmName : module;


  try {
    if (typeof window === "undefined") {
      // Server-side
      const { default: moduleFactory } = await import(`./${module}/build/${moduleName}.js`);
      wasmModule = await moduleFactory();
    } else {
      // Client-side
      const wasmUrl = `/wasm/${moduleName}.wasm`;
      
      const wasmResponse = await fetch(wasmUrl);
      if (!wasmResponse.ok) {
        throw new Error(`Failed to fetch WASM file: ${wasmUrl}, status: ${wasmResponse.status}`);
      }
      
      const moduleFactory = (await import(`./${module}/build/${moduleName}.js`)).default;
      
      wasmModule = await moduleFactory({
        locateFile: (path: string) => {
          if (path.endsWith('.wasm')) {
            return wasmUrl;
          }
          return path;
        }
      }).init();
    }
  } catch (err) {
    console.error("Failed to initialize WASM module:", err);
    throw new Error(`WASM module failed to initialize`);
  }

  return wasmModule;
}
