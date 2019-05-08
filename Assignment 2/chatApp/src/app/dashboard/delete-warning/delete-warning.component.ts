import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.css']
})
export class DeleteWarningComponent implements OnInit {

  item: string;

  constructor( public dialogRef: MatDialogRef<DeleteWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {  
    this.item = data.item;
    console.log('DATA: ', data);
  }

  ngOnInit() {

  }

}
