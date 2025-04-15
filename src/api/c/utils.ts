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
}


export const initWasmModule = async (module: string) => {
    let wasmModule: EmscriptenModule | null = null;

    try {
      if (typeof window === "undefined") {
        // Server-side
        const { default: moduleFactory } = await import(`./${module}/build/${module.toLocaleLowerCase()}.js`);
        wasmModule = await moduleFactory();
      } else {
        // Client-side
        const moduleFactory = (await import(`./${module}/build/${module.toLocaleLowerCase()}.js`)).default;
        wasmModule = await moduleFactory();
      }
    } catch (err) {
      console.error("Failed to initialize WASM hash module:", err);
      throw new Error("Hash module failed to initialize");
    }

    return wasmModule
  }
