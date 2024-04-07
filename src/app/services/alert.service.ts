import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private toastrService: ToastrService) {}

    public error(message: string, config?: AlertConfig) {
        this.toastrService.error(message, config?.title ? config.title : 'Error', {
            progressBar: true,
            positionClass: 'toast-bottom-right',
            timeOut: config?.duration ? config.duration : 5000,
            disableTimeOut: config?.disableAutoClose
        });
    }

  public success(message: string, config?: AlertConfig) {
    this.toastrService.success(message, config?.title ? config.title : 'Success', {
      progressBar: true,
      positionClass: 'toast-center-center',
      timeOut: config?.duration ? config.duration : 5000,
      disableTimeOut: config?.disableAutoClose
    });
  }
}

export class AlertConfig {
    title?: string;
    duration?: number;
    disableAutoClose?: boolean;
}
