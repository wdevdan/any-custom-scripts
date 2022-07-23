const sharp = require('sharp');

export class ImageHandler {
  private service: any;
  
  private maxResolution = 1920;
  private showInfoLogs = true;

  constructor(private file: ICustomFile) {
    this.service = sharp(this.file.filePathAndName);
  }

  async validateFile(fileName: string, ext: string, path: string, tempPath: string) {
      var sizeOf = require('image-size');
      var fs = require('fs');

      const exist = fs.existsSync(tempPath);
      const filePath = exist ? tempPath : path;
      const filePathAndName = filePath + fileName;
      const fileOptions = await sizeOf(filePathAndName);

      const customFile: ICustomFile = {
          filePathAndName,
          fileOptions,
          filePath,
          ext
      }

      new ImageHandler(customFile).needResize();
  }

  needResize(): boolean {
    const { width: originWidth, height: originHeight } = this.file.fileOptions;
    const maxSize = this.maxResolution || 1920;
    const testOne = originHeight > maxSize;
    const testTwo = originWidth > maxSize;

    let needResize: boolean = false;

    if (testOne || testTwo) {
      needResize = true;
      
      if (originHeight > originWidth) {
        this.file.fileOptions.height = maxSize;
        this.file.fileOptions.width = this.calculateRatio(originHeight, this.file.fileOptions.width);
      } else {
        this.file.fileOptions.width = maxSize;
        this.file.fileOptions.height = this.calculateRatio(originWidth, this.file.fileOptions.height);
      }
      
      if (this.showInfoLogs) {
        console.info('New Resize Task: ', new Date().toUTCString());
        console.info(originHeight, originWidth, '=>', this.file.fileOptions.height, this.file.fileOptions.width);
      }

      this.service.resize(this.file.fileOptions);
      this.setFile(this.file.filePath, '[RESIZED].' + this.file.ext)
    } else {
      if (this.showInfoLogs) console.info('File has not been resized');
    }
    
    return needResize;
  }

  calculateRatio(divider, multiplier) {
      let ratio = this.maxResolution / divider;
      return Math.trunc(multiplier * ratio);
  }

  getBuffer = () => this.checkout(this.service.toBuffer());

  setFile = (path, fileName) => this.checkout(this.service.toFile(path + fileName));
  
  checkout = (action) => action.then((r) => r).catch((e) => console.error('ImageHandlerError: ', e));
}

export interface ICustomFile {
  fileOptions: IOptionsSize;
  filePathAndName: string;
  filePath: string;
  ext: string;
}

export interface IOptionsSize {
  orientation?: number;
  height?: number;
  width?: number;
  type?: string;
}
