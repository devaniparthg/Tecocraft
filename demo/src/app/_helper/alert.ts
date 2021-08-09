import { SnotifyService,SnotifyPosition,SnotifyToastConfig } from 'ng-snotify';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class alertsService  {
    style = 'material';
    title = 'Snotify title!';
    body = 'Lorem ipsum dolor sit amet!';
    timeout = 2000;
    position: SnotifyPosition = SnotifyPosition.rightBottom;
    progressBar = true;
    closeClick = true;
    newTop = true;
    filterDuplicates = false;
    backdrop = -1;
    dockMax = 8;
    blockMax = 6;
    pauseHover = true;
    titleMaxLength = 15;
    bodyMaxLength = 80;

    constructor(private snotifyService: SnotifyService) {
    }
     /*
  Change global configuration
   */
  getConfig(): SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax,
        // @ts-ignore
        filterDuplicates: this.filterDuplicates
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }
    showAlerts(message: string, type: string): void { 
        if (type == 'info')        
            this.snotifyService.info(message,this.getConfig());
        else if (type == 'error')
            this.snotifyService.error(message,this.getConfig());
        else if (type == 'success')
            this.snotifyService.success(message,this.getConfig());
        else if (type == 'warning')
            this.snotifyService.warning(message),this.getConfig();
        else
            this.snotifyService.info(message,this.getConfig());
        // For html messages:
        //this.alerts.warning({html: '<b>This message is bold</b>'});
    }

}