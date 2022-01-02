declare module "detect-edges" {
  function cropped(canvas: Canvas): Promise<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;

  export = cropped;
}
