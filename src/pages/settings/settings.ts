import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { MqttProvider } from '../../providers/mqtt/mqtt';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private temperature: number;
  private humidity: number;

  private temperatureMax: number;
  private temperatureMin: number;
  private humidityMax: number;
  private humidityMin: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public mqttProvider: MqttProvider) {
      this.temperature    = navParams.get("temperature");
      this.humidity       = navParams.get("humidity");
      this.temperatureMax = navParams.get("temperatureMax");
      this.temperatureMin = navParams.get("temperatureMin");
      this.humidityMax    = navParams.get("humidityMax");
      this.humidityMin    = navParams.get("humidityMin");
      this.mqttProvider.addControl(this);
  }

  // Atualizar informações
  public updateStatus(data: string): void {
    let status = JSON.parse(data);

    this.temperature    = status.temperature;
    this.humidity       = status.humidity;
  }

  // Salvar informações
  public save() {
    console.log("save SettingsPage");

    if(!(this.temperatureMin <= this.temperatureMax &&
       this.humidityMin <= this.humidityMax)) {
        this.toastCtrl.create({
          message: "Preencha os campos corretamente.",
          duration: 3000,
          position: "middle"
        }).present();
        return;
    }

    let data = {
      temperatureMax: this.temperatureMax,
      temperatureMin: this.temperatureMin,
      humidityMax: this.humidityMax,
      humidityMin: this.humidityMin
    }
    this.mqttProvider.publish(JSON.stringify(data));

    this.navCtrl.pop();
  }

}
