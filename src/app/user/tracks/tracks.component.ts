import { Component, OnInit } from '@angular/core'
import {ConfirmationService, MessageService} from 'primeng/api'
import {TrackService} from "../../services/track.service"
import {UsersTrack } from '../../models/response/track-models'
// @ts-ignore
import {getFormattedDate} from '../../functionServices/dataService'
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {DialogComponent} from "../dialog/dialog.component";
import {Track} from '../../models/response/track-models'

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

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Вы действительно хотите удалить трек номер?'});
  }

  deleteTrack (track: any) {
    try {
      this.confirmationService.confirm({
        message: 'Вы уверены что хотите удалить ' + track.track.trackNumber + '?',
        header: 'Подтверждение',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.trackService.unfollowTrack(track._id).toPromise().then(() => {
            this.messageService.add({
              severity: "success",
              summary: "Успешно",
              detail: "Трек номер успешно удален!"
            });
            this.getTracks()
          }).catch((err) => {
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
    } catch (e) {
      console.log('e', e)
    }

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





