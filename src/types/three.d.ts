declare module 'three' {
  export class Object3D {
    name: string;
    position: Vector3;
    rotation: any;
    add(...object: any[]): this;
    remove(...object: any[]): this;
    traverse(callback: (child: any) => void): void;
  }
  export class Scene extends Object3D {}
  export class Group extends Object3D {}
  export class PerspectiveCamera {
    aspect: number;
    position: Vector3;
    constructor(fov: number, aspect: number, near: number, far: number);
    updateProjectionMatrix(): void;
  }
  export class WebGLRenderer {
    domElement: HTMLCanvasElement;
    toneMapping: any;
    toneMappingExposure: number;
    constructor(parameters?: any);
    setPixelRatio(value: number): void;
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    dispose(): void;
  }
  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    copy(v: Vector3): this;
  }
  export class AmbientLight extends Object3D {
    constructor(color?: any, intensity?: number);
  }
  export class DirectionalLight extends Object3D {
    constructor(color?: any, intensity?: number);
  }
  export class Mesh extends Object3D {
    isMesh: boolean;
    geometry: any;
    material: any;
    castShadow: boolean;
    receiveShadow: boolean;
    constructor(geometry?: any, material?: any);
  }
  export class PlaneGeometry {
    constructor(width?: number, height?: number);
    dispose(): void;
  }
  export class MeshBasicMaterial {
    constructor(parameters?: any);
    dispose(): void;
  }
  export class CanvasTexture {
    constructor(canvas: any);
    dispose(): void;
  }
  export const ACESFilmicToneMapping: any;
}

declare module 'three/addons/controls/OrbitControls.js' {
  export class OrbitControls {
    enableDamping: boolean;
    dampingFactor: number;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    target: any;
    constructor(object: any, domElement?: HTMLElement);
    update(): boolean;
    reset(): void;
    dispose(): void;
    addEventListener(type: string, listener: (event: any) => void): void;
  }
}

declare module 'three/addons/loaders/GLTFLoader.js' {
  export class GLTFLoader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: { scene: any; scenes: any[]; animations: any[] }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent | any) => void
    ): void;
  }
}
