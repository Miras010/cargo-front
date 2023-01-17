import { Component, OnInit } from '@angular/core'
import {ConfirmationService, MessageService} from 'primeng/api'
import {TrackService} from "../../services/track.service"
import {UsersTrack } from '../../models/response/track-models'
// @ts-ignore
import {getFormattedDate} from '../../functionServices/dataService'
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {DialogComponent} from "../dialog/dialog.component";
import {Track} from '../../models/response/track-models'
import {CardComponent} from "../cardInfo/card.component";

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
  providers: [MessageService, DialogService]
})
export class TracksComponent implements OnInit {

  data: Array<UsersTrack> = []
  isLoading: boolean = false
  // @ts-ignore
  userInfo = JSON.parse(localStorage.getItem('userInfo'))
  // @ts-ignore
  ref: DynamicDialogRef;

  constructor(private messageService: MessageService,
              private trackService: TrackService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.getTracks()
  }

  async getTracks () {
    this.isLoading = true
    this.trackService.getAllUsersTrack().subscribe(async (resp: any) => {
        this.data = resp.filter((item: any) => {
          return !!item.track;
        })
      },
      (error: any) => {
      console.log('error', error)
    },
      () => {
      this.isLoading = false
    })
  }

  getBackground (item: any) {
    if (item.track.receivedInAlmatyDate) {
      return '#34f55f'
    } else if (item.track.fromChinaToAlmaty) {
      return '#ff9292'
    } else if (item.track.receivedInChinaDate) {
      return '#ffe94e'
    }
    return '#ffffff'
  }

  getTypeText(item: any) {
    if (item.track.receivedInAlmatyDate) {
      const date = getFormattedDate(item.track.receivedInAlmatyDate).split(' ')[0]
      return 'в Алматы' + ' - ' + date
    } else if (item.track.fromChinaToAlmaty) {
      const date =  getFormattedDate(item.track.fromChinaToAlmaty).split(' ')[0]
      return 'отправлено из Китая' + ' - ' + date
    } else if (item.track.receivedInChinaDate) {
      const date = getFormattedDate(item.track.receivedInChinaDate).split(' ')[0]
      return 'на складе в Китае' + ' - ' + date
    }
    return ''
  }

  cardClick(item: any) {
    this.ref = this.dialogService.open(CardComponent, {
      header: 'Детальная информация',
      width: '90%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000,
      data: {item}
    });

    this.ref.onClose.subscribe(() =>{
      this.getTracks()
    });
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Вы действительно хотите удалить трек номер?'});
  }

  openDialog () {
    this.ref = this.dialogService.open(DialogComponent, {
      header: 'Добавление трек номера',
      width: '90%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((data) =>{
      if (data) {
        this.isLoading = true
        this.trackService.addUsersTrack(data).subscribe(() => {
          this.messageService.add({
            severity: "success",
            summary: "Успешно",
            detail: "Трек номер успешно добавлен!"
          });
          this.getTracks()
        }, (err) => {
          this.messageService.add({
            severity: "info",
            summary: "Ошибка",
            detail: err.error.message
          });
          console.log('err', err)
          this.isLoading = false
        })
      }
    });
  }

}





