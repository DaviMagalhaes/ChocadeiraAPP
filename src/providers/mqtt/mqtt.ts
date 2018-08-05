import { Injectable } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';
import { ToastController } from 'ionic-angular';

@Injectable()
export class MqttProvider {

  private client;
  private listControls = new Array<any>(); // Para comunicação em duas vias

  // Chaves
  private readonly topicIn: string       = "davimagales/chocadeira/in"; // Referência na chocadeira
  private readonly topicOut: string      = "davimagales/chocadeira/out";
  private readonly serverAddress: string = "broker.hivemq.com";
  private readonly serverPort: string    = "8000";
  private readonly serverUser: string    = "";
  private readonly serverPw: string      = "";

  constructor(public toastCtrl: ToastController) {}

  // Conectar ao servidor
  public connectServer() {
    console.log("connectServer MqttProvider");
    console.log("connecting to server:", this.serverAddress, this.serverPort);

    let clientId = (Math.floor(Math.random()*(Math.pow(10, 10)-Math.pow(10, 9)))+Math.pow(10, 9)).toString();
    this.client = new Paho.MQTT.Client(this.serverAddress, Number(this.serverPort), clientId);

    this.onConnectionLost();
    this.onMessage();
    this.client.connect({
      userName: this.serverUser,
      password: this.serverPw,
      onSuccess: this.onConnected.bind(this),
      onFailure: this.onFailure.bind(this),
      timeout: 30,
      mqttVersion: 4
    });
  }

  // Desconectar do servidor
  public disconnectServer() {
    console.log("disconnectServer MqttProvider");
    if(this.client.isConnected())
      this.client.disconnect();
  }

  // Inscrever-se num tópico
  public subscribe(topic: string) {
    if(this.client.isConnected()) {
      console.log("subscribe MqttProvider:", topic);
      this.client.subscribe(topic);
    }
  }

  // Publicar mensagem
  public publish(message: string) {
    console.warn("publishing MqttProvider:", message);

    if(!this.client.isConnected()) {
      console.log("not connected MqttProvider");

      this.toastCtrl.create({
        message: "Sem conexão com o servidor.",
        duration: 10000,
        showCloseButton: true,
        closeButtonText: "Fechar"
      }).present();
      return;
    }

    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = this.topicIn;
    packet.qos = 1;
    this.client.send(packet);

    this.toastCtrl.create({
      message: "Salvo com sucesso.",
      duration: 3000
    }).present();
  }

  // TRATAR MENSAGENS RECEBIDAS
  public onMessage() {
    this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
      console.log("message arrived MqttProvider:", message.payloadString, message.destinationName);

      if(this.listControls["HomePage"])
        this.listControls["HomePage"].updateStatus(message.payloadString);
      if(this.listControls["SettingsPage"])
        this.listControls["SettingsPage"].updateStatus(message.payloadString);
    };
  }

  // Conectado
  public onConnected() {
    console.warn("connected successfully MqttProvider");
    this.subscribe(this.topicOut);
  }

  // Conexão perdida
  public onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.warn("connection lost MqttProvider:", responseObject);

      this.toastCtrl.create({
        message: "Conexão perdida com o servidor.",
        duration: 5000,
        showCloseButton: true,
        closeButtonText: "Fechar"
      }).present();
    };
  }

  // Tentativa de conexão falhou
  public onFailure() {
    console.warn("connection failed MqttProvider");

    this.toastCtrl.create({
      message: "Não foi possível conectar ao servidor.",
      duration: 10000,
      showCloseButton: true,
      closeButtonText: "Fechar"
    }).present();
  }

  // Retorna se está conectado ou não
  public isConnected(): boolean {
    return this.client ? this.client.isConnected() : false;
  }

  // PARA COMUNICAÇÃO EM DUAS VIAS
  public addControl(control: any) {
    console.log("addControl MqttProvider:", control.constructor.name);
    this.listControls[control.constructor.name] = control;
  }

}
