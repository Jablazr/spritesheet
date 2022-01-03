import Canvas from "canvas";

const { createCanvas } = Canvas;

export interface IProcessedImage {
  width: number;
  height: number;
  image: Canvas.Image;
  cropped: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const processImages = async (images: Canvas.Image[]) => {
  const croppedImages: IProcessedImage[] = await Promise.all(
    images.map(async (image) => {
      const { width, height } = image;

      const cropCanvas = createCanvas(width, height);
      const cropCanvasCtx = cropCanvas.getContext("2d");

      cropCanvasCtx.drawImage(image, 0, 0);

      const cropped = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };

      return {
        width: width - cropped.left - cropped.right,
        height: height - cropped.top - cropped.bottom,
        image,
        cropped,
      };
    })
  );

  return croppedImages;
};
