declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        close?: () => void;
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
          query_id?: string;
          auth_date?: number;
          hash?: string;
          start_param?: string;
        };
        MainButton?: {
          setText?: (text: string) => void;
          show?: () => void;
          hide?: () => void;
          showProgress?: (leaveActive?: boolean) => void;
          hideProgress?: () => void;
          enable?: () => void;
          disable?: () => void;
        };
        HapticFeedback?: {
          notificationOccurred?: (
            type: "error" | "success" | "warning"
          ) => void;
          impactOccurred?: (
            style: "light" | "medium" | "heavy" | "rigid" | "soft"
          ) => void;
          selectionChanged?: () => void;
        };
      };
    };
  }
}

export {};
