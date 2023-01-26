import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {ConfirmationService, LazyLoadEvent} from 'primeng/api'
import { MessageService } from 'primeng/api'
import { Track } from '../../models/response/track-models'
import {AdminTrackService} from "../../services/admin/admin-track.service"
import {Table} from "primeng/table"
import {FormControl, FormGroup, Validators} from "@angular/forms"
import * as XLSX from 'xlsx'
import { startOfMonth, endOfMonth } from 'date-fns'
import {AdminReceiptsService} from "../../services/admin/admin-receipts.service";
import {AdminUsersService} from "../../services/admin/admin-users.service";

export interface TrackInfo {
  trackNumber: string,
  receivedInAlmatyDate: Date
}

@Component({
  selector: 'app-tracks',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  providers: [MessageService,ConfirmationService]
})
export class ScanComponent implements OnInit {

  @ViewChild('inputRef') inputRef: ElementRef | undefined;

  trackList: TrackInfo[] = []
  trackNumber: string = ''
  selectedStatus: any;
  isLoading: boolean = false;
  strArr: string[] = []
  resultStr: string = ''

  statuses = [
    { value: 'Дата получения на складе в Китае', key: 'receivedInChinaDate' },
    { value: 'Дата отправления в Алматы', key: 'fromChinaToAlmaty' },
    { value: 'Дата получения на складе в Алматы', key: 'receivedInAlmatyDate' },
    { value: 'Дата получения клиентом', key: 'receivedByClient' },
  ]

  constructor(private adminTrackService: AdminTrackService,
              private messageService: MessageService) { }

  ngOnInit() {
    // this.inputRef?.nativeElement.focus()
    // this.getAllTracks(this.defaultParams)
  }

  updateTrack (data: any) {
      this.isLoading = true
      this.adminTrackService.upsertManyTracks(data)
        .toPromise()
        .then((resp) => {
          this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номера успешно созданы (обновлены)', life: 3000});
          console.log(resp)
          this.trackList = []
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000)
        })
        .catch((err) => {
          this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать (обновить)' + err.error.message, life: 3000});
        }).finally(() => {
          this.trackNumber = ''
        this.isLoading = false
      })
  }

  change (event: any) {
    console.log('event', event)
    this.strArr.push(event)
    console.log('strArr', this.strArr)
    if (this.strArr.length > 2) {
      if (this.strArr[this.strArr.length - 1].includes(this.strArr[this.strArr.length - 2])) {
        console.log('continue')
        this.resultStr = this.strArr[this.strArr.length - 1]
      } else {
        console.log('its diff')
      }
    }
    // if (this.trackNumber.length > 0) {
    //   const filtered = this.trackList.filter(track => this.trackNumber === track.trackNumber)
    //   if (filtered.length === 0) {
    //     let data = {
    //       trackNumber: this.trackNumber,
    //       receivedInAlmatyDate: new Date(Date.now())
    //     }
    //     this.trackList.push(data)
    //   }
    //   this.trackNumber = ''
    // }
  }

  search(ev: any) {
    console.log('ev', ev)
  }

  submit() {
    this.updateTrack(this.trackList)
  }
}
