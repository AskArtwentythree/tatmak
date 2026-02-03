import {
  setDebug,
  backButton,
  mainButton,
  initData,
  init as initSDK,
  miniApp,
  viewport,
} from "@tma.js/sdk-react";

/**
 * Initializes the Telegram Mini App SDK.
 */
export async function init(options: { debug: boolean }): Promise<void> {
  setDebug(options.debug);
  initSDK();

  // Mount all components used in the project
  backButton.mount();
  mainButton.mount();
  initData.restore();

  try {
    miniApp.mount();
  } catch {
    // miniApp not available
  }

  try {
    viewport.mount().then(() => {
      viewport.bindCssVars();
    });
  } catch {
    // viewport not available
  }
}
