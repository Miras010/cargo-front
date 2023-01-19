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

  trackNumber: string = ''
  selectedStatus: any;
  isLoading: boolean = false;

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
    // if (this.selectedStatus) {
      this.isLoading = true
      this.adminTrackService.upsertManyTracks(data)
        .toPromise()
        .then((resp) => {
          this.messageService.add({severity:'success', summary: 'Успешно', detail: 'Трек номера успешно созданы (обновлены)', life: 3000});
          console.log(resp)
        })
        .catch((err) => {
          this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Не удалось создать (обновить)' + err.error.message, life: 3000});
        }).finally(() => {
        this.trackNumber = ''
        this.isLoading = false
        window.location.reload();
      })
    // } else {
    //   this.messageService.add({severity:'error', summary: 'Ошибка', detail: 'Выберите статус', life: 3000});
    // }
  }

  change(event: any) {
    let data = {
      trackNumber: event,
      receivedInAlmatyDate: Date.now()
    }
    this.updateTrack([data])
  }
}
