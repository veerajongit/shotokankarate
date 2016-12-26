import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import {YoutubeVideoPlayer, PhotoViewer} from 'ionic-native';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  kumitelist;
  listshow = [];
  loader;
  stext = '';


  constructor(public navCtrl: NavController,
              private platform: Platform,
              public http : Http,
              public loadingCtrl: LoadingController) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.getdata();
  }
  getdata(){
    this.loader.present();
    this.http.get('http://128.199.84.250/shotokankarate/kumite.php').map(res => res.json()).subscribe(result => {
      this.kumitelist = JSON.parse(result);
      this.loader.dismiss();
      this.initialize();
    });
  }

  initialize(){
    this.listshow = this.kumitelist;
  }

  image(a) {
    return "http://128.199.84.250/shotokankarate/kumite/" + a + ".jpg";
  }

  watchvideo(src){
    YoutubeVideoPlayer.openVideo(src);
  }

  imageopen(src, title){
    PhotoViewer.show(src, title, {share:false});
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initialize();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listshow = this.listshow.filter((item) => {
        return (item.kumitename.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onload(a){
    this.image[a] = "1";
  }
}
