import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { MqttProvider } from '../../providers/mqtt/mqtt';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private temperature: number;
  private humidity: number;

  private temperatureMax: number;
  private temperatureMin: number;
  private humidityMax: number;
  private humidityMin: number;
  private heating: boolean;

  private lastTimeShow: string;

  constructor(
    public navCtrl: NavController,
    public mqttProvider: MqttProvider) {
    this.mqttProvider.addControl(this);
  }

  // Verificar comunicação e conectar ao servidor
  ionViewWillEnter() {
    console.log("ionViewWillEnter HomePage");

    if(!this.mqttProvider.isConnected()) {
      this.mqttProvider.connectServer();

      this.temperature = null;
      this.humidity = null;
    }
  }

  // Atualizar informações
  public updateStatus(data: string): void {
    let status = JSON.parse(data);

    // {"temperature":37.30,"humidity":28.40,"temperatureMax":37.80,"temperatureMin":37.40,"humidityMax":70.00,"humidityMin":60.00,"heating":true}
    this.temperature    = status.temperature;
    this.humidity       = status.humidity;
    this.temperatureMax = status.temperatureMax;
    this.temperatureMin = status.temperatureMin;
    this.humidityMax    = status.humidityMax;
    this.humidityMin    = status.humidityMin;
    this.heating        = status.heating;

    let time = new Date();
    let hour = time.getHours();
    let hourShow = hour < 10 ? "0" + hour : hour.toString();
    let minute = time.getMinutes();
    let minuteShow = minute < 10 ? "0" + minute : minute.toString();
    this.lastTimeShow = hourShow + ":" + minuteShow;
  }

  // Abrir tela Configurar
  public openSettingsPage(): void {
    console.log("openSettingsPage HomePage");

    let params = {
      temperature: this.temperature,
      humidity: this.humidity,
      temperatureMax: this.temperatureMax,
      temperatureMin: this.temperatureMin,
      humidityMax: this.humidityMax,
      humidityMin: this.humidityMin
    }
    this.navCtrl.push(SettingsPage, params);
  }

}
