import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Autostart } from '@ionic-native/autostart';
import { BackgroundMode } from '@ionic-native/background-mode';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen,
    statusBar: StatusBar,
    autostart: Autostart,
    backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      autostart.enable();

      backgroundMode.enable();
      backgroundMode.overrideBackButton();
      backgroundMode.setDefaults({silent:  true});
    });
  }
}

