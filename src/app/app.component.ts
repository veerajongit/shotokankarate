import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen, Push, Facebook, NativeStorage } from 'ionic-native';
import {Http} from '@angular/http';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public http: Http, public alert : AlertController) {

    this.initializeApp();



    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Kata', component: Page1 },
      { title: 'Kumite', component: Page2 }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.backgroundColorByHexString('#81916D');
      Splashscreen.hide();
      
      NativeStorage.getItem('facebook')
        .then(
          fdata => {
            console.log(fdata);
              this.notification(fdata);
          },
          error =>{
             //console.error(error);
             this.login();
          }
        );
      });
    };



    notification(email){
      var push = Push.init({
        android: {
          senderID: "712847865553"
        },
        ios: {
          alert: "true",
          badge: true,
          sound: 'false'
        },
        windows: {}
      });

      push.on('registration', (data1) => {
        //pushregistration will always be null
        let fdata = JSON.stringify(email);
        let url = "http://128.199.84.250/push.php?sender_id="+data1.registrationId.toString()+'&phoneno='+fdata;
        this.http.get(url).subscribe(data => {
                console.log('GCM ID sent to server');
              }, error => {
                  console.log("Oooops!");
              });            
      });


      push.on('notification', (data) => {
        if(data.title == "Update Available"){
          location.href = "market://details?id=com.ionicframework.karate610025";
        }
        console.log(data);
        //alert("Hi, Am a push notification");
      });
      push.on('error', (e) => {
        console.log(e.message);
      });
    }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


    login(){
      this.platform.ready().then(() => {
      Facebook.browserInit(316211825405410);
        Facebook.login(["email"]).then( data => {
          console.log(data);
          Facebook.api('/me', []).then( resp => {
              let data = {
                id:resp.id,
                name:resp.name
              };
              console.log(data);
              NativeStorage.setItem("facebook",data) .then( data => {
                  //location.reload();          
              });
          });
        }, error => {
          let alert1 = this.alert.create({
            title: 'Error!',
            subTitle: 'Error Loging to Facebook, try again!',
            buttons: [{text : 'Try Again',
            handler : data =>{
              location.reload();          
            }
          }]
          });
          alert1.present();
        });
      });
  }


}
