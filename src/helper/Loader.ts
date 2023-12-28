/*
  Loader helper class
*/

export default class Loader {
  static loader: any;

  static setLoader = (loader: HTMLInputElement): void => {
    this.loader = loader;
  };

  static showLoader = (): void => {
    this.loader?.showLoader();
  };

  static hideLoader = (): void => {
    this.loader?.hideLoader();
  };
}
