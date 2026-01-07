import { ConfigContext, ExpoConfig } from "expo/config";


const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  // Use production package name for all environments
  // This allows testing RevenueCat in dev without rebuilding
  // Tradeoff: Can't install dev + prod apps simultaneously, but fine for development
  return 'com.zenvy.Pushlock';
  
  // Alternative (if you need separate package names):
  // if (IS_DEV) return 'com.zenvy.Pushlock.dev';
  // if (IS_PREVIEW) return 'com.zenvy.Pushlock.preview';
  // return 'com.zenvy.Pushlock';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'Pushlock (Dev)';
  }

  if (IS_PREVIEW) {
    return 'Pushlock (Preview)';
  }

  return 'Pushlock';
};


export default({config}: ConfigContext): ExpoConfig => ({
    ...config,
    "name": getAppName(),
    "slug": "pushlock",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "pushlock",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": getUniqueIdentifier(),
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to track your push-up movements and count repetitions."
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": getUniqueIdentifier(),
      "permissions": [
        "android.permission.CAMERA"
      ]
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "eas": {
        "projectId": "aa84edd8-f162-464a-b94e-4953641aff41"
      }
    }
  }
)
