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
  HEAPU8: Uint8Array;
};


export const initWasmModule = async (module: string, wasmName?:string) => {
    let wasmModule: EmscriptenModule | null = null;

    try {
      if (typeof window === "undefined") {
        // Server-side
        const { default: moduleFactory } = await import(`./${module}/build/${wasmName ? wasmName : module}.js`);
        wasmModule = await moduleFactory();
      } else {
        // Client-side
        const moduleFactory = (await import(`./${module}/build/${wasmName ? wasmName : module}.js`)).default;
        wasmModule = await moduleFactory();
      }
    } catch (err) {
      console.error("Failed to initialize WASM hash module:", err);
      throw new Error("Hash module failed to initialize");
    }

    return wasmModule
  }
