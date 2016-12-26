import { Component } from '@angular/core';
import { Platform, NavController, LoadingController } from 'ionic-angular';
import {YoutubeVideoPlayer, PhotoViewer} from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  katalist;
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
    this.http.get('http://128.199.84.250/shotokankarate/kata.php').map(res => res.json()).subscribe(result => {
      this.katalist = JSON.parse(result);
      this.loader.dismiss();
      this.initialize();
    });
  }

  initialize(){
    this.listshow = this.katalist;
  }

  image(a){
    return "http://128.199.84.250/shotokankarate/kata/" + a + ".jpg";
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
        return (item.kataname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onload(a){
    this.image[a] = "1";
  }
}
